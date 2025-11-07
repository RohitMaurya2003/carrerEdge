import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }, // e.g., 'chat', 'resume_review', 'session'
    meta: { type: Object },
  },
  { timestamps: true }
);

const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
export default Activity;
