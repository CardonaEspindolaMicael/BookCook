import { generateImageWithFal } from "../aiServiceIntegration.js";

export async function sendToFalImage(params) {
  const startTime = Date.now();

  try {
    console.log('Image Generation Params:', params);

    const { interactionType, userQuery, bookContext } = params;

    // Start with system prompt
    let fullPrompt = `${interactionType.systemPrompt}\n\n`;

    // ✅ User Query gets *explicit priority* as overriding instruction
    if (userQuery?.trim()) {
      fullPrompt += `IMPORTANT: The user has specific preferences. Please prioritize this instruction (This can be empty): "${userQuery.trim()}"\n\n`;
    }

    // Prepare replacements
    let userPrompt = interactionType.userPrompt;

    // Replace placeholders safely
    userPrompt = userPrompt.replace('{book_title}', bookContext?.book?.title || 'Unknown Title');
    userPrompt = userPrompt.replace('{author_name}', bookContext?.book?.author?.name || 'Unknown Author');
    userPrompt = userPrompt.replace('{genre}', bookContext?.genre || 'Unknown Genre');
    userPrompt = userPrompt.replace('{synopsis}', bookContext?.summary || 'No synopsis available');
    userPrompt = userPrompt.replace('{mood}', bookContext?.tone || 'Neutral');
    userPrompt = userPrompt.replace('{symbols}', bookContext?.symbols || 'No specific symbols');

    // Append processed prompt
    fullPrompt += userPrompt;

    console.log('Final FAL Prompt:\n', fullPrompt);

    // Call FAL
    const result = await generateImageWithFal({
      prompt: fullPrompt,
      options: {
        width: 800,
        height: 1200
      }
    });

    return result;

  } catch (error) {
    console.error('Fal Image API Error:', error);
    return {
      success: false,
      error: error.message,
      processingTime: Date.now() - startTime
    };
  }
}
