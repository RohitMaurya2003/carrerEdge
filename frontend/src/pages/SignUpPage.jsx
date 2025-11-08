import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User, Sparkles, Zap, Crown, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "mentee",
  });
  const [isFocused, setIsFocused] = useState({ 
    fullName: false, 
    email: false, 
    password: false 
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
    }
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
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const roleBenefits = {
    mentee: [
      "🎯 Personalized mentorship",
      "📚 Learning resources",
      "🚀 Career guidance",
      "💼 Job opportunities"
    ],
    mentor: [
      "🌟 Share expertise",
      "💡 Inspire others",
      "🏆 Build reputation",
      "🔗 Network growth"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${20 + (i * 5) % 80}%`,
            }}
          />
        ))}
      </div>

      <div className="flex justify-center items-center min-h-screen relative z-10 p-4">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/5 rounded-2xl border border-white/10"
              >
                <Sparkles className="size-5 text-cyan-400" />
                <span className="text-cyan-300 font-semibold text-sm">Join Our Community</span>
              </motion.div>

              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-6">
                Start Your Journey
              </h2>

              {/* Role Selection Benefits */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Crown className="size-5 text-yellow-400" />
                    As a {formData.role === "mentee" ? "Mentee" : "Mentor"}
                  </h3>
                  <div className="space-y-3">
                    {roleBenefits[formData.role].map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 text-slate-300"
                      >
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        {benefit}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  {[
                    { label: "Active Members", value: "10K+", color: "text-green-400" },
                    { label: "Success Stories", value: "2K+", color: "text-purple-400" },
                    { label: "Expert Mentors", value: "500+", color: "text-cyan-400" },
                    { label: "Countries", value: "50+", color: "text-yellow-400" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="text-center p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Signup Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center mb-8">
                <motion.h1 
                  className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-2"
                >
                  Create Account
                </motion.h1>
                <motion.p className="text-slate-300 text-sm">
                  Join thousands of professionals growing together
                </motion.p>
              </motion.div>

              {/* Signup Form */}
              <motion.form 
                variants={containerVariants}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                {/* Full Name Input */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
                    <User className="size-4 text-cyan-400" />
                    Full Name
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm pl-11"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      onFocus={() => setIsFocused({ ...isFocused, fullName: true })}
                      onBlur={() => setIsFocused({ ...isFocused, fullName: false })}
                    />
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 size-5 transition-colors duration-300 ${
                      isFocused.fullName ? 'text-cyan-400' : 'text-slate-400'
                    }`} />
                  </motion.div>
                </motion.div>

                {/* Email Input */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
                    <Mail className="size-4 text-cyan-400" />
                    Email Address
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="relative"
                  >
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm pl-11"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setIsFocused({ ...isFocused, email: true })}
                      onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    />
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 size-5 transition-colors duration-300 ${
                      isFocused.email ? 'text-cyan-400' : 'text-slate-400'
                    }`} />
                  </motion.div>
                </motion.div>

                {/* Password Input */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
                    <Lock className="size-4 text-cyan-400" />
                    Password
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="relative"
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm pl-11 pr-11"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setIsFocused({ ...isFocused, password: true })}
                      onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    />
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 size-5 transition-colors duration-300 ${
                      isFocused.password ? 'text-cyan-400' : 'text-slate-400'
                    }`} />
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </motion.button>
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-slate-400 mt-1"
                  >
                    Must be at least 6 characters
                  </motion.p>
                </motion.div>

                {/* Role Selection */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
                    <Shield className="size-4 text-cyan-400" />
                    I want to join as
                  </label>
                  <motion.div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "mentee", label: "Mentee", description: "I want to learn", icon: "🎓" },
                      { value: "mentor", label: "Mentor", description: "I want to teach", icon: "🌟" },
                    ].map((roleOption) => (
                      <motion.button
                        key={roleOption.value}
                        type="button"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, role: roleOption.value })}
                        className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                          formData.role === roleOption.value
                            ? "bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/25"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-2xl mb-2">{roleOption.icon}</div>
                        <div className="font-semibold text-white text-sm">{roleOption.label}</div>
                        <div className="text-slate-400 text-xs">{roleOption.description}</div>
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={isSigningUp}
                  whileHover={!isSigningUp ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isSigningUp ? { scale: 0.98 } : {}}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait">
                    {isSigningUp ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-3"
                      >
                        <Loader2 className="size-5 animate-spin" />
                        Creating Account...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="signup"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-3"
                      >
                        <Zap className="size-5" />
                        Create Account
                        <ArrowRight className="size-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.form>

              {/* Sign In Link */}
              <motion.div 
                variants={itemVariants}
                className="text-center mt-6 pt-6 border-t border-white/10"
              >
                <p className="text-slate-400 text-sm">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    Sign in
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;