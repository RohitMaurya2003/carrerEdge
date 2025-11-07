import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tools as toolsData } from "../data/tools";
import { Search, Heart, Star, ExternalLink, Filter, Zap, Sparkles, BookOpen, ChevronDown, Crown, TrendingUp, Users, Rocket } from "lucide-react";

const Category = ({ cat, favorites, toggleFavorite }) => {
  const [open, setOpen] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl"
    >
      <motion.div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.1 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 flex items-center justify-center"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {cat.category}
            </h3>
            <p className="text-slate-400 text-sm mt-1">{cat.items.length} premium tools</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {cat.items.map((t, index) => {
              const isFav = favorites.includes(t.name);
              return (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ 
                    scale: 1.03,
                    y: -4,
                  }}
                  onHoverStart={() => setHoveredCard(t.name)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="relative group"
                >
                  {/* Glow Effect */}
                  <motion.div
                    animate={{ 
                      opacity: hoveredCard === t.name ? [0.3, 0.6, 0.3] : 0,
                      scale: hoveredCard === t.name ? [1, 1.05, 1] : 1
                    }}
                    transition={{ duration: 2, repeat: hoveredCard === t.name ? Infinity : 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl blur-md"
                  />
                  
                  <motion.a
                    href={t.link}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300 h-full overflow-hidden"
                  >
                    {/* Premium Badge */}
                    {t.premium && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-2 -right-2 z-10"
                      >
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <Crown className="w-3 h-3" />
                          PRO
                        </div>
                      </motion.div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                        >
                          {t.name.charAt(0)}
                        </motion.div>
                        <div>
                          <h4 className="font-bold text-white text-sm leading-tight">{t.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                            <span className="text-slate-400 text-xs ml-1">5.0</span>
                          </div>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(t.name);
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-rose-500/20 group-hover:border-rose-500/30 transition-all duration-300"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-all ${
                            isFav
                              ? "fill-rose-500 text-rose-500 animate-pulse"
                              : "text-slate-400 group-hover:text-rose-400"
                          }`}
                        />
                      </motion.button>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-2">
                      {t.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {t.tags?.slice(0, 3).map((tag, tagIndex) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: tagIndex * 0.1 }}
                          className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-xs text-cyan-300 font-medium"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                        Explore Tool
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                      <motion.div
                        animate={{ 
                          rotate: hoveredCard === t.name ? [0, 10, -10, 0] : 0 
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      </motion.div>
                    </motion.div>
                  </motion.a>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StudentHelper = () => {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("student:favorites") || "[]");
    } catch (e) {
      return [];
    }
  });

  const toggleFavorite = (toolName) => {
    setFavorites((cur) => {
      const exists = cur.includes(toolName);
      const next = exists ? cur.filter((t) => t !== toolName) : [...cur, toolName];
      localStorage.setItem("student:favorites", JSON.stringify(next));
      return next;
    });
  };

  const categories = useMemo(() => [...new Set(toolsData.map(c => c.category))], []);

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase();
    let base = toolsData
      .map((c) => ({ 
        ...c, 
        items: c.items.filter((i) => 
          (i.name + " " + i.desc + " " + (i.tags?.join(' ') || '')).toLowerCase().includes(q)
        ) 
      }))
      .filter((c) => c.items.length > 0);

    if (activeCategory !== "all") {
      base = base.filter(c => c.category === activeCategory);
    }

    if (view === "favorites") {
      return base
        .map((c) => ({ ...c, items: c.items.filter((i) => favorites.includes(i.name)) }))
        .filter((c) => c.items.length > 0);
    }

    return base;
  }, [query, view, favorites, activeCategory]);

  const stats = [
    { icon: Users, value: "500+", label: "Tools" },
    { icon: TrendingUp, value: "10K+", label: "Students" },
    { icon: Rocket, value: "99%", label: "Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
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

      <div className="relative z-10 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl"
            >
              <Sparkles className="size-5 text-cyan-400" />
              <span className="text-cyan-300 font-semibold">AI-Powered Learning Tools</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-4">
              Student Helper
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover the best AI tools and resources to accelerate your learning journey
            </p>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
                >
                  <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-6">
                {/* Search */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative group"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-cyan-400 transition-colors w-4 h-4" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search AI tools..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
                  />
                </motion.div>

                {/* View Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "all", label: "All Tools", icon: Zap },
                      { id: "favorites", label: "Favorites", icon: Heart },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => setView(item.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                            view === item.id
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Categories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <h3 className="flex items-center gap-2 text-slate-300 font-semibold text-sm mb-3">
                    <Filter className="w-4 h-4" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <motion.button
                      onClick={() => setActiveCategory("all")}
                      whileHover={{ x: 5 }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeCategory === "all"
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      All Categories
                    </motion.button>
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        whileHover={{ x: 5 }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          activeCategory === category
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Featured Tool */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold mb-3">
                    <Crown className="w-4 h-4" />
                    Featured Tool
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        C
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white text-sm">ChatGPT</div>
                        <div className="text-slate-400 text-xs">Advanced AI Assistant</div>
                      </div>
                    </div>
                    <motion.a
                      href="https://chat.openai.com"
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="block w-full text-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold shadow-lg transition-all"
                    >
                      Try Now
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {filtered.length > 0 ? (
                    filtered.map((cat, index) => (
                      <motion.section
                        key={cat.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <Category 
                          cat={cat} 
                          favorites={favorites} 
                          toggleFavorite={toggleFavorite} 
                        />
                      </motion.section>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10"
                    >
                      <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">No tools found</h3>
                      <p className="text-slate-400 text-lg">
                        Try adjusting your search or filters
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHelper;