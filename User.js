import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    demoProfile: { type: String, enum: ["student", "gig_worker"], default: "student" },
    persona: { type: String, default: "Balanced" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
