import { GoogleGenerativeAI } from "@google/generative-ai";
import { fal } from "@fal-ai/client";
import { uploadBase64Image } from "../../helpers/CloudinaryHelper.js";
import { response } from "express";
import { sendToFalImage } from "./prompts/ImagesPromtps.js";
import { createFullBook, sendToGemini } from "./prompts/GeminiPrompts.js";
import { crearCapitulo } from "../chapter/chapter.models.js";
import { parse } from "dotenv";
import { cleanJsonString, parseToJson } from "../../helpers/BookIndexHelper.js";
import { crearIndiceCapitulo } from "../chapterIndex/chapterIndex.models.js";

// Initialize Gemini API with the correct library
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyAfTaRM-E1R4XQwuLyUyXT2cENFrIsrjf0");

// Initialize Fal API
fal.config({
  credentials: process.env.FAL_API_KEY || "b0f813ae-3bc6-4c2e-880b-17ff713ea088:3664cb93a99a9cb65665f8b8a09f59f8"
});

/**
 * Send text request to Gemini AI
 * @param {Object} params - Request parameters
 * @param {string} params.prompt - The user's query
 * @param {Object} params.interactionType - The interaction type configuration
 * @param {Object} params.contextData - Additional context data
 * @param {Object} params.bookContext - Book context if available
 * @param {Object} params.chapterContext - Chapter context if available
 * @returns {Object} Response with success status, response text, and token usage
 */


/**
 * Convert old image size format to Fal AI format for Flux
 * @param {string} size - Size format
 * @returns {string} Converted format
 */
function convertToFluxImageSize(size) {
  if (!size) return "landscape_16_9";
  
  const sizeMap = {
    "512x512": "square",
    "1024x1024": "square_hd", 
    "768x1024": "portrait_4_3",
    "576x1024": "portrait_16_9",
    "1024x768": "landscape_4_3",
    "1024x576": "landscape_16_9"
  };
  
  return sizeMap[size] || size;
}

/**
 * Generate image using Fal AI - Always uses Flux Schnell model
 * @param {Object} params - Request parameters
 * @param {string} params.prompt - The image generation prompt
 * @param {Object} params.options - Additional generation options
 * @returns {Object} Response with success status, image URL, and processing time
 */
export async function generateImageWithFal(params) {
  const startTime = Date.now();
  try {
    // Always use Flux Schnell model
    const model = "fal-ai/flux-1/schnell";
    
    // Optimized options for Flux Schnell - ONLY valid parameters
    const defaultOptions = {
      prompt: params.prompt,
      image_size: params.options,
      num_imagess: 1, // Flux Schnell: 1-4 steps only
      sync_mode: true
    };

    // Process user options and filter invalid ones for Flux
    const userOptions = params.options || {};
    const processedOptions = {};
    
    // Convert image size if needed
    if (userOptions.image_size) {
      processedOptions.image_size = convertToFluxImageSize(userOptions.image_size);
    }
    
    // Only allow valid Flux Schnell parameters
    if (userOptions.num_inference_steps && userOptions.num_inference_steps <= 4) {
      processedOptions.num_inference_steps = userOptions.num_inference_steps;
    }
    
    // Flux Schnell doesn't use guidance_scale or safety checker - ignore them
    
    const options = { ...defaultOptions, ...processedOptions };


    const result = await fal.run(model, {
      input: options

    });

    const urlFinal= await uploadBase64Image(result.data.images[0].url)
    
    return {
  
        response:  urlFinal
        ,
        tokenUsed: 400,
        success:true,
        processingTime: Date.now() - startTime,
   
    };

  } catch (error) {
    console.error('Fal API Error:', error);
    return {
      error: error.message,
      aiResponse: {
        error: "Error",
        tokenUsed: 400,
        success:false
      },
      processingTime: Date.now() - startTime,
      details: error.body || error
    };
  }
}

