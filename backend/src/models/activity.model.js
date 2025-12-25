import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }, // e.g., 'chat', 'resume_review', 'session'
    meta: { type: Object },
  },
  { timestamps: true }
);

// Index for efficient activity queries by user
ActivitySchema.index({ userId: 1, createdAt: -1 });

const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
export default Activity;
