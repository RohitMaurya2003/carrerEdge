import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { toast, Toaster } from "react-hot-toast";

import {
    BookOpen,
    Calendar,
    Search,
    TrendingUp,
    ArrowRight,
    FileText,
    Notebook,
    Rocket,
    Link as LinkIcon,
    Brain,
    Sun,
    Moon,
    X,
    MessageCircle,
    User,
    Home,
    Bell,
    Instagram,
    Linkedin,
    Twitter,
    Github,
    Mail,
    MapPin,
    Phone,
    Heart,
    Shield,
    Users,
    Award,
    Clock,
    Zap,
    Star,
    ChevronRight,
    Globe,
    Code,
    Database,
    Smartphone,
    Cloud,
    Server,
} from "lucide-react";
import { tools as toolsData } from "../data/tools";
import AIDiscoverNews from "../components/AIDiscoverNews";
import Footer from "../components/Footer";

const resourcesData = [
    { title: "Roadmaps", desc: "Step-by-step guides to master skills.", icon: Rocket, link: "https://roadmap.sh" },
    { title: "Notes", desc: "Quick revision notes for interviews.", icon: Notebook, link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
    { title: "Projects", desc: "Real-world project ideas & templates.", icon: FileText, link: "https://www.youtube.com/playlist?list=PL6QREj8te1P6wX9m5KnicnDVEucbOPsqR" },
    { title: "Interview Prep", desc: "DSA patterns & mock questions.", icon: BookOpen, link: "https://leetcode.com/studyplan/top-interview-150/" },
    { title: "Cheat Sheets", desc: "Handy syntax & key concepts.", icon: Calendar, link: "https://www.programiz.com" },
    { title: "External Links", desc: "Curated best internet resources.", icon: LinkIcon, link: "https://www.reuters.com/technology/" },
];

// Mock mentors data for search
const mockMentors = [
    { id: 1, name: "Sarah Johnson", role: "Frontend Developer", expertise: ["React", "TypeScript", "UI/UX"] },
    { id: 2, name: "Mike Chen", role: "Backend Engineer", expertise: ["Node.js", "Python", "AWS"] },
    { id: 3, name: "Priya Sharma", role: "Data Scientist", expertise: ["Python", "ML", "Data Analysis"] },
    { id: 4, name: "Alex Rivera", role: "DevOps Engineer", expertise: ["Docker", "Kubernetes", "CI/CD"] },
];

// Stats data
const statsData = [
    { number: "500+", label: "Active Mentors", icon: Users },
    { number: "10K+", label: "Students Helped", icon: Award },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
    { number: "24/7", label: "Support", icon: Clock },
];

// Features data
const featuresData = [
    { icon: Zap, title: "Lightning Fast", desc: "Quick matching with ideal mentors" },
    { icon: Shield, title: "Secure", desc: "Your data and sessions are protected" },
    { icon: Star, title: "Premium Quality", desc: "Verified experts and curated content" },
    { icon: Heart, title: "Community Driven", desc: "Learn and grow together" },
];

// Tech domains data
const techDomains = [
    { icon: Code, name: "Frontend Development", color: "from-blue-500 to-cyan-500" },
    { icon: Server, name: "Backend Development", color: "from-green-500 to-emerald-500" },
    { icon: Smartphone, name: "Mobile Development", color: "from-purple-500 to-pink-500" },
    { icon: Database, name: "Data Science", color: "from-orange-500 to-red-500" },
    { icon: Cloud, name: "Cloud & DevOps", color: "from-indigo-500 to-purple-500" },
    { icon: Brain, name: "AI & Machine Learning", color: "from-teal-500 to-blue-500" },
];

const HomePage = () => {
    const navigate = useNavigate();
    const { authUser, checkAuth } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [showResources, setShowResources] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    
    const [showAIChat, setShowAIChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem("onboardingCompleted"));

    // New UI state for modern enhancements
    const [counters, setCounters] = useState([0, 0, 0, 0]);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        date: "",
        time: "",
        message: "",
    });

    useEffect(() => {
        const getUser = async () => {
            await checkAuth();
            setLoading(false);
        };
        getUser();

        // (removed local navbar scroll listener — global Navbar is used)

        // Check for saved theme preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
        }

        // animate counters on mount
        const targets = [500, 10000, 95, 24];
        const durations = [1400, 1600, 1200, 1000];
        targets.forEach((t, idx) => {
            const start = Date.now();
            const from = 0;
            const raf = () => {
                const now = Date.now();
                const progress = Math.min(1, (now - start) / durations[idx]);
                const value = Math.floor(from + (t - from) * progress);
                setCounters((prev) => {
                    const copy = [...prev];
                    copy[idx] = value;
                    return copy;
                });
                if (progress < 1) requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
        });

        return () => {};
    }, [checkAuth]);

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = [];

        // Search in mentors
        mockMentors.forEach(mentor => {
            if (
                mentor.name.toLowerCase().includes(query) ||
                mentor.role.toLowerCase().includes(query) ||
                mentor.expertise.some(skill => skill.toLowerCase().includes(query))
            ) {
                results.push({ type: "mentor", ...mentor });
            }
        });

        // Search in resources
        resourcesData.forEach(resource => {
            if (
                resource.title.toLowerCase().includes(query) ||
                resource.desc.toLowerCase().includes(query)
            ) {
                results.push({ type: "resource", ...resource });
            }
        });

        setSearchResults(results.slice(0, 6)); // Limit results
    }, [searchQuery]);

    const handleMentor = () => {
        if (authUser?.role === "mentor") {
            navigate("/request-fetch");
            toast.success("Redirecting to requests...");
        } else if (authUser?.role === "mentee") {
            navigate("/mentor-fetch");
            toast.success("Finding mentors for you...");
        } else {
            navigate("/login");
            toast.loading("Please login to continue");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
    e.preventDefault();

    toast.promise(
        emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            formData,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        ),
        {
            loading: "Scheduling your session...",
            success: () => {
                setShowSchedule(false);
                setFormData({
                    name: "",
                    email: "",
                    date: "",
                    time: "",
                    message: ""
                });
                return "✅ Session request sent successfully!";
            },
            error: (error) => {
                console.error("EmailJS Error:", error.text);
                return "❌ Failed to send request. Please try again.";
            },
        }
    );
};

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
    };

    const completeOnboarding = () => {
        setShowOnboarding(false);
        localStorage.setItem("onboardingCompleted", "true");
    };

    // ✅ Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const item = {
        hidden: { y: 40, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    // ✅ Google Calendar Link Helper
    const generateGoogleCalendarLink = (title, description, date, time) => {
        if (!date || !time) return "#";

        const startDateTime = new Date(`${date}T${time}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

        const start = startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const end = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, "");

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title
        )}&dates=${start}/${end}&details=${encodeURIComponent(
            description
        )}&sf=true&output=xml`;
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
            />
        </div>
    );

    // Using the global Navbar component from components/Navbar.jsx —
    // removed the local Navbar to avoid duplicate headers and dynamic overlap.
    // -----------------------------
    // Search Modal
    // -----------------------------
    const SearchModal = () => (
        <AnimatePresence>
            {showSearch && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-start justify-center pt-20 px-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
                    >
                        {/* Search Header */}
                        <div className="p-4 border-b border-slate-700">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search mentors, resources, topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-700 text-white pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setShowSearch(false)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Search Results */}
                        <div className="overflow-y-auto max-h-96">
                            {searchResults.length > 0 ? (
                                <div className="p-4 space-y-3">
                                    {searchResults.map((result, index) => (
                                        <motion.div
                                            key={`${result.type}-${result.id || index}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer border-l-4 border-cyan-500"
                                            onClick={() => {
                                                if (result.type === "mentor") {
                                                    handleMentor();
                                                } else {
                                                    setShowResources(true);
                                                }
                                                setShowSearch(false);
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-white">{result.name || result.title}</h3>
                                                    <p className="text-slate-300 text-sm mt-1">
                                                        {result.role || result.desc}
                                                    </p>
                                                    {result.expertise && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {result.expertise.map((skill, i) => (
                                                                <span key={i} className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    result.type === "mentor" 
                                                        ? "bg-purple-500/20 text-purple-300" 
                                                        : "bg-green-500/20 text-green-300"
                                                }`}>
                                                    {result.type}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : searchQuery.trim() !== "" ? (
                                <div className="p-8 text-center text-slate-400">
                                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No results found for "{searchQuery}"</p>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Search for mentors, resources, or topics...</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // -----------------------------
    // Floating AI Chat
    // -----------------------------
    const FloatingAIChat = () => (
        <>
            {/* Chat Toggle Button */}
            <motion.button
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAIChat(true)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-2xl flex items-center justify-center group"
            >
                <Brain className="w-6 h-6 text-white" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {showAIChat && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
                    >
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-cyan-600 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">AI Mentor</h3>
                                    <p className="text-cyan-100 text-xs">Online • Powered by Gemini</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAIChat(false)}
                                className="text-white hover:text-cyan-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="h-64 p-4 overflow-y-auto bg-slate-900/50">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-2">
                                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Brain className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="bg-slate-700 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                                        <p className="text-sm text-white">Hello! I'm your AI mentor. How can I help you with your learning journey today?</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat Input */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-800 border-t border-slate-700">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/ai-learn")}
                                    className="bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                                >
                                    Go to Full Chat
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    // -----------------------------
    // Onboarding Walkthrough
    // -----------------------------
    const OnboardingWalkthrough = () => (
        <AnimatePresence>
            {showOnboarding && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-700"
                    >
                        {/* Onboarding Content */}
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <motion.h1
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4"
                                >
                                    Welcome to MentorHub! 🚀
                                </motion.h1>
                                <p className="text-slate-300 text-lg">
                                    Let's quickly show you around your new learning platform
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                {[
                                    { icon: User, title: "Find Mentors", desc: "Connect with experts in your field" },
                                    { icon: Calendar, title: "Schedule Sessions", desc: "Book 1-on-1 mentorship sessions" },
                                    { icon: Brain, title: "AI Assistant", desc: "Get instant help from our AI mentor" },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ y: 40, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="bg-slate-700/50 rounded-xl p-6 text-center border border-slate-600"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                                        <p className="text-slate-300 text-sm">{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={completeOnboarding}
                                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-12 py-4 rounded-full font-semibold text-lg shadow-2xl"
                                >
                                    Start Learning Journey
                                </motion.button>
                                <button
                                    onClick={completeOnboarding}
                                    className="block mx-auto mt-4 text-slate-400 hover:text-white transition-colors"
                                >
                                    Skip tour
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // -----------------------------
// -----------------------------
// Quote Section (appears above footer)
const QuoteSection = () => (
    <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl text-center"
        >
            <div className="mx-auto max-w-3xl">
                <svg className="w-10 h-10 mx-auto text-cyan-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6v4H9zM9 13h6v4H9z" />
                </svg>
                <blockquote className="text-xl md:text-2xl text-slate-100 italic leading-relaxed">“Learning is not a race — it’s a practice. Consistency compounds into mastery.”</blockquote>
                <div className="mt-4 text-slate-400">— Elon Musk</div>
                {/* <div className="mt-6 flex items-center justify-center gap-3">
                    <a href="/progress" className="inline-flex items-center px-4 py-2 bg-cyan-500 text-black rounded-full font-semibold hover:opacity-90 transition">Track Your Progress</a>
                    <a href="/ai-learn" className="inline-flex items-center px-4 py-2 border border-slate-700 text-slate-200 rounded-full hover:bg-slate-800 transition">Explore AI Mentor</a>
                </div> */}
            </div>
        </motion.div>
    </section>
);

    // Mentor Carousel (crazy, interactive)
    const MentorCarousel = () => {
        const containerRef = useRef(null);

        useEffect(() => {
            const el = containerRef.current;
            if (!el) return;
            let pos = 0;
            const step = 1;
            let rafId;
            const loop = () => {
                if (!el) return;
                pos += step;
                if (pos > el.scrollWidth / 2) pos = 0;
                el.scrollLeft = pos;
                rafId = requestAnimationFrame(loop);
            };
            rafId = requestAnimationFrame(loop);
            return () => cancelAnimationFrame(rafId);
        }, []);

        return (
            <section className="relative z-10 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">Top Mentors — Featured</h3>
                    <div ref={containerRef} className="flex gap-6 overflow-x-hidden no-scrollbar" style={{scrollBehavior:'smooth'}}>
                        {[...mockMentors, ...mockMentors].map((m, i) => (
                            <motion.div key={`${m.id}-${i}`} whileHover={{ scale: 1.05, rotate: -1 }} className="min-w-[260px] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-lg font-semibold">{m.name}</h4>
                                        <p className="text-slate-400 text-sm">{m.role}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">{m.name.charAt(0)}</div>
                                </div>
                                <p className="text-slate-300 text-sm mb-4">Expert in {m.expertise.join(", ")}. Personalized guidance and project reviews.</p>
                                <div className="flex gap-2">
                                    <button onClick={() => navigate('/mentor-fetch')} className="flex-1 bg-cyan-500 text-black px-3 py-2 rounded-md font-semibold">Connect</button>
                                    <button onClick={() => setShowSignUpModal(true)} className="px-3 py-2 border border-slate-700 rounded-md">Preview</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    // Testimonial slider (auto-advance)
    const TestimonialSlider = () => {
        const testimonials = [
            { text: "MentorHub changed my career trajectory — 1:1 sessions are gold.", name: "Aisha K." },
            { text: "AI suggestions helped me optimize my resume in minutes.", name: "Carlos M." },
            { text: "The mentors are extremely supportive and practical.", name: "Leena P." },
        ];
        useEffect(() => {
            const id = setInterval(() => setTestimonialIndex(i => (i + 1) % testimonials.length), 3500);
            return () => clearInterval(id);
        }, []);
        return (
            <section className="relative z-10 py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.blockquote key={testimonialIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
                        <p className="text-xl text-slate-200 italic">“{testimonials[testimonialIndex].text}”</p>
                        <footer className="mt-4 text-slate-400">— {testimonials[testimonialIndex].name}</footer>
                    </motion.blockquote>
                </div>
            </section>
        );
    };

    // Sign-up modal
    const SignUpModal = () => (
        <AnimatePresence>
            {showSignUpModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-slate-700">
                        <h3 className="text-2xl font-bold mb-4">Join the Waitlist</h3>
                        <p className="text-slate-400 mb-4">Get early access to mentor sessions and exclusive resources.</p>
                        <input placeholder="Your email" className="w-full px-4 py-3 rounded-md bg-slate-800 border border-slate-700 text-white mb-3" />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowSignUpModal(false)} className="px-4 py-2">Cancel</button>
                            <button onClick={() => { setShowSignUpModal(false); toast.success('Thanks! We will reach out.'); }} className="px-4 py-2 bg-cyan-500 text-black rounded-md font-semibold">Join</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    

    // -----------------------------
    // Stats Section Component
    // -----------------------------
    const StatsSection = () => (
        <section className="relative py-20 bg-slate-800/30 border-y border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <stat.icon className="w-8 h-8 text-cyan-400" />
                            </div>
                            <motion.h3 
                                className="text-3xl font-bold text-white mb-2"
                                whileInView={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {stat.number}
                            </motion.h3>
                            <p className="text-slate-400 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );

    // -----------------------------
    // Features Section Component
    // -----------------------------
    const FeaturesSection = () => (
        <section className="relative py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 mb-4">
                        Why Choose MentorHub?
                    </h2>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        We provide everything you need to accelerate your learning journey and career growth
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuresData.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 text-center group hover:border-cyan-500/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-7 h-7 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );

    // -----------------------------
    // Resources Page (Enhanced with Glassmorphism)
    // -----------------------------
    if (showResources) {
        return (
            <div className="relative min-h-screen bg-slate-900 text-white overflow-hidden">
                <Toaster position="top-right" />
                {/* global Navbar from App handles the header */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-slate-900 opacity-70"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-70"
                        initial={{
                            top: Math.random() * window.innerHeight,
                            left: Math.random() * window.innerWidth,
                        }}
                        animate={{ y: [0, -50, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{
                            duration: 8 + Math.random() * 6,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
                <section className="relative z-10 py-24 px-8 text-center pt-20">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-extrabold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400"
                    >
                        📚 Resources Hub
                    </motion.h1>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {resourcesData.map(({ title, desc, icon: Icon, link }, i) => (
                            <motion.a
                                key={i}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ 
                                    scale: 1.05, 
                                    rotate: 1,
                                    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                                }}
                                className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 block relative overflow-hidden group"
                            >
                                {/* Glowing border effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                                
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/30 to-purple-400/30 flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-8 h-8 text-cyan-300" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2 relative z-10">{title}</h3>
                                <p className="text-slate-300 relative z-10">{desc}</p>
                                
                                {/* Hover arrow */}
                                <motion.div
                                    initial={{ x: -10, opacity: 0 }}
                                    whileHover={{ x: 0, opacity: 1 }}
                                    className="absolute bottom-4 right-4 text-cyan-400"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.div>
                            </motion.a>
                        ))}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowResources(false)}
                        className="mt-16 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-400 px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-cyan-400/50 transition-all"
                    >
                        ⬅ Back to Home
                    </motion.button>
                </section>
                <QuoteSection />
                <Footer onShowResources={() => setShowResources(true)} onShowSchedule={() => setShowSchedule(true)} />
                <FloatingAIChat />
            </div>
        );
    }
    
    // Schedule Session Page (Enhanced)
    // -----------------------------
    if (showSchedule) {
        return (
            <div className="relative min-h-screen bg-slate-900 text-white overflow-hidden">
                <Toaster position="top-right" />
                {/* global Navbar from App handles the header */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-slate-900 opacity-70"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-70"
                        initial={{
                            top: Math.random() * window.innerHeight,
                            left: Math.random() * window.innerWidth,
                        }}
                        animate={{ y: [0, -40, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{
                            duration: 6 + Math.random() * 6,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
                <section className="relative z-10 flex flex-col items-center justify-center py-24 px-8 pt-20">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold mb-8 text-center"
                    >
                        📅 Schedule a Session
                    </motion.h1>
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="w-full max-w-md bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl space-y-4 border border-slate-700/50 shadow-2xl"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            required
                        />
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            required
                        />
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Message (Optional)"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg"
                        >
                            Send Request
                        </motion.button>

                        {formData.date && formData.time && (
                            <motion.a
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                href={generateGoogleCalendarLink(
                                    "Mentorship Session",
                                    formData.message || "Mentorship session booked",
                                    formData.date,
                                    formData.time
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full mt-2 inline-block text-center bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-xl font-bold hover:bg-green-500/30 transition-all"
                            >
                                Add to Google Calendar
                            </motion.a>
                        )}
                    </motion.form>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSchedule(false)}
                        className="mt-6 bg-slate-700/50 backdrop-blur-lg border border-slate-600 px-6 py-2 rounded-full hover:bg-slate-600/50 transition-all"
                    >
                        ⬅ Back
                    </motion.button>
                </section>
                <QuoteSection />
                <Footer onShowResources={() => setShowResources(true)} onShowSchedule={() => setShowSchedule(true)} />
                <FloatingAIChat />
            </div>
        );
    }

    // -----------------------------
    // Main Home Page (Enhanced)
    // -----------------------------
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-900 text-white">
            <Toaster position="top-right" />
            <SearchModal />
            <OnboardingWalkthrough />
            
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-slate-900 opacity-70"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-70"
                    initial={{
                        top: Math.random() * window.innerHeight,
                        left: Math.random() * window.innerWidth,
                    }}
                    animate={{ y: [0, -40, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{
                        duration: 6 + Math.random() * 6,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Hero Section */}
            <section className="relative z-10 overflow-hidden py-32 px-8 pt-20 min-h-screen flex items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col md:flex-row items-center justify-between w-full"
                >
                    <div className="text-center md:text-left max-w-2xl">
                        <motion.h1
                            className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 drop-shadow-lg"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            Learn from Top Mentors
                        </motion.h1>
                        <p className="text-xl md:text-2xl mb-10 text-cyan-200/80 leading-relaxed">
                            Supercharge your career with 1-on-1 mentorship, curated resources, 
                            AI-powered guidance, and comprehensive progress tracking 🚀
                        </p>
                        <motion.button
                            onClick={authUser ? handleMentor : () => navigate("/login")}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-600 text-white font-bold px-10 py-4 text-xl rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all mb-4"
                        >
                            {authUser
                                ? authUser.role === "mentor"
                                    ? "Check Requests"
                                    : "Find Mentors"
                                : "Get Started"}
                        </motion.button>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                            <motion.button
                                onClick={() => navigate('/ai-learn')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-slate-800/60 border border-slate-700 text-slate-200 px-6 py-3 rounded-full font-medium"
                            >
                                Try the AI Playground
                            </motion.button>
                            {/* Favorites bar small preview */}
                            <div className="hidden sm:flex items-center gap-2 ml-4">
                                <div className="text-sm text-slate-400 mr-2">Favorites:</div>
                                <div className="flex gap-2">
                                    {(() => {
                                        try {
                                            const favs = JSON.parse(localStorage.getItem('student:favorites') || '[]');
                                            const flat = toolsData.flatMap(c => c.items);
                                            return favs.slice(0,5).map(name => {
                                                const t = flat.find(x => x.name === name);
                                                if (!t) return null;
                                                return (
                                                    <a key={t.name} href={t.link} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center text-xs text-white border border-slate-700 hover:scale-110 transition-transform">{t.name.charAt(0)}</a>
                                                )
                                            })
                                        } catch (e) { return null }
                                    })()}
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Join 10,000+ learners accelerating their careers
                        </p>
                    </div>

                    <motion.div
                        className="mt-12 md:mt-0"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* You can add an illustration here */}
                    </motion.div>
                </motion.div>
            </section>

            {/* AI Discover News Card placed inside How It Works as a full-width card */}
            <section className="relative z-10 py-12 px-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                        <AIDiscoverNews />
                    </div>
                </div>
            </section>

            {/* Mentor panel removed per request */}

            {/* Stats Section */}
            <StatsSection />

            {/* How It Works Section */}
            <section className="relative z-10 py-24 px-6 bg-slate-900/50">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">
                            How It Works
                        </h2>
                        <div className="h-1 w-20 bg-cyan-400 mx-auto rounded-full mt-3"></div>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-5 gap-8"
                    >
                        {[
                            {
                                icon: Search,
                                title: "Find Your Mentor",
                                desc: "Browse a network of experts across domains.",
                                action: handleMentor,
                                // Show mentor-appropriate CTA text when logged in as mentor
                                buttonText: authUser?.role === "mentor" ? "View Requests" : "Find Mentors"
                            },
                            {
                                icon: Calendar,
                                title: "Schedule Sessions",
                                desc: "Book flexible mentorship or interview prep slots.",
                                action: () => setShowSchedule(true),
                                buttonText: "Schedule Now"
                            },
                            {
                                icon: TrendingUp,
                                title: "Track Progress",
                                desc: "Keep improving with personalized feedback.",
                                action: () => navigate("/progress"),
                                buttonText: "View Progress"
                            },
                            {
                                icon: BookOpen,
                                title: "Access Resources",
                                desc: "Use curated materials & templates to excel.",
                                action: () => setShowResources(true),
                                buttonText: "View Resources"
                            },
                            {
                                icon: Brain,
                                title: "Learn with AI",
                                desc: "Chat with an AI mentor powered by Google Gemini.",
                                action: () => navigate("/ai-learn"),
                                buttonText: "Chat Now",
                                gradient: "from-purple-500 to-cyan-500",
                            },
                            // {
                            //     icon: BookOpen,
                            //     title: "🎓 Student Helper",
                            //     desc: "Discover AI tools for learning, interviews & productivity.",
                            //     action: () => navigate("/student-helper"),
                            //     buttonText: "Explore Tools",
                            //     gradient: "from-indigo-500 to-cyan-500"
                            // }
                        ].map((card, index) => (
                            <motion.div
                                key={card.title}
                                variants={item}
                                whileHover={{ 
                                    scale: 1.05, 
                                    rotate: 1,
                                    boxShadow: "0 20px 40px rgba(34, 211, 238, 0.3)"
                                }}
                                className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 group relative overflow-hidden"
                            >
                                {/* Glowing background effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                                
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/30 to-purple-400/30 flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <card.icon className="w-8 h-8 text-cyan-300" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2 relative z-10">{card.title}</h3>
                                <p className="text-slate-300 mb-4 relative z-10">{card.desc}</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={card.action}
                                    className={`mt-2 bg-gradient-to-r ${card.gradient || 'from-cyan-500 to-purple-500'} px-6 py-2 rounded-full hover:opacity-90 font-bold relative z-10 shadow-lg`}
                                >
                                    {card.buttonText}
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Footer */}
            <QuoteSection />
            <Footer onShowResources={() => setShowResources(true)} onShowSchedule={() => setShowSchedule(true)} />
            
            <FloatingAIChat />
        </div>
    );
};

export default HomePage;