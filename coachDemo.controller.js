import { demoQuestions, behaviorRules, examples, coachTone } from "../prompts/coachPrompts.js";

export const getCoachDemo = (req, res) => {
  res.json({
    demoQuestions,
    behaviorRules,
    examples,
    coachTone
  });
};
