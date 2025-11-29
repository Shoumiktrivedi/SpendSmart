import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Goal from "../models/Goal.js";

export const startDemo = async (req, res) => {
  console.log("👉 /api/demo/start hit, body:", req.body);

  try {
    const { profile = "student", name = "Alex" } = req.body;

    const user = await User.create({
      name,
      demoProfile: profile,
    });

    const userId = user._id;

    const today = new Date();
    const txns = [];

    const pushTxn = (amount, type, category, merchant, daysAgo) => {
      const d = new Date(today);
      d.setDate(d.getDate() - daysAgo);
      txns.push({
        userId,
        date: d,
        amount,
        type,
        category,
        merchant,
        meta: { source: "sample" },
      });
    };

    pushTxn(25000, "income", "other", "Upwork", 25);
    pushTxn(500, "expense", "food", "Swiggy", 2);
    pushTxn(400, "expense", "food", "Zomato", 5);
    pushTxn(1500, "expense", "rent", "PG Rent", 20);
    pushTxn(600, "expense", "transport", "Uber", 3);
    pushTxn(300, "expense", "entertainment", "Netflix", 10);

    await Transaction.insertMany(txns);

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);

    const goal = await Goal.create({
      userId,
      name: "New Laptop",
      targetAmount: 50000,
      currentSaved: 12000,
      deadline,
    });

    res.json({
      userId,
      demoProfile: profile,
      goalId: goal._id,
    });
  } catch (err) {
    console.error("❌ startDemo error:", err);
    res.status(500).json({ error: "Failed to start demo" });
  }
};
