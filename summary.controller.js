import Transaction from "../models/Transaction.js";
import Goal from "../models/Goal.js";

export const getSummary = async (req, res) => {
  try {
    const { userId, period = "month" } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const fromDate = getFromDate(period);

    const txns = await Transaction.find({
      userId,
      date: { $gte: fromDate }
    });

    let income = 0;
    let expenses = 0;

    txns.forEach((t) => {
      if (t.type === "income") income += t.amount;
      if (t.type === "expense") expenses += t.amount;
    });

    const savings = income - expenses;
    const budgetLimit = 20000; // you can make this dynamic later
    const budgetUsed = expenses;
    const budgetPercent = Math.round((budgetUsed / budgetLimit) * 100);

    res.json({
      income,
      expenses,
      savings,
      budget: {
        limit: budgetLimit,
        used: budgetUsed,
        percent: Math.min(budgetPercent, 999)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get summary" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { userId, period = "month" } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const fromDate = getFromDate(period);

    const txns = await Transaction.find({
      userId,
      type: "expense",
      date: { $gte: fromDate }
    });

    const map = {};
    let total = 0;

    txns.forEach((t) => {
      const key = t.category || "other";
      map[key] = (map[key] || 0) + t.amount;
      total += t.amount;
    });

    const categories = Object.keys(map).map((key) => ({
      name: mapCategoryName(key),
      key,
      amount: map[key],
      percent: total ? Math.round((map[key] / total) * 100) : 0
    }));

    res.json({ total, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get categories" });
  }
};

export const getCurrentGoal = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const goal = await Goal.findOne({ userId }).sort({ createdAt: -1 });
    if (!goal) return res.json(null);

    const percent = Math.round(
      (goal.currentSaved / goal.targetAmount) * 100
    );

    res.json({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentSaved: goal.currentSaved,
      deadline: goal.deadline,
      percent: Math.min(percent, 999)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get goal" });
  }
};

// helpers
const getFromDate = (period) => {
  const now = new Date();
  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  return new Date(2000, 0, 1); // "all time" fallback
};

const mapCategoryName = (key) => {
  const names = {
    food: "Groceries & Food",
    rent: "Rent & Utilities",
    transport: "Transport",
    entertainment: "Entertainment",
    bills: "Bills & Subscriptions",
    other: "Other"
  };
  return names[key] || key;
};
