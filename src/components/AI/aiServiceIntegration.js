import { GoogleGenerativeAI } from "@google/generative-ai";
import { fal } from "@fal-ai/client";
import { uploadBase64Image } from "../../helpers/CloudinaryHelper.js";
import { response } from "express";
import { sendToFalImage } from "./prompts/ImagesPromtps.js";

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
export async function sendToGemini(params) {
  const startTime = Date.now();
  try {
    // Build the complete prompt with context
    console.log(params)
    let fullPrompt = params.interactionType.systemPrompt + "\n\n";
       
    // Add user query
    fullPrompt += `User Query: ${params.userQuery}\n\n`;
    
    // Add context data if available
    if (params.contextData) {
      fullPrompt += `Context Data: ${JSON.stringify(params.contextData)}\n\n`;
    }
      
    // Add book context if available
    if (params.bookContext) {
      console.log('Book Context:', params.bookContext);
      fullPrompt += `Book Information:\n`;
      if (params.bookContext.summary) fullPrompt += `Summary: ${params.bookContext.summary}\n`;
      if (params.bookContext.themes) fullPrompt += `Themes: ${params.bookContext.themes}\n`;
      if (params.bookContext.genre) fullPrompt += `Genre: ${params.bookContext.genre}\n`;
      if (params.bookContext.tone) fullPrompt += `Tone: ${params.bookContext.tone}\n`;
      fullPrompt += "\n";
    }
    
    // Add chapter context if available
    if (params.chapterContext) {
      fullPrompt += `Chapter Information:\n`;
      if (params.chapterContext.summary) fullPrompt += `Summary: ${params.chapterContext.summary}\n`;
      if (params.chapterContext.content) fullPrompt += `Content: ${params.chapterContext.content.substring(0, 1000)}...\n`;
      if (params.chapterContext.mood) fullPrompt += `Mood: ${params.chapterContext.mood}\n`;
      if (params.chapterContext.chapterAnalyses) fullPrompt += `Analyses :${params.chapterContext.chapterAnalyses}}\n`
      fullPrompt += "\n";
    }

    
    // Add the user prompt template if it exists
    if (params.interactionType.userPrompt) {
      // Replace placeholders in user prompt
      let userPrompt = params.interactionType.userPrompt;
      
      if (params.bookContext) {
        userPrompt = userPrompt.replace('{genre}', params.bookContext.genre || 'Unknown');
        userPrompt = userPrompt.replace('{summary}', params.bookContext.summary || 'No summary available');
        userPrompt = userPrompt.replace('{themes}', params.bookContext.themes || 'No themes specified');
        userPrompt = userPrompt.replace('{protagonist_info}', params.bookContext.characters || 'No character info available');
      }
      
      fullPrompt += userPrompt;
    }
    
    console.log(fullPrompt)
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    // Generate content with Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Estimate token usage (rough approximation)
    const tokenUsed = Math.ceil(fullPrompt.length / 4) + Math.ceil(text.length / 4);
    
    return {
      success: true,
      response: text,
      tokenUsed,
      processingTime: Date.now() - startTime,
      model: "gemini-2.0-flash-exp"
    };
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: error.message,
      processingTime: Date.now() - startTime
    };
  }
}

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

    // Default to text generation with Gemini
   return await sendToGemini({
      userQuery: aiRequest.userQuery,
      interactionType: aiRequest.interactionType,
      contextData: aiRequest.contextData,
      bookContext: aiRequest.bookContext,
      chapterContext: aiRequest.chapterContext
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