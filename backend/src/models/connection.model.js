import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    }
  },
  { timestamps: true }
);

// Create compound unique index to prevent duplicate connections
connectionSchema.index({ mentor: 1, mentee: 1 }, { unique: true });

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;