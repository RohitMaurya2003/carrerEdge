import { useState } from "react";
import api from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, Target, Sparkles, Download, Star, Zap, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ResumeReviewer = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [role, setRole] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (f) => {
    if (!f) return;
    if (!role || !role.trim()) {
      setError("Please enter the target role before uploading (e.g. 'Frontend Engineer').");
      return;
    }

    setFileName(f.name);
    setFileLoading(true);
    setUploadProgress(0);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("role", role);
  const res = await api.post("/gemini/resume-review-upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });
      setResult(res.data);
      // refresh progress activities in local cache if user is authenticated
      try {
        if (authUser) {
          const resp = await api.get("/gemini/activities");
          const docs = resp.data.activities || [];
          const mapped = docs.map((d) => ({ type: d.type, date: d.createdAt, name: d.meta?.name, level: d.meta?.level }));
          localStorage.setItem("progressEvents:v1", JSON.stringify(mapped));
        }
      } catch (e) {
        // ignore refresh errors
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err.message);
      if (err?.response?.status === 401) navigate("/login");
    } finally {
      setFileLoading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    uploadFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer?.files?.[0];
    if (!f) return;
    uploadFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto py-12 px-4 relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <Sparkles className="size-6 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">AI-Powered Resume Analysis</span>
          </motion.div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-4">
            Resume Review
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get instant, actionable feedback tailored to your target role. AI-powered insights to land your dream job.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 backdrop-blur-sm border border-white/20 shadow-2xl">
              {/* Target Role Input */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="flex items-center gap-2 text-cyan-300 font-semibold mb-3">
                  <Target className="size-5" />
                  Target Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Data Scientist, Product Manager"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl placeholder:text-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm"
                />
              </motion.div>

              {/* Upload Area */}
              <motion.div variants={itemVariants}>
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`group block rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer ${
                    isDragging 
                      ? 'border-cyan-400 bg-cyan-500/20 scale-105' 
                      : 'border-white/20 bg-white/5 hover:border-cyan-400 hover:bg-cyan-500/10'
                  } ${!role.trim() ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  <motion.div
                    animate={isDragging ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 1, repeat: isDragging ? Infinity : 0 }}
                  >
                    <UploadCloud className="mx-auto mb-4 size-12 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
                  </motion.div>
                  
                  <div className="text-lg font-semibold text-white mb-2">Upload Your Resume</div>
                  <div className="text-sm text-slate-300 mb-4">PDF or DOCX files supported</div>
                  
                  {fileName ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center gap-2 text-cyan-300 font-medium"
                    >
                      <FileText className="size-4" />
                      {fileName}
                    </motion.div>
                  ) : (
                    <div className="text-xs text-slate-400">Click to browse or drag & drop</div>
                  )}

                  {/* Upload Progress */}
                  {uploadProgress > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 space-y-2"
                    >
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="text-xs text-cyan-300 font-medium">
                        Uploading... {uploadProgress}%
                      </div>
                    </motion.div>
                  )}

                  {!role.trim() && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 text-xs text-amber-300 bg-amber-500/10 px-3 py-2 rounded-lg"
                    >
                      Please enter your target role to enable upload
                    </motion.div>
                  )}
                  
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={!role.trim()}
                  />
                </label>
              </motion.div>
            </div>

            {/* Features */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              {/* {[
                { icon: Zap, text: "Instant Analysis", color: "from-yellow-500 to-orange-500" },
                { icon: TrendingUp, text: "ATS Optimized", color: "from-green-500 to-emerald-500" },
                { icon: Star, text: "Role Specific", color: "from-purple-500 to-pink-500" },
                { icon: Download, text: "Actionable Tips", color: "from-blue-500 to-cyan-500" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/5 rounded-2xl p-4 text-center border border-white/10 backdrop-blur-sm"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-2`}>
                    <feature.icon className="size-5 text-white" />
                  </div>
                  <div className="text-xs font-medium text-slate-300">{feature.text}</div>
                </motion.div>
              ))} */}
            </motion.div>
          </motion.div>

          {/* Results Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Error State */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-sm">!</span>
                    </div>
                    <h3 className="font-semibold text-red-300">Error</h3>
                  </div>
                  <p className="text-red-200/80 text-sm">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
                </motion.div>
              )}

              {/* Loading State */}
              {fileLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-8 text-center border border-white/20 backdrop-blur-sm"
                >
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin mx-auto" />
                    <FileText className="size-6 text-cyan-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-cyan-300 font-semibold mb-2">Analyzing Your Resume</h3>
                  <p className="text-slate-400 text-sm">Our AI is reviewing your resume for {role} positions...</p>
                </motion.div>
              )}

              {/* Results */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 border border-white/20 backdrop-blur-sm shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Sparkles className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">AI Resume Review</h3>
                      <p className="text-cyan-300 text-sm">Tailored for {role}</p>
                    </div>
                  </div>

                  {result.review ? (
                    <div className="space-y-6">
                      {/* Summary */}
                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-white/5 rounded-2xl p-5 border border-white/10"
                      >
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <FileText className="size-4 text-cyan-400" />
                          Executive Summary
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{result.review.summary}</p>
                      </motion.div>

                      {/* Strengths */}
                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white/5 rounded-2xl p-5 border border-white/10"
                      >
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <Star className="size-4 text-green-400" />
                          Key Strengths
                        </h4>
                        <ul className="space-y-2">
                          {(result.review.strengths || []).map((s, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      {/* Improvements */}
                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-white/5 rounded-2xl p-5 border border-white/10"
                      >
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <TrendingUp className="size-4 text-amber-400" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-3">
                          {(result.review.improvements || []).map((imp, i) => (
                            <li key={i} className="text-sm">
                              <div className="font-medium text-amber-300 mb-1">
                                {imp.issue || imp.title || `Improvement ${i + 1}`}
                              </div>
                              <div className="text-slate-300">{imp.suggestion || imp.detail || imp}</div>
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      {/* Suggested Bullets */}
                      {result.review.suggestedBullets && result.review.suggestedBullets.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-white/5 rounded-2xl p-5 border border-white/10"
                        >
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Zap className="size-4 text-purple-400" />
                            Suggested Bullet Points
                          </h4>
                          <ul className="space-y-2">
                            {(result.review.suggestedBullets || []).map((b, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                      <h4 className="font-semibold text-white mb-3">AI Suggestions</h4>
                      <ul className="space-y-2">
                        {(result.reviewText || "").split(/\r?\n/).filter(Boolean).map((line, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                            {line.replace(/^[-•\s]+/, "").trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeReviewer;