const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export const generateContent = async (req, res) => {
  try {
  const { text, model, role, maxOutputTokens } = req.body;
  if (!text) return res.status(400).json({ error: "Missing 'text' in request body" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Server missing GEMINI_API_KEY" });

    const modelName = model || "gemini-2.5-flash";
    const url = `${GEMINI_BASE}/${modelName}:generateContent?key=${apiKey}`;

    // Build request body for Gemini. The API returned an error for unknown top-level fields
    // such as maxOutputTokens on this endpoint, so instead we inject a short instruction
    // into the prompt asking the model to keep the response concise when the client
    // provided a maxOutputTokens value.
    let clampTokens = null;
    if (maxOutputTokens && Number.isFinite(Number(maxOutputTokens))) {
      clampTokens = Math.max(8, Math.min(2000, Number(maxOutputTokens)));
    }

    const tokenInstruction = clampTokens
      ? `\n\nPlease keep your response concise. Aim for approximately ${clampTokens} tokens or fewer.`
      : "";

    const body = { contents: [{ parts: [{ text: `${text}${tokenInstruction}` }] }] };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await r.text();
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch (err) {
      // fall through
    }

    if (!r.ok) {
      const providerError = data || raw;
      const leaked = (providerError && ((providerError.message && /leak|leaked|reported as leaked/i.test(providerError.message)) || (providerError.status && providerError.status === 'PERMISSION_DENIED')));
      if (leaked) {
        console.error("Gemini API key leak detected:", providerError);
        return res.status(502).json({ error: "AI provider rejected server API key (reported leaked). Please rotate GEMINI_API_KEY and retry." });
      }
      return res.status(r.status).json({ error: providerError || `Status ${r.status}` });
    }

    return res.json({ data: data });
  } catch (err) {
    console.error("Gemini proxy error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const saveChat = async (req, res) => {
  try {
    const Chat = (await import("../models/chat.model.js")).default;
    const user = req.user; // provided by protectRoute

    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { messages, model } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ error: "messages array required" });

    const chat = new Chat({ userId: user._id, model: model || "gemini-2.5-flash", messages });
    await chat.save();

    // Log activity
    try {
      const Activity = (await import("../models/activity.model.js")).default;
      if (Activity) {
        const a = new Activity({ userId: user._id, type: "chat", meta: { chatId: chat._id, messages: messages.length } });
        await a.save();
      }
    } catch (e) {
      console.warn("Failed to log activity for chat", e?.message || e);
    }

    return res.json({ message: "saved", chatId: chat._id });
  } catch (err) {
    console.error("Error saving chat", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const user = req.user; // optional, may be undefined if route not protected
    const { text, model, role } = req.body;
    if (!text) return res.status(400).json({ error: "Missing 'text' in request body" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Server missing GEMINI_API_KEY" });

    const modelName = model || "gemini-2.5-flash";
    const url = `${GEMINI_BASE}/${modelName}:generateContent?key=${apiKey}`;

    // Prompt: request a concise 5-6 bullet point plain-text review (no JSON), tailored to role if provided
    const roleText = role ? `The candidate is applying for the role: ${role}. ` : "";
    const prompt = `You are an expert resume reviewer for early-career candidates. ${roleText}Read the resume below and provide 5-6 concise improvement suggestions as plain text bullet points (each 1 short sentence) tailored to the target role when applicable. Do NOT return JSON — only plain bullets. Be specific and actionable.` +
      `\n\nResume:\n"""\n${text}\n"""\n\nReturn 5-6 bullets only.`;

    const body = { contents: [{ parts: [{ text: prompt }] }] };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await r.text();
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch (err) {
      // fall back
    }

    if (!r.ok) {
      const providerError = data || raw;
      const leaked = (providerError && ((providerError.message && /leak|leaked|reported as leaked/i.test(providerError.message)) || (providerError.status && providerError.status === 'PERMISSION_DENIED')));
      if (leaked) {
        console.error("Gemini API key leak detected:", providerError);
        return res.status(502).json({ error: "AI provider rejected server API key (reported leaked). Please rotate GEMINI_API_KEY and retry." });
      }
      return res.status(r.status).json({ error: providerError || `Status ${r.status}` });
    }

    // Extract the generated text from the expected proto shape if present
    let generated = null;
    try {
      generated = data?.candidates?.[0]?.content?.parts?.[0]?.text || (typeof data === "string" ? data : null);
    } catch (err) {
      generated = null;
    }

    // Log activity for resume review if user is authenticated
    try {
      if (user) {
        const Activity = (await import("../models/activity.model.js")).default;
        if (Activity) {
          const a = new Activity({ userId: user._id, type: "resume_review", meta: { length: (text || "").length } });
          await a.save();
        }
      }
    } catch (e) {
      console.warn("Failed to log resume review activity", e?.message || e);
    }

    // Return the generated review text. We intentionally do NOT persist reviews.
    return res.json({ reviewText: generated || raw });
  } catch (err) {
    console.error("resumeReview error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resumeReviewUpload = async (req, res) => {
  try {
    const user = req.user;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const filename = file.originalname || "upload";
    const lower = filename.toLowerCase();
    let text = "";

    // Use pdf-parse for PDFs and mammoth for DOCX
    if (lower.endsWith(".pdf") || file.mimetype === "application/pdf") {
      const pdfParse = (await import("pdf-parse")).default;
      try {
        const data = await pdfParse(file.buffer);
        text = data.text || "";
      } catch (err) {
        console.error("pdf parse error", err);
        return res.status(500).json({ error: "Failed to extract text from PDF" });
      }
    } else if (lower.endsWith(".docx") || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const mammoth = (await import("mammoth")).default;
      try {
        const { value } = await mammoth.extractRawText({ buffer: file.buffer });
        text = value || "";
      } catch (err) {
        console.error("mammoth error", err);
        return res.status(500).json({ error: "Failed to extract text from DOCX" });
      }
    } else {
      return res.status(400).json({ error: "Unsupported file type. Please upload PDF or DOCX." });
    }

    if (!text || text.trim().length === 0) return res.status(400).json({ error: "Uploaded file contains no extractable text." });

    // Build the same prompt as the text-based resumeReview
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Server missing GEMINI_API_KEY" });

    const modelName = "gemini-2.5-flash";
    const url = `${GEMINI_BASE}/${modelName}:generateContent?key=${apiKey}`;

    const prompt = `You are an expert resume reviewer for early-career candidates. Read the resume below and provide 5-6 concise improvement suggestions as plain text bullet points (each 1 short sentence). Do NOT return JSON — only plain bullets. Be specific and actionable.` +
      `\n\nResume:\n"""\n${text}\n"""\n\nReturn 5-6 bullets only.`;

    const body = { contents: [{ parts: [{ text: prompt }] }] };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await r.text();
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch (err) {
      // ignore
    }

    if (!r.ok) {
      const providerError = data || raw;
      const leaked = (providerError && ((providerError.message && /leak|leaked|reported as leaked/i.test(providerError.message)) || (providerError.status && providerError.status === 'PERMISSION_DENIED')));
      if (leaked) {
        console.error("Gemini API key leak detected:", providerError);
        return res.status(502).json({ error: "AI provider rejected server API key (reported leaked). Please rotate GEMINI_API_KEY and retry." });
      }
      return res.status(r.status).json({ error: providerError || `Status ${r.status}` });
    }

    let generated = null;
    try {
      generated = data?.candidates?.[0]?.content?.parts?.[0]?.text || (typeof data === "string" ? data : null);
    } catch (err) {
      generated = null;
    }

    // Log activity for resume review upload if user authenticated
    try {
      if (user) {
        const Activity = (await import("../models/activity.model.js")).default;
        if (Activity) {
          const a = new Activity({ userId: user._id, type: "resume_review", meta: { filename: filename, length: (text || "").length } });
          await a.save();
        }
      }
    } catch (e) {
      console.warn("Failed to log resume upload activity", e?.message || e);
    }

    // Return generated text only.
    return res.json({ reviewText: generated || raw });
  } catch (err) {
    console.error("resumeReviewUpload error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getActivities = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const Activity = (await import("../models/activity.model.js")).default;
    const docs = await Activity.find({ userId: user._id }).sort({ createdAt: -1 }).limit(500).lean();
    return res.json({ activities: docs });
  } catch (err) {
    console.error("getActivities error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
