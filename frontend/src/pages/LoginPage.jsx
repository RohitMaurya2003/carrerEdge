import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, Sparkles, Zap, Shield, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
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
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
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

      <div className="flex justify-center items-center min-h-screen relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-4"
        >
          {/* Main Login Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-white/5 rounded-2xl border border-white/10"
              >
                <Sparkles className="size-5 text-cyan-400" />
                <span className="text-cyan-300 font-semibold text-sm">Welcome Back</span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-2"
              >
                Sign In
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-slate-300 text-sm"
              >
                Welcome back! Please enter your details to continue
              </motion.p>
            </motion.div>

            {/* Login Form */}
            <motion.form 
              variants={containerVariants}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
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
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={isLoggingIn}
                whileHover={!isLoggingIn ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isLoggingIn ? { scale: 0.98 } : {}}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {isLoggingIn ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-3"
                    >
                      <Loader2 className="size-5 animate-spin" />
                      Signing In...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signin"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-3"
                    >
                      <User className="size-5" />
                      Sign In
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>

            {/* Divider */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center my-6"
            >
              <div className="flex-1 border-t border-white/10"></div>
              <span className="px-4 text-slate-400 text-sm">or</span>
              <div className="flex-1 border-t border-white/10"></div>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <p className="text-slate-400 text-sm">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300 inline-flex items-center gap-1 group"
                >
                  Create account
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

            {/* Features */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10"
            >
              {[
                { icon: Shield, label: "Secure", color: "text-green-400" },
                { icon: Zap, label: "Fast", color: "text-yellow-400" },
                { icon: MessageSquare, label: "Support", color: "text-blue-400" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center p-2"
                >
                  <feature.icon className={`size-5 ${feature.color} mx-auto mb-1`} />
                  <div className="text-xs text-slate-400">{feature.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-6"
          >
            <p className="text-slate-500 text-xs">
              By continuing, you agree to our{" "}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Privacy Policy
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;