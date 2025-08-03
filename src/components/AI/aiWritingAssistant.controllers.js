import {
  checkAIUsage,
  createAIInteraction,
  updateAIUsage,
  updateAIInteraction,
  getBookIndex,
  getChapterIndex,
  updateBookIndex,
  updateChapterIndex,
  createNotification,
  createInteractionType,
  getAllInteractionType,
  getInteractionTypes,
  createAIUsage
} from "./aiWritingAssistant.models.js";
import { aiInteractionSchema } from "./dto/aiInteraction.dto.js";
import { createAIUsageSchema } from "./dto/aiUsage.dto.js";
import { interactionTypeCreateSchema } from "./dto/interactionType.dto.js";
import { sendToAIService, checkAIServiceConfig } from "./aiServiceIntegration.js";

export const getAIWritingOptions = async (req, res) => {
  try {
    const { bookId, chapterId } = req.query;
    const {userId} = req.params // From JWT token 
 
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Check AI usage limits
    const aiUsage = await checkAIUsage(userId); 
    
    if (!aiUsage.hasCredits) {
      return res.status(402).json({
        message: "Límite mensual de AI alcanzado",
        upgradeRequired: true,
        currentUsage: aiUsage.currentUsage,
        monthlyLimit: aiUsage.monthlyLimit
      });
    }

    // Get available interaction types
    const interactionTypes = await getInteractionTypes();
    
    res.status(200).json({
      hasCredits: true,
      remainingCredits: aiUsage.remainingCredits,
      interactionTypes,
      bookId,
      chapterId
    });
  } catch (error) {
    console.error('Error getting AI writing options:', error);
    res.status(500).json({ error: error.message });
  }
};

export const requestAIHelp = async (req, res) => {
  try {
    const { 
      interactionTypeId, 
      bookId, 
      chapterId, 
      userQuery,
      contextData 
    } = req.body;
    
    const {userId} = req.params;

    // Validate request
    const validation = aiInteractionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Datos inválidos",
        errors: validation.error.errors 
      });
    }

    // Check AI usage and interaction cost
    const aiUsage = await checkAIUsage(userId);
    const interactionType = await getAllInteractionType(interactionTypeId); 
    if (!interactionType) {
      return res.status(404).json({ message: "Tipo de interacción no encontrado" });
    }

    if (aiUsage.remainingCredits < interactionType.costPerUse) {
      return res.status(402).json({
        message: "Créditos insuficientes para esta interacción",
        requiredCredits: interactionType.costPerUse,
        availableCredits: aiUsage.remainingCredits
      });
    }

    // Get context data
    let bookContext = "How to write a book without sight";
    let chapterContext = "Chapter 1 The man who dreams of a world without sight";

    if (bookId) {
      bookContext = await getBookIndex(bookId);
      console.log('bookContext', bookContext);
    }

    if (chapterId) {
      chapterContext = await getChapterIndex(chapterId);
      console.log('chapterContext', chapterContext);
    }

    // Prepare AI request
    const aiRequest = {
      interactionType,
      userQuery,
      contextData,
      bookContext,
      chapterContext
    };

    // Send to AI service
    const aiResponse = await sendToAIService(aiRequest);
    console.log('aiResponse', aiResponse);
    if (!aiResponse.success) {
      // Create failed interaction record
      await createAIInteraction({
        userId,
        bookId,
        chapterId,
       // aiAssistantId: interactionType.aiAssistantId,
        interactionTypeId,
        userQuery,
        contextData,
        aiResponse: aiResponse.error,
        tokenUsed: 0,
        processingTime: aiResponse.processingTime,

        status: 'failed'
      });

      return res.status(500).json({
        message: "Error en el servicio de AI",
        error: aiResponse.error
      });
    }

    // Create successful interaction record
    const interaction = await createAIInteraction({
      userId,
      bookId,
      chapterId,
      aiAssistantId: interactionType.aiAssistantId,
      interactionTypeId,
      userQuery,
      contextData,
      aiResponse: aiResponse.response,
      tokenUsed: aiResponse.tokenUsed,
      processingTime: aiResponse.processingTime,
      status: 'completed'
    });

    // Update AI usage
    await updateAIUsage(userId, aiResponse.tokenUsed, interactionType.costPerUse);

    res.status(200).json({
      message: "Respuesta de AI generada exitosamente",
      interaction: {
        id: interaction.id,
        aiResponse: aiResponse.response,
        tokenUsed: aiResponse.tokenUsed,
        remainingCredits: aiUsage.remainingCredits - interactionType.costPerUse
      }
    });

  } catch (error) {
    console.error('Error requesting AI help:', error);
    res.status(500).json({ error: error.message });
  }
};
export const createInteractionTypeController = async (req, res) => {
  try {
    const validatedData = interactionTypeCreateSchema.parse(req.body);
    const interactionType = await createInteractionType(validatedData);

    res.status(201).json(interactionType);
  } catch (error) {
    console.error("Error creating InteractionType:", error);
    res.status(500).json({ error: error.message });
  }
};

