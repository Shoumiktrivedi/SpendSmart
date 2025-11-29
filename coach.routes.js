import { Router } from "express";
import { coachMessage } from "../controllers/coach.controller.js";
import { getCoachDemo } from "../controllers/coachDemo.controller.js";

const router = Router();

router.post("/message", coachMessage);
router.get("/demo", getCoachDemo); // GET /api/coach/demo

export default router;

