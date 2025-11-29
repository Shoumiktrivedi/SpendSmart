import { Router } from "express";
import {
  getSummary,
  getCategories,
  getCurrentGoal
} from "../controllers/summary.controller.js";

const router = Router();

router.get("/summary", getSummary);
router.get("/categories", getCategories);
router.get("/goals/current", getCurrentGoal);

export default router;

