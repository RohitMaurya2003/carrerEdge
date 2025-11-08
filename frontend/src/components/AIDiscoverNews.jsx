import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";

const categories = [
  { key: "Technology", label: "Technology", icon: "💻", color: "from-blue-500 to-cyan-500" },
  { key: "Finance", label: "Finance", icon: "📈", color: "from-green-500 to-emerald-500" },
  { key: "Sports", label: "Sports", icon: "⚽", color: "from-orange-500 to-red-500" },
  { key: "AI", label: "AI", icon: "🤖", color: "from-purple-500 to-pink-500" },
];

function parseContent(content) {
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  let source = null;
  const bullets = [];
  
  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (lower.startsWith("source:")) {
      source = line.replace(/^[sS]ource:\s*/i, "").trim();
    } else if (line.startsWith("-") || line.match(/^•/)) {
      bullets.push(line.replace(/^[-\s•]+/, "").trim());
    } else if (line.length < 160) {
      bullets.push(line);
    }
  });
  
  return { bullets, source };
}

export default function AIDiscoverNews({ className = "" }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchTopic = async (topic) => {
    try {
      setSelected(topic);
      setLoading(true);
      setResult(null);
      setError(null);

  const res = await api.post("/discover/summarize", { topic });
      const content = res.data?.result;
      if (!content) throw new Error("No content returned");
      setResult(content);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  const closeNews = () => {
    setResult(null);
    setSelected(null);
    setError(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className={`py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <span className="text-2xl">✨</span>
            <span className="text-sm font-medium text-cyan-300">AI-Powered News Discovery</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-4">
            Stay Informed with AI
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get instant, AI-curated news summaries across various topics. Click any category to explore the latest updates.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.key}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -4,
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchTopic(category.key)}
              disabled={loading}
              className={`relative p-6 rounded-2xl text-left transition-all duration-300 backdrop-blur-sm border ${
                selected === category.key
                  ? `bg-gradient-to-br ${category.color} text-white border-transparent shadow-2xl shadow-cyan-500/25`
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{category.label}</h3>
              <p className="text-sm text-white/70">Latest updates & trends</p>
              
              {selected === category.key && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-2xl border-2 border-white/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDelay: '-0.5s' }} />
              </div>
              <p className="mt-4 text-cyan-300 font-medium">Fetching latest {selected} news...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-6 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⚠️</span>
                <h4 className="font-semibold text-red-300">Unable to load news</h4>
              </div>
              <p className="text-red-200/80 text-sm">{error}</p>
              <button
                onClick={closeNews}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-200 text-sm transition-colors"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && !loading && (
            <motion.div
              key="result"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm shadow-2xl"
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={closeNews}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 hover:text-white transition-all duration-200 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl">
                  📰
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Latest {selected} News</h3>
                  <p className="text-cyan-300 text-sm">AI-curated summary</p>
                </div>
              </div>

              <div className="space-y-4">
                {parseContent(result).bullets.map((bullet, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                    <p className="text-slate-200 group-hover:text-white transition-colors leading-relaxed">
                      {bullet}
                    </p>
                  </motion.div>
                ))}
              </div>

              {parseContent(result).source && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <p className="text-sm text-slate-400 mb-2">Source:</p>
                  <a 
                    href={parseContent(result).source} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors text-sm font-medium group"
                  >
                    {parseContent(result).source}
                    <span className="group-hover:translate-x-1 transition-transform">↗</span>
                  </a>
                </motion.div>
              )}

              {/* Bottom Close Button for Mobile */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={closeNews}
                className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Close News
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Categories Button when news is open */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center mt-6"
            >
              <button
                onClick={closeNews}
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl transition-all duration-200 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Categories
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}