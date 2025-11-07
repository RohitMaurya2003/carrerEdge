import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [imageLoading, setImageLoading] = useState({});
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0 && !isScrolling) {
      messageEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages, isScrolling]);

  const handleImageLoad = (messageId) => {
    setImageLoading(prev => ({ ...prev, [messageId]: false }));
  };

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 0.8
      }
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

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 animate-pulse"></div>
        
        <ChatHeader />
        <div className="flex-1 overflow-y-auto relative z-10">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        {/* Simplified background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[length:50px_50px] bg-[linear-gradient(to_right,#9C92AC_1px,transparent_1px),linear-gradient(to_bottom,#9C92AC_1px,transparent_1px)]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            animate={{
              y: [0, -100, 0],
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
              top: `${20 + (i * 8) % 70}%`,
            }}
          />
        ))}
      </div>

      <ChatHeader />

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 relative z-10"
        onScroll={() => {
          setIsScrolling(true);
          clearTimeout(window.scrollTimeout);
          window.scrollTimeout = setTimeout(() => setIsScrolling(false), 1000);
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === authUser._id;
              const isConsecutive = index > 0 && messages[index - 1].senderId === message.senderId;
              const showAvatar = !isConsecutive;

              return (
                <motion.div
                  key={message._id}
                  layout
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ scale: 1.01 }}
                  className={`flex items-end gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar with Glow Effect */}
                  {showAvatar && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className={`relative ${isOwnMessage ? "ml-3" : "mr-3"}`}
                    >
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-md opacity-50`}></div>
                        <div className="relative size-10 rounded-2xl border-2 border-white/20 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden shadow-xl">
                          <img
                            src={
                              isOwnMessage
                                ? authUser.profilePic || "/avatar.png"
                                : selectedUser.profilePic || "/avatar.png"
                            }
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Message Content */}
                  <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-[75%] ${!showAvatar ? (isOwnMessage ? "mr-16" : "ml-16") : ""}`}>
                    
                    {/* Sender Name */}
                    {!isConsecutive && (
                      <motion.div 
                        initial={{ opacity: 0, x: isOwnMessage ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center gap-2 mb-1 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <span className="text-sm font-semibold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                          {isOwnMessage ? "You" : selectedUser.fullName}
                        </span>
                        <motion.time 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-xs text-white/40"
                        >
                          {formatMessageTime(message.createdAt)}
                        </motion.time>
                      </motion.div>
                    )}

                    {/* Message Bubble */}
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`relative group ${isOwnMessage ? "text-right" : "text-left"}`}
                    >
                      {/* Main Bubble */}
                      <div className={`relative px-4 py-3 rounded-2xl backdrop-blur-xl border ${
                        isOwnMessage
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                          : "bg-white/10 text-white border-white/20 shadow-lg shadow-purple-500/10"
                      } transition-all duration-300 group-hover:shadow-xl`}>
                        
                        {/* Image Attachment */}
                        {message.image && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-3 last:mb-0 rounded-xl overflow-hidden border border-white/10"
                          >
                            <img
                              src={message.image}
                              alt="Attachment"
                              className="w-full max-w-xs rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                              onLoad={() => handleImageLoad(message._id)}
                            />
                          </motion.div>
                        )}

                        {/* Text Content */}
                        {message.text && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="leading-relaxed whitespace-pre-wrap break-words text-white/90"
                          >
                            {message.text}
                          </motion.p>
                        )}

                        {/* Timestamp for consecutive messages */}
                        {isConsecutive && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className={`text-xs opacity-60 mt-1 ${isOwnMessage ? 'text-cyan-100/80' : 'text-white/60'}`}
                          >
                            {formatMessageTime(message.createdAt)}
                          </motion.div>
                        )}
                      </div>

                      {/* Reaction/Status Indicator */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`absolute -bottom-1 ${isOwnMessage ? 'right-2' : 'left-2'} flex items-center gap-1`}
                      >
                        {isOwnMessage && (
                          <div className="text-xs text-cyan-300/80">✓✓</div>
                        )}
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Scroll anchor */}
        <div ref={messageEndRef} className="h-4" />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;