import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Heart,
  Sparkles,
  Zap,
  MessageCircle,
  BookOpen,
  Calendar,
  TrendingUp,
  Code,
  Database,
  Cloud,
  Smartphone,
  Cpu
} from "lucide-react";

const techDomains = [
  { icon: Code, name: "Frontend Development", color: "from-blue-500 to-cyan-500" },
  { icon: Database, name: "Backend Development", color: "from-green-500 to-emerald-500" },
  { icon: Smartphone, name: "Mobile Development", color: "from-purple-500 to-pink-500" },
  { icon: Cpu, name: "Data Science", color: "from-orange-500 to-red-500" },
  { icon: Cloud, name: "Cloud & DevOps", color: "from-indigo-500 to-purple-500" },
  { icon: Zap, name: "AI & Machine Learning", color: "from-teal-500 to-blue-500" },
];

export default function Footer({ onShowResources, onShowSchedule }) {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const handleMentor = () => {
    if (authUser?.role === "mentor") {
      navigate("/request-fetch");
    } else if (authUser?.role === "mentee") {
      navigate("/mentor-fetch");
    } else {
      navigate("/login");
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-t border-white/10 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
        
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            animate={{
              y: [0, 50, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${(i * 12) % 100}%`,
              top: `${10 + (i * 10) % 50}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-1"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl border border-white/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                MentorHub
              </motion.span>
            </motion.div>
            
            <motion.p 
              className="text-slate-300 mb-8 leading-relaxed text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Empowering learners worldwide with personalized mentorship, 
              cutting-edge resources, and AI-powered guidance to accelerate 
              your career growth and transform your professional journey.
            </motion.p>
            
            <div className="flex space-x-3">
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/rohit-maurya-122869281/", label: "LinkedIn", color: "from-blue-500 to-cyan-500" },
                { icon: Twitter, href: "https://x.com/RohitMaury91919", label: "Twitter", color: "from-sky-500 to-blue-500" },
                { icon: Github, href: "https://github.com/RohitMaurya2003", label: "GitHub", color: "from-purple-500 to-pink-500" },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20`}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
          >
            <motion.h3 
              className="text-lg font-bold text-white mb-6 flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              <Zap className="w-5 h-5 text-cyan-400" />
              Quick Links
            </motion.h3>
            <ul className="space-y-4">
              {[
                { name: "Find Mentors", action: handleMentor, icon: MessageCircle },
                { name: "Resources Hub", action: () => (onShowResources ? onShowResources() : navigate("/")), icon: BookOpen },
                { name: "Schedule Session", action: () => (onShowSchedule ? onShowSchedule() : navigate("/")), icon: Calendar },
                { name: "AI Learning", action: () => navigate("/ai-learn"), icon: Sparkles },
                { name: "Progress Tracking", action: () => navigate("/progress"), icon: TrendingUp },
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <motion.button
                    onClick={link.action}
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="text-slate-300 hover:text-cyan-400 transition-all duration-300 flex items-center group text-sm font-medium"
                  >
                    <link.icon className="w-4 h-4 mr-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="flex-1 text-left">{link.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Tech Domains */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
          >
            <motion.h3 
              className="text-lg font-bold text-white mb-6 flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              <Code className="w-5 h-5 text-purple-400" />
              Tech Domains
            </motion.h3>
            <ul className="space-y-4">
              {techDomains.map((domain, index) => (
                <motion.li
                  key={domain.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center text-slate-300 group hover:text-white transition-all duration-300 cursor-pointer">
                    <motion.div 
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${domain.color} mr-3 shadow-lg`}
                      whileHover={{ scale: 1.3 }}
                    />
                    <domain.icon className="w-4 h-4 mr-2 text-slate-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium group-hover:scale-105 transition-transform">
                      {domain.name}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.3 }}
          >
            <motion.h3 
              className="text-lg font-bold text-white mb-6 flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              <MessageCircle className="w-5 h-5 text-cyan-400" />
              Get In Touch
            </motion.h3>
            
            <div className="space-y-4 mb-6">
              {[
                { icon: Mail, text: "Rohit@rohit.com", color: "text-cyan-400" },
                { icon: Phone, text: "+1 (555) 123-4567", color: "text-green-400" },
                { icon: MapPin, text: "Navi Mumbai, India", color: "text-purple-400" },
              ].map((contact, index) => (
                <motion.div
                  key={contact.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center text-slate-300 group hover:text-white transition-colors"
                >
                  <contact.icon className={`w-4 h-4 mr-3 ${contact.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-sm">{contact.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Stay Updated
              </h4>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg"
                >
                  Join Newsletter
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <motion.p 
            className="text-slate-400 text-sm flex items-center gap-1"
            whileHover={{ scale: 1.02 }}
          >
            © 2025 Career Edge. All rights reserved. Made with 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-rose-500 mx-1" />
            </motion.span>
            for the developer community.
          </motion.p>
          
          <motion.div 
            className="flex space-x-6 mt-4 md:mt-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="text-slate-400 hover:text-cyan-400 text-sm transition-colors font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}