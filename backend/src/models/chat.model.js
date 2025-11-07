import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["user", "ai"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    model: { type: String, default: "gemini-2.5-flash" },
    messages: [chatMessageSchema],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
