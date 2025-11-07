import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Crown, Sparkles, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { getConnectedMentees, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getConnectedMentees();
  }, []);

  const filteredUsers = (showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users
  ).filter(user => 
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="h-full w-20 lg:w-80 border-r border-white/10 bg-gradient-to-b from-slate-900 to-purple-900/30 backdrop-blur-xl flex flex-col transition-all duration-300 shadow-2xl"
    >
      {/* Header */}
      <div className="border-b border-white/10 w-full p-6 bg-slate-900/50">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="relative">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <Users className="size-5 text-white" />
            </div>
          </div>
          <div className="hidden lg:block">
            <h2 className="font-bold text-white text-lg">Connected Mentees</h2>
            <p className="text-sm text-cyan-300 font-medium">{users.length} connections</p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="hidden lg:block relative mb-4"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search mentees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl 
                       text-white placeholder-slate-400 text-sm font-medium
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30
                       transition-all duration-300 backdrop-blur-sm"
          />
        </motion.div>

        {/* Online Filter */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex items-center justify-between"
        >
          <label className="cursor-pointer flex items-center gap-3 group">
            <div className="relative">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-all duration-300 ${
                showOnlineOnly 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                  : 'bg-white/10'
              }`}>
                <motion.div 
                  className={`w-4 h-4 rounded-full bg-white shadow-lg mt-1 ${
                    showOnlineOnly ? 'ml-5' : 'ml-1'
                  }`}
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-slate-400 group-hover:text-cyan-300 transition-colors" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                Online only
              </span>
            </div>
          </label>
          
          <motion.div 
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-300">
              {onlineUsers.length - 1} online
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 lg:px-4">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user, index) => (
            <motion.button
              key={user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 lg:p-4 rounded-2xl flex items-center gap-3 transition-all duration-300 mb-2 group
                ${selectedUser?._id === user._id 
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/20" 
                  : "bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20"
                }`}
            >
              {/* Avatar with Enhanced Online Indicator */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  {/* Online Status Glow */}
                  {onlineUsers.includes(user._id) && (
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-emerald-400 rounded-full blur-sm"
                    />
                  )}
                  
                  {/* Avatar Image */}
                  <div className="relative size-12 lg:size-14 rounded-2xl border-2 border-white/20 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden shadow-lg">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Premium Badge */}
                    {user.isPremium && (
                      <div className="absolute -top-1 -right-1 p-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg">
                        <Crown className="size-3 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Online Status Dot */}
                <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-slate-900 ${
                  onlineUsers.includes(user._id) 
                    ? "bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/50" 
                    : "bg-slate-600"
                }`}>
                  {onlineUsers.includes(user._id) && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-emerald-400"
                    />
                  )}
                </div>
              </div>

              {/* User Info - Hidden on mobile */}
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white truncate text-sm">
                    {user.fullName}
                  </h3>
                  {user.isExpert && (
                    <Sparkles className="size-3 text-cyan-400" />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`size-2 rounded-full ${
                    onlineUsers.includes(user._id) 
                      ? "bg-emerald-400 animate-pulse" 
                      : "bg-slate-500"
                  }`} />
                  <p className={`text-xs font-medium ${
                    onlineUsers.includes(user._id) 
                      ? "text-emerald-300" 
                      : "text-slate-400"
                  }`}>
                    {onlineUsers.includes(user._id) ? "Active now" : "Offline"}
                  </p>
                </div>
                
                {/* Last Message Preview */}
                {user.lastMessage && (
                  <p className="text-xs text-slate-400 truncate mt-1">
                    {user.lastMessage}
                  </p>
                )}
              </div>

              {/* Mobile Badge */}
              <div className="lg:hidden">
                {onlineUsers.includes(user._id) && (
                  <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {filteredUsers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-12 px-4"
            >
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 inline-block mb-4">
                <Users className="size-8 text-slate-400 mx-auto" />
              </div>
              <h3 className="text-white font-semibold mb-2">No mentees found</h3>
              <p className="text-slate-400 text-sm">
                {showOnlineOnly || searchQuery 
                  ? "Try adjusting your filters or search" 
                  : "Your connected mentees will appear here"
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 border-t border-white/10 bg-slate-900/50 hidden lg:block"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Total connections</span>
          <span className="text-cyan-300 font-bold">{users.length}</span>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;