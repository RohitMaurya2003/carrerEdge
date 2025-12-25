import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, Plus, TrendingUp, Award, FileText, MessageSquare, Zap, Crown, Lock, Sparkles, Target, BarChart3, Calendar, Activity } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// Simple localStorage-backed event tracking for progress
const STORAGE_KEY = "progressEvents:v1";

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]";
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function formatDateKey(d) {
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10);
}

// Enhanced Line Chart with animations
const LineChart = ({ points = [], width = 600, height = 140 }) => {
  if (!points || points.length === 0) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-sm text-slate-400">No activity data yet</div>
    </div>
  );
  
  const max = Math.max(...points.map((p) => p.value), 1);
  const stepX = width / Math.max(points.length - 1, 1);
  const path = points
    .map((p, i) => {
      const x = i * stepX;
      const y = height - (p.value / max) * (height - 20) - 10;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="relative">
      <svg width={width} height={height} className="mx-auto block">
        {/* Gradient Area */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path 
          d={`${path} L ${width} ${height} L 0 ${height} Z`} 
          fill="url(#lineGradient)" 
        />
        
        {/* Main line */}
        <motion.path
          d={path}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Data points */}
        {points.map((p, i) => {
          const x = i * stepX;
          const y = height - (p.value / max) * (height - 20) - 10;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              fill="#06b6d4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.5, fill: "#22d3ee" }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Enhanced Bar Chart with animations
const BarChart = ({ items = [], width = 600, height = 160 }) => {
  if (!items || items.length === 0) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-sm text-slate-400">No skills tracked yet</div>
    </div>
  );
  
  const max = Math.max(...items.map((i) => i.value), 1);
  const barW = Math.min(width / items.length - 12, 60);

  return (
    <svg width={width} height={height} className="mx-auto block">
      {items.map((it, idx) => {
        const x = idx * (barW + 12) + 6;
        const h = (it.value / max) * (height - 40);
        const y = height - h - 30;
        
        return (
          <g key={it.name}>
            <motion.rect
              x={x}
              y={height - 20}
              width={barW}
              height={0}
              fill="#7c3aed"
              rx={6}
              initial={{ height: 0, y: height - 20 }}
              animate={{ height: h, y: y }}
              transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }}
              whileHover={{ fill: "#8b5cf6", y: y - 2 }}
            />
            <motion.text
              x={x + barW / 2}
              y={height - 6}
              fontSize={11}
              textAnchor="middle"
              fill="#cbd5e1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.2 + 0.5 }}
            >
              {it.name}
            </motion.text>
            <motion.text
              x={x + barW / 2}
              y={y - 8}
              fontSize={10}
              textAnchor="middle"
              fill="#e2e8f0"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.2 + 0.7 }}
            >
              {it.value}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
};

const ProgressPage = () => {
  const { authUser, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const [events, setEvents] = useState(() => loadEvents());
  const [type, setType] = useState("session");
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  // If user is authenticated, load activities from server
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!authUser) {
        navigate("/login");
        return;
      }
      setIsLoading(true);
      try {
  const res = await api.get("/gemini/activities");
        const docs = res.data.activities || [];
        const mapped = docs.map((d) => {
          const ev = { type: d.type, date: d.createdAt };
          if (d.type === "skill") {
            ev.name = d.meta?.name;
            ev.level = d.meta?.level;
          }
          return ev;
        });
        if (mounted) setEvents(mapped);
      } catch (err) {
        console.error("Failed to load activities:", err);
        toast.error("Failed to load activities");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [authUser, navigate]);

  const isSubscribed = Boolean(
    authUser?.subscription?.active || localStorage.getItem("subscribed") === "true"
  );

  const SUBSCRIPTION_AMOUNT = 100;

  async function buySubscription() {
    try {
  const res = await api.post("/payments/create-order", { amount: SUBSCRIPTION_AMOUNT });
      const { orderId, amount, currency, keyId } = res.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Career Edge",
        description: "Progress Tracker Subscription (30 days)",
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post("/payments/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            await checkAuth();
            localStorage.setItem("subscribed", "true");
            toast.success("🎉 Subscription activated! Welcome to premium.");
            navigate("/progress");
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: authUser?.fullName || "",
          email: authUser?.email || "",
        },
        theme: { color: "#7c3aed" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Failed to create order:", err);
      toast.error("Failed to initialize payment");
    }
  }

  const summary = useMemo(() => {
    const total = events.length;
    const sessions = events.filter((e) => e.type === "session").length;
    const resumes = events.filter((e) => e.type === "resume_review").length;
    const chats = events.filter((e) => e.type === "chat").length;
    const skills = events.filter((e) => e.type === "skill").length;
    return { total, sessions, resumes, chats, skills };
  }, [events]);

  const last14 = useMemo(() => {
    const days = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return formatDateKey(d);
    });
    return days.map((day) => ({ date: day, value: events.filter((ev) => formatDateKey(ev.date) === day).length }));
  }, [events]);

  const skills = useMemo(() => {
    const map = {};
    events
      .filter((e) => e.type === "skill")
      .forEach((s) => {
        map[s.name] = s.level;
      });
    return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
  }, [events]);

  function addEvent(e) {
    e.preventDefault();
    if (type === "skill") {
      if (!skillName.trim()) {
        toast.error("Please enter a skill name");
        return;
      }
      const newEvent = { type: "skill", name: skillName, level: Number(skillLevel), date: new Date().toISOString() };
      setEvents((cur) => [...cur, newEvent]);
      setSkillName("");
      setSkillLevel(5);
      toast.success(`🎯 ${skillName} skill updated to level ${skillLevel}`);
      return;
    }
    
    const eventTypes = {
      session: "🎉 Study session completed",
      resume_review: "📄 Resume reviewed",
      chat: "💬 Practice chat completed"
    };
    
    const newEvent = { type, date: new Date().toISOString() };
    setEvents((cur) => [...cur, newEvent]);
    toast.success(eventTypes[type] || "Activity logged successfully");
  }

  function clearAll() {
    if (!confirm("Clear all progress events? This cannot be undone.")) return;
    setEvents([]);
    toast.success("All progress cleared");
  }

  function exportEvents() {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progress-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Progress data exported");
  }

  const activityTypes = [
    { value: "session", label: "Study Session", icon: Zap, color: "from-green-500 to-emerald-500" },
    { value: "resume_review", label: "Resume Review", icon: FileText, color: "from-blue-500 to-cyan-500" },
    { value: "chat", label: "Practice Chat", icon: MessageSquare, color: "from-purple-500 to-pink-500" },
    { value: "skill", label: "Skill Update", icon: Target, color: "from-orange-500 to-red-500" },
  ];

  const stats = [
    { label: "Total Activities", value: summary.total, icon: Activity, color: "text-cyan-400" },
    { label: "Study Sessions", value: summary.sessions, icon: Zap, color: "text-green-400" },
    { label: "Resume Reviews", value: summary.resumes, icon: FileText, color: "text-blue-400" },
    { label: "Practice Chats", value: summary.chats, icon: MessageSquare, color: "text-purple-400" },
    { label: "Skills Tracked", value: summary.skills, icon: Target, color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
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

      <div className="relative z-10 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl border border-white/20">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  Progress Tracker
                </h1>
                <p className="text-slate-300 text-sm">Monitor your learning journey and skill development</p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportEvents}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAll}
                className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 text-sm font-medium text-rose-300"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Subscription Overlay */}
          <AnimatePresence>
            {!isSubscribed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"></div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <Crown className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">Unlock Progress Tracking</h2>
                  <p className="text-slate-300 mb-6">
                    Get detailed analytics and insights into your learning journey with premium access
                  </p>

                  <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-4 mb-6">
                    <div className="text-4xl font-bold text-white mb-1">₹1</div>
                    <div className="text-slate-400 text-sm">One month premium access</div>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={buySubscription}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Sparkles className="w-5 h-5" />
                      Unlock Premium Features
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate(-1)}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-3 px-6 rounded-xl font-semibold transition-all duration-300"
                    >
                      Maybe Later
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className={isSubscribed ? "" : "filter blur-sm pointer-events-none"}>
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-400 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Activity Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white">14-Day Activity</h3>
                </div>
                <LineChart points={last14} width={500} height={160} />
              </motion.div>

              {/* Skills Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Skill Levels</h3>
                </div>
                <BarChart items={skills} width={500} height={160} />
              </motion.div>
            </div>

            {/* Add Activity Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 mb-6"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Log New Activity
              </h3>
              
              <form onSubmit={addEvent} className="space-y-4">
                {/* Activity Type Selection */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {activityTypes.map((activity) => (
                    <motion.button
                      key={activity.value}
                      type="button"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setType(activity.value)}
                      className={`p-3 rounded-xl border transition-all duration-300 text-left ${
                        type === activity.value
                          ? `bg-gradient-to-br ${activity.color} text-white border-transparent shadow-lg`
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <activity.icon className="w-5 h-5 mb-2" />
                      <div className="font-semibold text-sm">{activity.label}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Dynamic Form Fields */}
                {type === "skill" ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="text-sm text-slate-300 font-medium mb-2 block">Skill Name</label>
                      <input
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        placeholder="e.g., React, Python, Communication"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 font-medium mb-2 block">Skill Level (1-10)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={skillLevel}
                          onChange={(e) => setSkillLevel(e.target.value)}
                          className="flex-1"
                        />
                        <span className="text-cyan-400 font-bold w-8 text-center">{skillLevel}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : null}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Log Activity
                </motion.button>
              </form>
            </motion.section>

            {/* Activity Log */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Activity History
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                <AnimatePresence>
                  {events.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-slate-400"
                    >
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No activities yet. Start logging your progress above!</p>
                    </motion.div>
                  ) : (
                    events.slice().reverse().map((event, index) => (
                      <motion.div
                        key={`${event.date}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            event.type === 'session' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                            event.type === 'resume_review' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                            event.type === 'chat' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                            'bg-gradient-to-br from-orange-500 to-red-500'
                          }`}>
                            {event.type === 'session' && <Zap className="w-5 h-5 text-white" />}
                            {event.type === 'resume_review' && <FileText className="w-5 h-5 text-white" />}
                            {event.type === 'chat' && <MessageSquare className="w-5 h-5 text-white" />}
                            {event.type === 'skill' && <Target className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {event.type === 'skill' ? `${event.name} (Level ${event.level})` : 
                               event.type === 'session' ? 'Study Session Completed' :
                               event.type === 'resume_review' ? 'Resume Reviewed' : 'Practice Chat'}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {new Date(event.date).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Award className="w-4 h-4 text-yellow-400" />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;

