import express from "express";
import {
  getAIWritingOptions,
  requestAIHelp,
  rateAIResponse,
  applyAISuggestion,
  getAIUsage,
  createInteractionTypeController,
  getInteractionTypeController,
  createAIUsageController,
  checkAIServiceConfiguration,
  createFullBook,
  generateBookChaptersController
} from "./aiWritingAssistant.controllers.js";
import { generateBookChapters } from "./aiServiceIntegration.js";

const router = express.Router();

// Get AI writing options and check credits 
router.get("/options/:userId", getAIWritingOptions);

// Request AI help
router.post("/help/:userId", requestAIHelp);

// Rate AI response
router.post("/rate", rateAIResponse);
 
// Apply AI suggestion to content
router.post("/apply", applyAISuggestion);

router.post("/fullBook/:userId", createFullBook); 
router.post("/generateChapters", generateBookChaptersController);
// Get AI usage statistics
router.get("/usage/:userId", getAIUsage);
router.post("/usage/:userId", createAIUsageController);

router.post("/customInteraction", createInteractionTypeController);
router.get("/customInteraction",getInteractionTypeController);

// Check AI service configuration
router.get("/config", checkAIServiceConfiguration);


export default router; 