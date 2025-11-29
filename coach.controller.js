// src/controllers/coach.controller.js
import Transaction from "../models/Transaction.js";
import Goal from "../models/Goal.js";
import OpenAI from "openai";

import { systemPrompt } from "../prompts/coachPrompts.js"; // <--- NEW

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const coachMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message required" });
    }

    // fetch last 1 month transactions (same as your code)
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 1);

    const txns = await Transaction.find({
      userId,
      date: { $gte: fromDate }
    });

    let income = 0;
    let expenses = 0;
    const categoryMap = {};

    txns.forEach((t) => {
      if (t.type === "income") income += t.amount;
      if (t.type === "expense") {
        expenses += t.amount;
        const key = t.category || "other";
        categoryMap[key] = (categoryMap[key] || 0) + t.amount;
      }
    });

    const goal = await Goal.findOne({ userId }).sort({ createdAt: -1 });

    const context = {
      income,
      expenses,
      savings: income - expenses,
      categories: categoryMap,
      goal: goal
        ? {
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentSaved: goal.currentSaved,
            deadline: goal.deadline
          }
        : null
    };

    // Use the imported systemPrompt here:
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            "User message: " +
            message +
            "\n\nHere is their recent financial context (JSON):\n" +
            JSON.stringify(context)
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (err) {
    console.error("COACH ERROR:", err);
    res.status(500).json({ error: "Coach failed" });
  }
};
