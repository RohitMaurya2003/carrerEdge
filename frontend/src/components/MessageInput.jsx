import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Paperclip, Mic } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="p-6 w-full bg-gradient-to-t from-slate-900/95 to-purple-900/90 backdrop-blur-2xl border-t border-white/10 shadow-2xl">
      {/* Image Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="mb-4 flex items-center gap-3"
          >
            <div className="relative group">
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-2xl border-2 border-white/20 shadow-lg"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white
                          flex items-center justify-center shadow-lg border border-white/20 hover:shadow-red-500/25 transition-all"
                type="button"
              >
                <X className="size-3" />
              </motion.button>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-cyan-300 font-medium"
            >
              Ready to send
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-end gap-3">
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-2xl transition-all duration-200 border ${
              imagePreview 
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" 
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-2xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <Paperclip size={20} />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-2xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-white-20 transition-all duration-200"
          >
            <Smile size={20} />
          </motion.button>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <motion.div
            animate={{
              boxShadow: isFocused 
                ? "0 0 0 2px rgba(34, 211, 238, 0.3), 0 10px 30px -10px rgba(0, 0, 0, 0.3)"
                : "0 0 0 1px rgba(255, 255, 255, 0.1), 0 5px 20px -5px rgba(0, 0, 0, 0.2)",
            }}
            className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300"
          >
            <input
              type="text"
              className="w-full px-5 py-4 bg-transparent border-none outline-none
                         placeholder:text-slate-400 text-white text-sm font-medium
                         focus:ring-0 focus:outline-none"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            
            {/* Character counter or typing indicator */}
            {text.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-6 left-0 text-xs text-slate-400"
              >
                {text.length}/500
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Send Button */}
        <motion.button
          type="submit"
          whileHover={{ 
            scale: text.trim() || imagePreview ? 1.05 : 1,
            y: text.trim() || imagePreview ? -2 : 0
          }}
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-2xl transition-all duration-300 border ${
            text.trim() || imagePreview
              ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400/50 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer"
              : "bg-white/5 text-slate-400 border-white/10 cursor-not-allowed"
          }`}
          disabled={!text.trim() && !imagePreview}
        >
          <motion.div
            animate={{ 
              rotate: text.trim() || imagePreview ? [0, -10, 10, 0] : 0 
            }}
            transition={{ duration: 0.5 }}
          >
            <Send size={18} />
          </motion.div>
        </motion.button>

        {/* Voice Message Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white border border-purple-400/50 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
        >
          <Mic size={18} />
        </motion.button>
      </form>

      {/* Quick Actions Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/5"
      >
        {["👍", "❤️", "😂", "🔥", "👏"].map((emoji, index) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.3, y: -5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-lg hover:text-cyan-300 transition-colors duration-200"
          >
            {emoji}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default MessageInput;