import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, LogOut, Edit3, Shield, Bell, Globe, Award, Clock, Star, Download, Sparkles, Zap, Crown, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import SpotlightCard from "../components/SpotlightCard";

const ProfilePage = () => {
  const { logout, authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    bio: "Passionate developer and lifelong learner. Building the future one line of code at a time.",
    location: "San Francisco, CA",
    website: "https://portfolio.com",
  });

  const stats = [
    { label: "Sessions", value: "24", icon: Award, color: "from-yellow-500 to-orange-500" },
    { label: "Hours", value: "48", icon: Clock, color: "from-green-500 to-emerald-500" },
    { label: "Rating", value: "4.8", icon: Star, color: "from-purple-500 to-pink-500" },
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
        toast.success("Profile picture updated successfully! ✨");
      } catch (error) {
        toast.error("Failed to update profile picture");
      }
    };
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(userData);
      setIsEditing(false);
      toast.success("Profile updated successfully! 🎉");
    } catch (error) {
      toast.error("Failed to update profile");
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
    hidden: { y: 30, opacity: 0, scale: 0.9 },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 text-white pt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
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
              left: `${(i * 5) % 100}%`,
              top: `${20 + (i * 4) % 80}%`,
            }}
          />
        ))}
      </div>

      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'bg-slate-800 text-white border border-white/10 backdrop-blur-xl',
          style: {
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: 'blur(20px)',
          },
        }}
      />
      
      <div className="max-w-7xl mx-auto p-4 py-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl"
          >
            <Sparkles className="size-6 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">AI-Powered Profile</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 mb-6">
            Your Profile
          </h1>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Manage your digital identity with style. Every detail matters in your professional journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-8"
          >
            {/* Profile Card */}
            <SpotlightCard
              spotlightColor="rgba(34, 211, 238, 0.15)"
              borderColor="rgba(255, 255, 255, 0.1)"
              glowColor="rgba(34, 211, 238, 0.3)"
              className="p-8"
            >
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    {/* Glow Effect */}
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity }
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-full blur-lg opacity-30"
                    />
                    
                    <img
                      src={selectedImg || authUser?.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="relative w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl z-10"
                    />
                    
                    <motion.label
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      htmlFor="avatar-upload"
                      className={`
                        absolute -bottom-2 -right-2 
                        bg-gradient-to-r from-cyan-500 to-purple-500 
                        p-3 rounded-xl cursor-pointer 
                        shadow-2xl border border-white/20 z-20
                        transition-all duration-200
                        ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                      `}
                    >
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUpdatingProfile}
                      />
                    </motion.label>
                  </motion.div>
                </div>

                {/* User Info */}
                <motion.div className="mb-4">
                  <motion.h2 
                    className="text-2xl font-bold text-white mb-2" 
                    whileHover={{ scale: 1.02 }}
                  >
                    {authUser?.fullName}
                  </motion.h2>
                  <p className="text-cyan-400 mb-3 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    @{authUser?.username || authUser?.fullName?.toLowerCase().replace(/\s+/g, '')}
                  </p>
                </motion.div>
                
                <motion.p 
                  className="text-slate-300 text-sm mb-8 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {userData.bio}
                </motion.p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`text-center p-4 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/20 shadow-lg backdrop-blur-sm`}
                    >
                      <stat.icon className="w-5 h-5 text-white mx-auto mb-2" />
                      <div className="text-white font-bold text-lg">{stat.value}</div>
                      <div className="text-white/80 text-xs">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 backdrop-blur-sm"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </motion.button>
                  
                  <motion.button 
                    onClick={() => {
                      const fullName = authUser?.fullName || userData.fullName || '';
                      const mail = authUser?.email || userData.email || '';
                      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${fullName}\nEMAIL;TYPE=INTERNET:${mail}\nEND:VCARD`;
                      const blob = new Blob([vcard], { type: 'text/vcard' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${(fullName || 'profile').replace(/\s+/g,'_')}.vcf`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                      toast.success("vCard downloaded! 📇");
                    }}
                    whileHover={{ scale: 1.02 }}
                    
                  >
                    
                  </motion.button>
                </div>
              </div>
            </SpotlightCard>

            {/* Quick Actions Card */}
            <SpotlightCard
              spotlightColor="rgba(168, 85, 247, 0.15)"
              glowColor="rgba(168, 85, 247, 0.3)"
              className="p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, label: "Privacy Settings", color: "text-blue-400", action: () => toast("Privacy settings opened 🔒") },
                  { icon: Globe, label: "Language & Region", color: "text-green-400", action: () => toast("Language settings opened 🌐") },
                  { icon: Bell, label: "Notifications", color: "text-yellow-400", action: () => toast("Notification settings opened 🔔") },
                  { icon: Crown, label: "Upgrade Plan", color: "text-purple-400", action: () => navigate('/premium') },
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.action}
                    className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <action.icon className={`w-4 h-4 ${action.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Right Column - Profile Details */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-8"
          >
            {/* Personal Information Card */}
            <SpotlightCard className="p-8">
              {/* Header with Edit Button */}
              <div className="flex justify-between items-center mb-8">
                <motion.h2 
                  className="text-2xl font-bold text-white flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <User className="w-6 h-6 text-cyan-400" />
                  Personal Information
                </motion.h2>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </motion.button>
              </div>

              {/* Profile Form */}
              <motion.div
                variants={containerVariants}
                className="grid md:grid-cols-2 gap-6"
              >
                {[
                  { key: 'fullName', label: 'Full Name', icon: User, type: 'text' },
                  { key: 'email', label: 'Email Address', icon: Mail, type: 'email' },
                  { key: 'location', label: 'Location', icon: Globe, type: 'text' },
                  { key: 'website', label: 'Website', icon: Globe, type: 'url' },
                ].map((field, index) => (
                  <motion.div key={field.key} variants={itemVariants} className="space-y-3">
                    <label className="text-sm text-slate-400 flex items-center gap-2">
                      <field.icon className="w-4 h-4 text-cyan-400" />
                      {field.label}
                    </label>
                    {isEditing ? (
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type={field.type}
                        value={userData[field.key]}
                        onChange={(e) => setUserData({ ...userData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all backdrop-blur-sm"
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-sm">
                        {userData[field.key]}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Bio Field */}
                <motion.div variants={itemVariants} className="md:col-span-2 space-y-3">
                  <label className="text-sm text-slate-400 flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    Bio
                  </label>
                  {isEditing ? (
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      value={userData.bio}
                      onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all resize-none backdrop-blur-sm"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white min-h-[120px] backdrop-blur-sm leading-relaxed">
                      {userData.bio}
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* Save Button */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-white/20 text-slate-300 rounded-xl font-semibold hover:bg-white/5 transition-all duration-200 backdrop-blur-sm"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                    >
                      <Sparkles className="w-4 h-4" />
                      Save Changes
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </SpotlightCard>

            {/* Account Status Card */}
            <SpotlightCard
              spotlightColor="rgba(34, 197, 94, 0.15)"
              glowColor="rgba(34, 197, 94, 0.3)"
              className="p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Account Status
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Email Verification", value: "Verified", status: "success" },
                  { label: "Account Type", value: authUser?.role || "Mentee", status: "info" },
                  { label: "Member Since", value: "Jan 2024", status: "neutral" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                  >
                    <span className="text-slate-300">{item.label}</span>
                    <span className={`text-sm font-semibold ${
                      item.status === 'success' ? 'text-green-400' :
                      item.status === 'info' ? 'text-cyan-400' : 'text-slate-400'
                    }`}>
                      {item.value}
                    </span>
                  </motion.div>
                ))}
                
                {/* Subscription Status */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="text-slate-300">Subscription Plan</div>
                        <div className="text-white font-semibold text-lg">
                          {authUser?.subscription?.active ? "Premium Member" : "Free Plan"}
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/premium')}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200"
                    >
                      {authUser?.subscription?.active ? "Manage" : "Upgrade"}
                    </motion.button>
                  </div>
                  
                  {authUser?.subscription?.active && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-slate-300 space-y-1"
                    >
                      <div>✨ Premium benefits active</div>
                      <div>⏳ Expires in {Math.ceil((new Date(authUser.subscription.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days</div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;