export async function generateBookChapters(chapterSummaries, bookId, totalChapters) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 1.4,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192
    }, 
    responseMimeType: "application/json" // Force JSON output
  });

  try {
    for (let i = 1; i <= totalChapters; i++) {
      // Find the chapter object with this number
       
      const chapterInfo = chapterSummaries.find(c => c.chapter_number === i);
      if (!chapterInfo) {
        console.error(`No summary found for Chapter ${i}`);
        continue;
      }

      const chapterPrompt = `
You are an expert fantasy author. Write Chapter ${chapterInfo.chapter_number} of ${totalChapters} using ONLY the details below.

Chapter Number: ${chapterInfo.chapter_number}
Chapter Title: ${chapterInfo.chapter_title}
Main Characters: ${chapterInfo.main_characters.join(", ")}
Key Events: ${chapterInfo.key_events.join("; ")}
Important Dialogue: ${chapterInfo.important_dialogue.join(" | ")}
Objectives and Outcomes: ${chapterInfo.objectives_and_outcomes}
Transition to Next Chapter: ${chapterInfo.transition_to_next}

CRITICAL RULES:
1. Stay within the scope of this chapter only — no spoilers or events from other chapters.
2. Use the chapter title provided above exactly.
3. Include the main characters and key events naturally in the narrative.
4. Dialogue should be woven into the text.
5. Minimum length: 100 words.

Return ONLY this JSON format:
{
  "title": "Chapter ${chapterInfo.chapter_number}: ${chapterInfo.chapter_title}",
  "content": "The full chapter text here..."
}
`;

      const result = await model.generateContent(chapterPrompt);
      const response = await result.response;
      const text = response.text();

      // Parse safely
      let chapterData;
      try {
        chapterData = parseToJson(cleanJsonString(text));
      } catch (parseErr) {
        console.error(`Failed to parse Chapter ${i} response:`, parseErr);
        console.log("Raw output:", text);
        continue;
      }

      if (!chapterData.title || !chapterData.content) {
        console.error(`Chapter ${i} generation failed - missing title or content`);
        console.log("Full response:", text);
        continue;
       }
      let wordCount = chapterData.content
          ? chapterData.content.split(/\s+/).filter(word => word.length > 0).length
          : 0

      const contentChapter = {
        title: chapterData.title,
        content: chapterData.content,
        orderIndex: i,
        bookId: bookId,
        isFree: true,
        wordCount: wordCount,
      };

      console.log(`Created Chapter ${i}:`, contentChapter.title);

      const resp = await crearCapitulo(contentChapter);
      console.log(`Database response for Chapter ${i}:`, resp);

      const chapterIndexSchema={
        chapterId: resp.id,
        bookId: bookId,
        content: "",
        summary: chapterInfo.objectives_and_outcomes,
        keyEvents:  JSON.stringify(chapterInfo.key_events),
        characters: JSON.stringify(chapterInfo.main_characters),
        mood: chapterInfo.mood_and_tone || "Neutral",
        cliffhanger: false,
        wordCount:  wordCount
      }
       await crearIndiceCapitulo(chapterIndexSchema);

      // Delay to prevent rate limiting
      if (i < totalChapters) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      success: true,
      message: "All chapters generated successfully"
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}


/**
 * Main AI service function that routes requests to appropriate services
 * @param {Object} aiRequest - The complete AI request object
 * @returns {Object} Response from the appropriate AI service
 */
export async function sendToAIService(aiRequest) {

  const startTime = Date.now();
  try {
    // Check if this is an image generation request 
    if (aiRequest.interactionType.category === 'image_generation') {
      return await sendToFalImage(aiRequest);
    }

    if(aiRequest.interactionType.category === 'book_drafter') {
      return await createFullBook({
      userQuery: aiRequest.userQuery,
      interactionType: aiRequest.interactionType,
      genAI: genAI
    });
    }


    // Default to text generation with Gemini
   return await sendToGemini({
      userQuery: aiRequest.userQuery,
      interactionType: aiRequest.interactionType,
      contextData: aiRequest.contextData,
      bookContext: aiRequest.bookContext,
      chapterContext: aiRequest.chapterContext,
      genAI: genAI
    });

  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      success: false,
      error: error.message,
      processingTime: Date.now() - startTime
    };
  }
}



/**
 * Get available Fal AI models for image generation (aunque siempre usaremos Flux Schnell)
 * @returns {Array} List of available models with descriptions
 */
export function getAvailableFalModels() {
  return [
    { id: "fal-ai/flux-1/schnell", name: "Flux Schnell (Default)", description: "Fastest, optimized model - Always used" },
    { id: "fal-ai/flux-dev", name: "Flux Dev", description: "Not used - Flux Schnell preferred" },
    { id: "fal-ai/stable-diffusion-xl", name: "Stable Diffusion XL", description: "Not used - Flux Schnell preferred" }
  ];
}

/**
 * Get image size options optimized for Flux Schnell
 * @returns {Array} List of available image sizes
 */
export function getAvailableImageSizes() {
  return [
    { id: "square", name: "Square", dimensions: "512x512", fluxCompatible: true },
    { id: "square_hd", name: "Square HD", dimensions: "1024x1024", fluxCompatible: true },
    { id: "portrait_4_3", name: "Portrait 4:3", dimensions: "768x1024", fluxCompatible: true },
    { id: "portrait_16_9", name: "Portrait 16:9", dimensions: "576x1024", fluxCompatible: true },
    { id: "landscape_4_3", name: "Landscape 4:3 (Default)", dimensions: "1024x768", fluxCompatible: true },
    { id: "landscape_16_9", name: "Landscape 16:9", dimensions: "1024x576", fluxCompatible: true }
  ];
}

/**
 * Get valid parameters for Flux Schnell model
 * @returns {Object} Valid parameter ranges and defaults
 */
export function getFluxSchnellParams() {
  return {
    num_inference_steps: {
      min: 1,
      max: 4,
      default: 4,
      description: "Number of denoising steps (1-4 for Flux Schnell)"
    },
    image_sizes: getAvailableImageSizes().map(size => size.id),
    unsupported_params: [
      "guidance_scale", 
      "enable_safety_checker", 
      "negative_prompt",
      "scheduler"
    ]
  };
}

/**
 * Check if AI service is properly configured
 * @returns {Object} Configuration status
 */
export function checkAIServiceConfig() {
  const config = {
    gemini: !!(process.env.GOOGLE_GENERATIVE_AI_API_KEY || genAI),
    fal: !!(process.env.FAL_API_KEY || fal),
    allConfigured: true, // Since we have fallback keys
    defaultImageModel: "fal-ai/flux-1/schnell"
  };

  return config;
}