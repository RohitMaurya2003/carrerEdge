import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection", // Ensures message belongs to a valid mentor-mentee relationship
      required: true,
    },
  },
  { timestamps: true }
);

// Index for efficient message retrieval
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;