import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: {
      type: String,
      enum: ["food", "rent", "transport", "entertainment", "bills", "other"],
      default: "other"
    },
    merchant: { type: String },
    meta: {
      source: { type: String, default: "sample" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
