import { GoogleGenerativeAI } from "@google/generative-ai";
import { fal } from "@fal-ai/client";
import { uploadBase64Image } from "../../helpers/CloudinaryHelper.js";
import { response } from "express";
import { sendToFalImage } from "./prompts/ImagesPromtps.js";
import { createFullBook, sendToGemini } from "./prompts/GeminiPrompts.js";
import { crearCapitulo } from "../chapter/chapter.models.js";
import { parse } from "dotenv";
import { cleanJsonString, parseToJson } from "../../helpers/BookIndexHelper.js";

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
  
        response: urlFinal,
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

export async function generateBookChapters(summary, bookId,totalChapters) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 1.4,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192
    }
  });

  

  try {
   for (let i = 1; i <= totalChapters; i++) {
  const chapterPrompt = `You are an expert writer creating Chapter ${i} of ${totalChapters}.

Book Summary: ${summary}

CRITICAL INSTRUCTIONS:
1. You are writing Chapter ${i} (Chapter Number: ${i})
2. Look for "Chapter ${i}" in the book summary above
3. Extract the title, characters, and events specifically mentioned for Chapter ${i}
4. Write exactly 100+ words of original content based ONLY on Chapter ${i}'s summary
5. Do NOT write about other chapters - focus ONLY on Chapter ${i}

Current Chapter Context: Chapter ${i}
- Find Chapter ${i} in the summary
- Use the title mentioned for Chapter ${i}  
- Include the characters mentioned for Chapter ${i}
- Cover the events described for Chapter ${i}
- Stay within Chapter ${i}'s scope only

Return ONLY this JSON format:
{
  "title": "Chapter ${i}: [Extract exact title from Chapter ${i} summary]",
  "content": "Write 100+ words covering only the events, characters, and plot points mentioned in Chapter ${i} of the summary...",
  "orderIndex": ${i},
  "bookId": "${bookId}",
  "isFree": true,
  "wordCount": 0
}

Remember: You are writing Chapter ${i}. Look for Chapter ${i} in the summary. Use only Chapter ${i} information.`;

  
    const result = await model.generateContent(chapterPrompt);
    const response = await result.response;
    const text = response.text();
    
    const chapterData = parseToJson(cleanJsonString(text));
    console.log(`Parsed data for Chapter ${i}:`, chapterData);
    
    // Validate that we got the right chapter
    if (!chapterData.title || !chapterData.content) {
      console.error(`Chapter ${i} generation failed - missing title or content`);
      console.log("Full response:", text);
    }
    
    const contentChapter = {
      title: chapterData.title || `Chapter ${i}`, // fallback title
      content: chapterData.content || `Chapter ${i} content generation failed.`,
      orderIndex: i,
      bookId: bookId,
      isFree: true,
      wordCount: chapterData.content ? 
        chapterData.content.split(/\s+/).filter(word => word.length > 0).length : 0
    };
    
    console.log(`Created Chapter ${i}:`, contentChapter.title);
    
    const resp = await crearCapitulo(contentChapter);
    console.log(`Database response for Chapter ${i}:`, resp);
    
    // Optional: Add delay between chapters to avoid rate limiting
    if (i < totalChapters) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  
  } }catch (error) {
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