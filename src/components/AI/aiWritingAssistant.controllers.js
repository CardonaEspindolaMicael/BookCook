
import { parse } from "dotenv";
import { cleanJsonString, parseToJson } from "../../helpers/BookIndexHelper.js";
import { crearLibro } from "../book/book.models.js";
import { generateBookChapters, sendToAIService } from "./aiServiceIntegration.js";
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
    let bookContext = null;
    let chapterContext = null;

    if (bookId) {
      bookContext = await getBookIndex(bookId);
    }

    if (chapterId) {
      chapterContext = await getChapterIndex(chapterId);
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
  
    if (!aiResponse.success) {
      console.log(aiResponse)
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
    console.log(aiResponse)
   

    // Create successful interaction record
    const interaction = await createAIInteraction({
      userId,
      bookId,
      chapterId,
     // aiAssistantId: interactionType.aiAssistantId,
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
// Step 1: Create a new book with the provided metadata
export const createFullBook = async (req,res) => {
    const { 
      interactionTypeId, 
      userQuery,
      isComplete = false,
      totalChapters = 0
    } = req.body;
    const {userId} = req.params;

const prompt = `
You are an expert book creator AI.

Your task is to create a **comprehensive book outline** based strictly on the metadata below and return it in **valid JSON only** — no explanations, no extra commentary.

---

## Book Metadata:
- User Request: "${userQuery}"
- Total Chapters Required: ${totalChapters}

---

## Output Requirements:
Return ONLY a JSON object with the exact structure below:

{
  "title": "string - a compelling book title matching the request",
  "description": "string - 1 paragraph (50–80 words) describing the overall book concept",
  "summary": [
    {
      "chapter_number": number,
      "chapter_title": "string",
      "main_characters": ["list of character names introduced or featured"],
      "key_events": ["list of main plot points and events"],
      "important_dialogue": ["list of important dialogue lines or concepts"],
      "objectives_and_outcomes": "string - what this chapter achieves in the story arc",
      "transition_to_next": "string - how this chapter connects to the next one"
      "mood_and_tone": "string - the emotional tone and atmosphere of the chapter",
    }
  ]
}

---

## Rules for the "summary" array:
- Must contain exactly ${totalChapters} objects, one per chapter in sequential order.
- Each chapter’s "objectives_and_outcomes" and "transition_to_next" must be 50–100 words.
- Maintain consistent tone and style according to the user’s request.
- Ensure logical narrative flow between chapters.
- Include enough detail that a writer could create a full chapter from each summary.

---

## Example format:
{
  "title": "The Dragon's Apprentice",
  "description": "In a realm torn between magic and steel, a young mage must...",
  "summary": [
    {
      "chapter_number": 1,
      "chapter_title": "Shadows Over Eldoria",
      "main_characters": ["Kaelen", "Eldric the Dragon"],
      "key_events": ["Kaelen meets Eldric", "Ancient prophecy revealed"],
      "important_dialogue": ["'You are the last hope of Eldoria.'"],
      "objectives_and_outcomes": "Kaelen, a young mage, discovers his destiny...",
      "transition_to_next": "Kaelen sets out to the Northern Peaks..."
      "mood_and_tone": "Mysterious and adventurous"
    }
  ]
}

---

### IMPORTANT:
- Follow the JSON schema exactly.
- Do not include any text outside of the JSON object.
- Ensure the JSON is valid and parsable.
`;

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
   
const aiRequest = {
      interactionType,
      userQuery: prompt
    };
    const aiResponse = await sendToAIService(aiRequest);

    console.log(aiResponse)
    if (!aiResponse.success) {
      console.error('AI Service Error:', aiResponse.error);
      return res.status(500).json({ error: aiResponse.error });
    }

    const parsedContent =aiResponse.response;
    const bookJson={
        title: parsedContent.title || "Untitled Book",
        description: parsedContent.description || "A generated book",
        cover: null,
        authorId: userId,
        isFree: false,
        isComplete: isComplete,
        totalChapters: totalChapters,
        isNFT: false,
        nftPrice: null,
        maxSupply: null,
        status: 'draft'
    }
    const createdBook = await crearLibro(bookJson);



    return res.status(200).json({
      message: "Book generated successfully",
      bookId: createdBook.id,
      summary: parsedContent.summary,
      totalChapters: totalChapters,
      tokenUsed: aiResponse.tokenUsed*totalChapters,
      processingTime: aiResponse.processingTime
    });
  };

  

// Step 2: Generate chapters based on the book outline in base of the response
export const generateBookChaptersController = async (req,res) => {
  const { 
      summary,
      bookId,
      totalChapters 
    } = req.body;
    

   const responseChapter= await generateBookChapters(summary,bookId,totalChapters)
   
   return res.status(200).json(responseChapter);

}

//Step 3: Create cover image for the book  call RequestAIHelp with the bookId and chapterId as null 
//Step 4: Update the cover image

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