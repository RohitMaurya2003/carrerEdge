import dotenv from "dotenv";
dotenv.config();

// Controller to call Perplexity API and return the summarized text
export const summarizeTopic = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ message: "Missing topic in request body" });

    const payload = {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content:
            "You are an AI summarizer that provides concise bullet-point news highlights. Write 3–5 short points about the requested topic. At the end, include one source link in this format: 'Source: <link>'. Do not include numbered citations or multiple URLs.",
        },
        {
          role: "user",
          content: `Give me the latest news in ${topic}.`,
        },
      ],
      max_tokens: 250,
      return_citations: true,
      search_recency_filter: "day",
    };

    const resPerf = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resPerf.ok) {
      const text = await resPerf.text();
      const leaked = /leak|leaked|reported as leaked|API key/i.test(text);
      if (leaked) {
        console.error("Perplexity API key issue:", text);
        return res.status(502).json({ message: "AI provider rejected server API key. Please rotate PERPLEXITY_API_KEY and retry." });
      }
      return res.status(502).json({ message: "Perplexity API error", detail: text });
    }

    const data = await resPerf.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return res.status(500).json({ message: "No content returned from Perplexity" });

    // Return only the content string to the frontend
    return res.json({ result: content });
  } catch (error) {
    console.error("Perplexity summarize error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
