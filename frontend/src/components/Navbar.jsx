import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Menu, X, GroupIcon, Brain, Rocket, Sparkles } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [favCount, setFavCount] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const read = () => {
      try {
        const arr = JSON.parse(localStorage.getItem("student:favorites") || "[]");
        setFavCount(Array.isArray(arr) ? arr.length : 0);
      } catch (e) {
        setFavCount(0);
      }
    };
    read();
    window.addEventListener("storage", (e) => {
      if (e.key === "student:favorites") read();
    });
  }, []);

  const navItems = [
    { path: "/chat", label: "Chats", icon: GroupIcon, auth: true },
    { path: "/resume-review", label: "Review Resume", icon: null },
    { path: "/progress", label: "Progress", icon: null },
    { path: "/student-helper", label: "Student Helper", icon: Brain, badge: favCount },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? "bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-cyan-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
        : "bg-gradient-to-r from-slate-900 via-purple-900 to-cyan-900 backdrop-blur-md"
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-conic from-transparent via-purple-500/10 to-transparent animate-spin-slow"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo with animation */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group relative"
          onMouseEnter={() => setHoveredItem('logo')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-cyan-500/25">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Career Edge
            </span>
            <div className={`h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transform origin-left transition-all duration-300 ${
              hoveredItem === 'logo' ? 'scale-x-100' : 'scale-x-0'
            }`}></div>
          </div>
        </Link>

        {/* Quick action button */}
        <button 
          onClick={() => window.open("https://www.resume-now.com/build-resume?utm_source=google&utm_medium=sem&utm_campaign=20457377013&utm_term=create+resume&network=g&device=c&adposition=&adgroupid=152901458136&placement=&adid=687406850081&gad_source=1&gad_campaignid=20457377013&gbraid=0AAAAADEP8E7wyCFQA0rl6Ce9tkHYmvwxd&gclid=CjwKCAiA3rPKBhBZEiwAhPNFQM-KZ0zSolibwsR122IySWmyvQeAK07mDjRGNh6sDtRAui0fUw6wCBoCPd0QAvD_BwE", "_blank")} 
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="font-semibold text-sm relative z-10">Create Resume</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            if (item.auth && !authUser) return null;
            
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative px-4 py-2 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'text-white bg-white/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="font-medium">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-lg animate-bounce">
                      {item.badge}
                    </span>
                  )}
                </div>
                
                {/* Hover effect */}
                <div className={`absolute bottom-0 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transform -translate-x-1/2 transition-all duration-300 ${
                  hoveredItem === item.path ? 'scale-x-100' : 'scale-x-0'
                }`}></div>
              </button>
            );
          })}

          {/* Profile/Login */}
          <div className="ml-2">
            {authUser ? (
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                onMouseEnter={() => setHoveredItem('profile')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative">
                  <User className="w-5 h-5" />
                  <div className={`absolute -inset-1 bg-cyan-500/20 rounded-full blur-sm transition-all duration-300 ${
                    hoveredItem === 'profile' ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                </div>
                <span className="font-medium">Profile</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                onMouseEnter={() => setHoveredItem('login')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setOpen((s) => !s)} 
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300 relative group"
          >
            {open ? (
              <X className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Menu className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" />
            )}
            <div className="absolute inset-0 border border-cyan-400/50 rounded-xl animate-ping group-hover:animate-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Mobile menu with glass morphism */}
      {open && (
        <div className="md:hidden bg-gradient-to-b from-slate-900/98 to-purple-900/98 backdrop-blur-2xl border-t border-white/10 p-6 shadow-2xl">
          <div className="flex flex-col gap-3">
            {[
              { path: "/", label: "Home" },
              { path: "/mentor-fetch", label: "Mentors" },
              { path: "/ai-learn", label: "AI Mentor" },
              { path: "/resume-review", label: "Resume Reviewer" },
              { path: "/progress", label: "Progress" },
              { path: "/student-helper", label: `Student Helper ${favCount > 0 ? `(${favCount})` : ''}` },
              ...(authUser ? [{ path: "/profile", label: "Profile" }] : [{ path: "/login", label: "Login" }])
            ].map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 group ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
            
            <button 
              onClick={() => {
                window.open("https://www.resume-now.com/build-resume?utm_source=google&utm_medium=sem&utm_campaign=20457377013&utm_term=create+resume&network=g&device=c&adposition=&adgroupid=152901458136&placement=&adid=687406850081&gad_source=1&gad_campaignid=20457377013&gbraid=0AAAAADEP8E7wyCFQA0rl6Ce9tkHYmvwxd&gclid=CjwKCAiA3rPKBhBZEiwAhPNFQM-KZ0zSolibwsR122IySWmyvQeAK07mDjRGNh6sDtRAui0fUw6wCBoCPd0QAvD_BwE", "_blank");
                setOpen(false);
              }} 
              className="mt-4 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
            >
              Create Resume
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;