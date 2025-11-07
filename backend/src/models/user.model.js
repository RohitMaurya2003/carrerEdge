import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    role: { type: String, enum: ["mentor", "mentee"], required: true }, // User type
    // Subscription information for paid features
    subscription: {
      active: { type: Boolean, default: false },
      startedAt: { type: Date },
      expiresAt: { type: Date },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;