import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, ArrowLeft, Sparkles, Zap, Save, User, Bot, Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/axios";
import { toast, Toaster } from "react-hot-toast";

const MODEL_NAME = import.meta?.env?.VITE_GEMINI_MODEL || "gemini-2.5-flash";

const AiLearn = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [messages, setMessages] = useState([
    { 
      sender: "ai", 
      text: "Hi — I'm your AI mentor. Ask me anything about careers, interviews, or coding.",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  useEffect(() => {
    console.info("Using Gemini model (frontend):", MODEL_NAME);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const simulateTyping = async (text, callback, signal) => {
    setIsTyping(true);
    const words = (text || "").split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      if (signal?.aborted) break;
      currentText += (i === 0 ? "" : " ") + words[i];
      callback(currentText);
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
    }
    setIsTyping(false);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      try { abortControllerRef.current.abort(); } catch (e) { /* ignore */ }
      abortControllerRef.current = null;
    }
    setLoading(false);
    setIsTyping(false);
    setMessages(prev => prev.filter(msg => msg.sender !== "ai-typing"));
    toast("Generation stopped to save tokens.");
  };

  const sendMessage = async (text) => {
    if (!text || loading) return;

    const userMessage = { sender: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // create an AbortController so the user can cancel generation to save tokens
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Limit response length on the server by requesting a maxOutputTokens value.
      // This reduces token usage on the Gemini API.
      const DEFAULT_MAX_TOKENS = 250; // adjust as needed (250 tokens ~ short paragraph)
      // Use the centralized axios instance so requests go to the configured backend (VITE_API_URL)
      const axiosRes = await api.post(
        "/gemini/generate",
        { text, model: MODEL_NAME, maxOutputTokens: DEFAULT_MAX_TOKENS },
        { signal: controller.signal }
      );

      const data = axiosRes?.data?.data || axiosRes?.data;
      // Extract text; ensure we have a readable fallback
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data).slice(0, 1000);

      // Client-side safeguard: truncate very long responses to avoid filling UI and consuming client memory.
      const MAX_CHARS = 3500; // hard cap on characters we'll show in the UI
      let aiTextTruncated = aiText;
      let wasTruncated = false;
      if (aiText && aiText.length > MAX_CHARS) {
        aiTextTruncated = aiText.slice(0, MAX_CHARS) + "\n\n... (truncated)";
        wasTruncated = true;
      }
      
      // Remove any existing typing indicator
      setMessages(prev => prev.filter(msg => msg.sender !== "ai-typing"));
      
      // Add typing animation (pass controller.signal so typing can stop when aborted)
      await simulateTyping(aiTextTruncated, (currentText) => {
        setMessages(prev => {
          const withoutTyping = prev.filter(msg => msg.sender !== "ai-typing");
          return [...withoutTyping, { sender: "ai-typing", text: currentText, timestamp: new Date() }];
        });
      }, abortControllerRef.current?.signal);

      // Replace typing with final message
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.sender !== "ai-typing");
        return [...withoutTyping, { sender: "ai", text: aiTextTruncated, timestamp: new Date() }];
      });

      if (wasTruncated) {
        toast("Answer was truncated to save tokens and keep responses concise.");
      }

    } catch (err) {
      if (err?.name === 'AbortError') {
        // user aborted generation
        setMessages(prev => {
          const withoutTyping = prev.filter(msg => msg.sender !== "ai-typing");
          return [...withoutTyping, { sender: "ai", text: "⚠️ Generation stopped by user to save tokens.", timestamp: new Date() }];
        });
        toast("Generation stopped to save tokens.");
      } else {
        console.error("Unexpected error calling Gemini:", err);
        setMessages((prev) => [...prev, { sender: "ai", text: `⚠️ Something went wrong: ${err?.message || err}`, timestamp: new Date() }]);
      }
    } finally {
      setLoading(false);
      setIsTyping(false);
      if (abortControllerRef.current) abortControllerRef.current = null;
    }
  };

  const saveChatToServer = async () => {
    if (!authUser) {
      toast.error("Please log in to save chats");
      navigate("/login");
      return;
    }

    try {
      const res = await api.post("/gemini/save", {
        messages: messages.map((m) => ({ sender: m.sender, text: m.text })),
        model: MODEL_NAME,
      });

      if (res?.data?.chatId) {
        toast.success("Chat saved successfully! 💾");
        try {
          const ares = await api.get("/gemini/activities");
          const docs = ares.data.activities || [];
          const mapped = docs.map((d) => ({ type: d.type, date: d.createdAt, name: d.meta?.name, level: d.meta?.level }));
          localStorage.setItem("progressEvents:v1", JSON.stringify(mapped));
        } catch (e) {
          // ignore
        }
      } else {
        toast.success("Chat saved!");
      }
    } catch (err) {
      console.error("Error saving chat", err);
      toast.error("Failed to save chat");
    }
  };

  const exportChat = () => {
    const chatText = messages.map(m => 
      `${m.sender === 'user' ? 'You' : 'AI Mentor'}: ${m.text}\n${new Date(m.timestamp).toLocaleString()}\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-mentor-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Chat exported! 📄");
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "How can I prepare for a technical interview?",
    "What are the latest trends in web development?",
    "Can you explain machine learning basics?",
    "How do I improve my problem-solving skills?",
  ];

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${(i * 8) % 100}%`,
              top: `${20 + (i * 6) % 80}%`,
            }}
          />
        ))}
      </div>

      <Toaster position="top-right" />

      <div className="relative z-10 flex flex-col min-h-screen pt-20">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col p-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>

              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl border border-white/20">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    AI Mentor
                  </h1>
                  <p className="text-slate-300 text-sm">Powered by Google Gemini {MODEL_NAME}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportChat}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              {loading && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // stop in-progress generation
                    if (typeof stopGeneration === 'function') stopGeneration();
                  }}
                  className="p-3 rounded-2xl bg-red-600/80 text-white border border-red-400/30 hover:bg-red-600/100 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                >
                  Stop
                </motion.button>
              )}
              
              {authUser ? (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveChatToServer}
                  className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border border-cyan-400/30 transition-all duration-300 flex items-center gap-2 text-sm font-medium shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Save Chat
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  Login to Save
                </motion.button>
              )}
            </motion.div>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-6 max-w-4xl mx-auto w-full">
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      layout
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} items-end gap-3`}
                    >
                      {/* AI Avatar */}
                      {message.sender !== "user" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg"
                        >
                          <Bot className="w-4 h-4 text-white" />
                        </motion.div>
                      )}

                      {/* Message Bubble */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`max-w-[80%] rounded-2xl p-4 backdrop-blur-sm border ${
                          message.sender === "user"
                            ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400/30 shadow-lg shadow-cyan-500/25 rounded-br-md"
                            : "bg-white/10 text-slate-100 border-white/20 shadow-lg shadow-purple-500/10 rounded-bl-md"
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {message.text}
                        </div>
                        <div className={`text-xs mt-2 ${
                          message.sender === "user" ? "text-cyan-100/70" : "text-slate-400"
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </motion.div>

                      {/* User Avatar */}
                      {message.sender === "user" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                        >
                          <User className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading Indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start items-end gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/10 text-slate-100 rounded-2xl p-4 border border-white/20 shadow-lg">
                      <div className="flex items-center gap-2 text-slate-300">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                        />
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                        />
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                        />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={endRef} className="h-4" />
              </div>
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={question}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendMessage(question)}
                    className="p-3 text-left bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 text-slate-300 hover:text-white text-sm backdrop-blur-sm"
                  >
                    <Zap className="w-4 h-4 text-cyan-400 inline mr-2" />
                    {question}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Input Area */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSend}
              className="mt-6 relative"
            >
              <div className="flex gap-3 items-end">
                <motion.textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about careers, tech, interviews..."
                  className="flex-1 min-h-[60px] max-h-32 resize-none rounded-2xl px-5 py-4 bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm custom-scrollbar"
                  rows={1}
                />

                <motion.button
                  type="submit"
                  disabled={loading || !input.trim()}
                  whileHover={!loading && input.trim() ? { scale: 1.05, rotate: 5 } : {}}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    loading || !input.trim()
                      ? "bg-slate-600/50 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg"
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: input ? 1 : 0 }}
                className="text-xs text-slate-400 mt-2 ml-1"
              >
                Press Enter to send • Shift+Enter for new line
              </motion.p>
            </motion.form>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-6 text-slate-400 text-sm"
          >
            <p>
              Powered by <span className="font-mono text-cyan-300">{MODEL_NAME}</span> • 
              Your conversations are processed securely
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AiLearn;