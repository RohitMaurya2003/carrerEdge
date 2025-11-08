import { X, MoreVertical, Phone, Video, Info } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { motion, AnimatePresence } from "framer-motion";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="px-6 py-4 bg-gradient-to-r from-slate-900/90 via-purple-900/80 to-slate-900/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
    >
      <div className="flex items-center justify-between">
        {/* User Info Section */}
        <div className="flex items-center gap-4">
          {/* Animated Avatar with Glow */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {/* Outer Glow */}
            <motion.div 
              className={`absolute inset-0 rounded-3xl blur-md ${
                isOnline 
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 animate-pulse" 
                  : "bg-slate-600"
              }`}
              animate={{ 
                opacity: isOnline ? [0.5, 0.8, 0.5] : 0.3 
              }}
              transition={{ 
                duration: 2, 
                repeat: isOnline ? Infinity : 0 
              }}
            />
            
            {/* Avatar Container */}
            <div className="relative size-14 rounded-2xl overflow-hidden border-2 border-white/20 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName}
                className="w-full h-full object-cover"
              />
              
              {/* Online Status Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-slate-900 ${
                  isOnline 
                    ? "bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/50" 
                    : "bg-slate-500"
                }`}
              >
                {isOnline && (
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>
          
          {/* User Details */}
          <motion.div 
            className="space-y-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-white text-lg tracking-tight">
              {selectedUser.fullName}
            </h3>
            
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Animated Status Dot */}
              <motion.div
                animate={isOnline ? {
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0.7)",
                    "0 0 0 10px rgba(34, 197, 94, 0)",
                    "0 0 0 0 rgba(34, 197, 94, 0)"
                  ]
                } : {}}
                transition={isOnline ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
                className={`size-3 rounded-full ${
                  isOnline 
                    ? "bg-emerald-400" 
                    : "bg-slate-500"
                }`}
              />
              
              <div className="flex items-center gap-3">
                <p className={`text-sm font-semibold ${
                  isOnline 
                    ? "text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-full" 
                    : "text-slate-400"
                }`}>
                  {isOnline ? "🟢 Online" : "⚫ Offline"}
                </p>
                
                {/* Last Seen - You can add this data if available */}
                {!isOnline && (
                  <span className="text-xs text-slate-500">
                    Last seen recently
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="flex items-center gap-1"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
         
          
          
          
          {/* More Options */}
          

          {/* Close Button */}
          <motion.button 
            onClick={() => setSelectedUser(null)}
            whileHover={{ 
              scale: 1.1, 
              rotate: 90,
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              borderColor: "rgba(239, 68, 68, 0.3)"
            }}
            whileTap={{ scale: 0.9 }}
            className="group p-3 rounded-2xl transition-all duration-200 bg-white/5 border border-white/10 ml-2"
          >
            <X className="size-5 text-slate-300 group-hover:text-red-400 transition-colors" />
          </motion.button>
        </motion.div>
      </div>

      {/* Progress Bar for Typing Indicator - You can integrate this later */}
      <AnimatePresence>
        {isOnline && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatHeader;