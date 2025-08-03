import express from "express";
import {
  getAIWritingOptions,
  requestAIHelp,
  rateAIResponse,
  applyAISuggestion,
  getAIUsage,
  createInteractionTypeController,
  getInteractionTypeController,
  createAIUsageController
} from "./aiWritingAssistant.controllers.js";
import { getAllInteractionType } from "./aiWritingAssistant.models.js";

const router = express.Router();

// Get AI writing options and check credits 
router.get("/options/:userId", getAIWritingOptions);

// Request AI help
router.post("/help", requestAIHelp);

// Rate AI response
router.post("/rate", rateAIResponse);

// Apply AI suggestion to content
router.post("/apply", applyAISuggestion);

// Get AI usage statistics
router.get("/usage", getAIUsage);
router.post("/usage/:userId", createAIUsageController);

router.post("/customInteraction", createInteractionTypeController);
router.get("/customInteraction",getInteractionTypeController);
export default router; 