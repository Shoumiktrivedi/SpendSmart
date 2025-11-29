import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { connectDB } from "./config/db.js";

import demoRoutes from "./routes/demo.routes.js"; 
import summaryRoutes from "./routes/summary.routes.js";
import coachRoutes from "./routes/coach.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/demo", demoRoutes);   // 👈 IMPORTANT
app.use("/api", summaryRoutes);
app.use("/api/coach", coachRoutes);

// put this AFTER import "dotenv/config" and BEFORE app.use("/api", ...)
app.get("/_health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/test", (req, res) => {
  console.log("👉 /api/test hit with body:", req.body);
  res.json({ ok: true });
});

// fallback (for debugging)
app.use((req, res) => {
  console.log("❓ Unknown route:", req.method, req.url);
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