export const rateAIResponse = async (req, res) => {
  try {
    const { interactionId, satisfaction, wasUseful } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Update interaction with user rating
    await updateAIInteraction(interactionId, {
      satisfaction: satisfaction, // 1-5 rating
      wasUseful: wasUseful // true/false/null
    });

    res.status(200).json({
      message: "Calificación registrada exitosamente"
    });

  } catch (error) {
    console.error('Error rating AI response:', error);
    res.status(500).json({ error: error.message });
  }
};

export const applyAISuggestion = async (req, res) => {
  try {
    const { interactionId, appliedContent, bookId, chapterId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Update interaction to mark as applied
    await updateAIInteraction(interactionId, {
      wasUseful: true,
      satisfaction: 5
    });

    // Update book index if book content changed
    if (bookId && appliedContent.bookContent) {
      await updateBookIndex(bookId, appliedContent.bookContent);
    }

    // Update chapter index if chapter content changed
    if (chapterId && appliedContent.chapterContent) {
      await updateChapterIndex(chapterId, appliedContent.chapterContent);
    }

    // Create notification
    await createNotification({
      userId,
      type: "ai_suggestion_applied",
      title: "Sugerencia de AI aplicada",
      message: "Has aplicado exitosamente una sugerencia de AI a tu contenido.",
      bookId
    });

    res.status(200).json({
      message: "Sugerencia de AI aplicada exitosamente",
      contentUpdated: true
    });

  } catch (error) {
    console.error('Error applying AI suggestion:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAIUsage = async (req, res) => {
  try {
    const {userId}=req.params;
    const aiUsage = await checkAIUsage(userId);

    res.status(200).json({
      currentUsage: aiUsage.currentUsage,
      monthlyLimit: aiUsage.monthlyLimit,
      remainingCredits: aiUsage.remainingCredits,
      hasCredits: aiUsage.hasCredits,
      resetDate: aiUsage.resetDate
    });

  } catch (error) {
    console.error('Error getting AI usage:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createAIUsageController = async (req, res) => {
  try {
    const {userId}=req.params;
    const parsedData = createAIUsageSchema.parse(req.body);

    const usage = await createAIUsage(parsedData,userId);
    res.status(201).json(usage);
  } catch (error) {
    console.error("Error creating AI usage:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getInteractionTypeController = async (req, res) => {
  try {
  
  const response = await getAllInteractionType();
  
  res.status(200).json(
    
    response
    
  )

  } catch (error) {
    console.error('Error getting AI usage:', error);
    res.status(500).json({ error: error.message });
  }
};

// Check AI service configuration
export const checkAIServiceConfiguration = async (req, res) => {
  try {
    const config = checkAIServiceConfig();
    
    res.status(200).json({
      message: "AI Service Configuration Status",
      config,
      environment: {
        geminiConfigured: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        falConfigured: !!process.env.FAL_API_KEY
      }
    });
  } catch (error) {
    console.error('Error checking AI service configuration:', error);
    res.status(500).json({ error: error.message });
  }
}; 