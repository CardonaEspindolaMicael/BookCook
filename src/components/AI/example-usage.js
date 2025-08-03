import { sendToAIService } from './aiServiceIntegration.js';

// Example usage with the provided data
const exampleAIUsage = {
  "currentUsage": 10,
  "monthlyLimit": 200,
  "remainingCredits": 195,
  "hasCredits": true,
  "resetDate": "2025-09-01T00:00:00.000Z"
};

const exampleInteractionType = {
  "id": "62e297b3-8e08-4fa1-8a1e-c496253dcf37",
  "name": "Title Forge",
  "description": "Creates compelling book titles based on the story's context.",
  "category": "title_generator",
  "systemPrompt": "You are a master marketing copywriter and editor for a major publishing house. You have a proven talent for crafting book titles that are memorable, marketable, and perfectly suited to their genre and audience. You think about intrigue, rhythm, and emotional resonance. Your goal is to provide a diverse range of high-quality title options that an author can choose from. Your tone is sharp, creative, and commercially aware.",
  "userPrompt": "Generate a list of potential titles for my book. Here is the core information:\n- Genre: {genre}\n- Brief Plot Summary: {summary}\n- Key Themes: {themes} (e.g., Betrayal, redemption, the cost of power)\n- Protagonist's Name/Role: {protagonist_info}\n\nBased on this context, brainstorm 10 title ideas, categorizing them as follows:\n- **Three Thematic Titles:** Titles that hint at the core ideas or message of the book.\n- **Three Character-Focused Titles:** Titles that reference the protagonist or a key relationship.\n- **Two Action-Oriented or Plot-Based Titles:** Titles that suggest the central conflict or a key event.\n- **Two Mysterious or Evocative Titles:** Titles that create intrigue and make the reader ask a question.",
  "costPerUse": 2,
  "isActive": true,
  "createdAt": "2025-08-03T01:10:31.547Z"
};

// Example book context
const exampleBookContext = {
  "id": "7eca0393-f19e-4d6f-9458-8783627604a",
  "genre": "fantasy",
  "summary": "A young wizard discovers ancient magic and must save his village from dark forces",
  "themes": "Courage, friendship, the power of knowledge, betrayal, redemption",
  "characters": "Marcus, a 16-year-old apprentice wizard",
  "tone": "Epic and adventurous"
};

// Example chapter context
const exampleChapterContext = {
  "id": "9999",
  "summary": "Marcus discovers an ancient spellbook in the ruins",
  "content": "The old library stood silent, its stone walls covered in ivy. Marcus carefully stepped through the broken doorway, his heart pounding with excitement and fear. Dust motes danced in the thin beams of sunlight that filtered through the cracked windows. He had heard stories about this place, about the powerful magic that had once been practiced here...",
  "mood": "Mysterious and tense"
};

// Example 1: Generate book titles
async function generateBookTitles() {
  console.log('📚 Generating book titles...');
  
  const request = {
    userQuery: "Generate creative titles for my fantasy novel",
    interactionType: exampleInteractionType,
    contextData: {
      genre: exampleBookContext.genre,
      summary: exampleBookContext.summary,
      themes: exampleBookContext.themes,
      protagonist_info: exampleBookContext.characters
    },
    bookContext: exampleBookContext,
    chapterContext: exampleChapterContext
  };
  
  try {
    const result = await sendToAIService(request);
    
    if (result.success) {
      console.log('✅ Titles generated successfully!');
      console.log('Response:', result.response);
      console.log('Tokens used:', result.tokenUsed);
      console.log('Processing time:', result.processingTime + 'ms');
      console.log('Remaining credits:', exampleAIUsage.remainingCredits - exampleInteractionType.costPerUse);
    } else {
      console.log('❌ Failed to generate titles:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating titles:', error);
    return { success: false, error: error.message };
  }
}

// Example 2: Generate book cover image
async function generateBookCover() {
  console.log('🎨 Generating book cover...');
  
  const request = {
    userQuery: "A mystical forest with ancient stone ruins, fantasy book cover style, dramatic lighting",
    interactionType: {
      name: "Cover Generator",
      category: "image_generation",
      costPerUse: 5
    },
    contextData: {
      model: "stability-ai/sdxl",
      imageOptions: {
        image_size: "512x512",
        num_inference_steps: 50,
        guidance_scale: 7.5
      }
    },
    bookContext: exampleBookContext
  };
  
  try {
    const result = await sendToAIService(request);
    
    if (result.success) {
      console.log('✅ Cover generated successfully!');
      console.log('Image URL:', result.imageUrl);
      console.log('Processing time:', result.processingTime + 'ms');
      console.log('Model used:', result.model);
    } else {
      console.log('❌ Failed to generate cover:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating cover:', error);
    return { success: false, error: error.message };
  }
}

// Example 3: Generate chapter summary
async function generateChapterSummary() {
  console.log('📖 Generating chapter summary...');
  
  const request = {
    userQuery: "Summarize this chapter and suggest what could happen next",
    interactionType: {
      name: "Chapter Analyzer",
      category: "text_generation",
      systemPrompt: "You are an expert book editor and writing coach. You help authors improve their writing by providing insightful analysis and suggestions.",
      userPrompt: "Analyze this chapter and provide:\n1. A concise summary\n2. Key plot points\n3. Character development notes\n4. Suggestions for the next chapter",
      costPerUse: 3
    },
    contextData: {
      chapterContent: exampleChapterContext.content,
      chapterMood: exampleChapterContext.mood
    },
    bookContext: exampleBookContext,
    chapterContext: exampleChapterContext
  };
  
  try {
    const result = await sendToAIService(request);
    
    if (result.success) {
      console.log('✅ Chapter analysis completed!');
      console.log('Response:', result.response);
      console.log('Tokens used:', result.tokenUsed);
    } else {
      console.log('❌ Failed to analyze chapter:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Error analyzing chapter:', error);
    return { success: false, error: error.message };
  }
}

// Example 4: Chapter analysis using the updated actualizarAnalisisCapitulo function
async function analyzeChapterWithDatabase() {
  console.log('📚 Analyzing chapter with database integration...');
  
  // Import the function (this would be done at the top of the file in a real implementation)
  const { actualizarAnalisisCapitulo } = await import('../chapterIndex/chapterIndex.models.js');
  
  try {
    // Example chapter ID (replace with actual chapter ID from your database)
    const chapterId = 'example-chapter-id';
    
    console.log('🔄 Starting AI-powered chapter analysis...');
    console.log('Chapter ID:', chapterId);
    
    const result = await actualizarAnalisisCapitulo(chapterId);
    
    if (result.aiAnalysis?.success) {
      console.log('✅ Chapter analysis completed successfully!');
      console.log('📊 Analysis Results:');
      console.log('- Summary:', result.summary);
      console.log('- Key Events:', JSON.parse(result.keyEvents));
      console.log('- Characters:', JSON.parse(result.characters));
      console.log('- Mood:', result.mood);
      console.log('- Cliffhanger:', result.cliffhanger);
      console.log('- Word Count:', result.wordCount);
      console.log('- Thematic Analysis:', result.thematicAnalysis || 'N/A');
      console.log('');
      console.log('🤖 AI Analysis Metadata:');
      console.log('- Processing Time:', result.aiAnalysis.processingTime + 'ms');
      console.log('- Tokens Used:', result.aiAnalysis.tokenUsed);
      console.log('- Model Used:', result.aiAnalysis.model);
    } else {
      console.log('❌ AI analysis failed:', result.aiAnalysis?.error);
      console.log('📊 Fallback analysis results:');
      console.log('- Summary:', result.summary);
      console.log('- Key Events:', JSON.parse(result.keyEvents));
      console.log('- Characters:', JSON.parse(result.characters));
      console.log('- Mood:', result.mood);
      console.log('- Cliffhanger:', result.cliffhanger);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error during chapter analysis:', error.message);
    return { success: false, error: error.message };
  }
}

// Run all examples
async function runExamples() {
  console.log('🚀 Running AI Integration Examples...\n');
  
  console.log('📊 Current AI Usage:');
  console.log('- Current Usage:', exampleAIUsage.currentUsage);
  console.log('- Monthly Limit:', exampleAIUsage.monthlyLimit);
  console.log('- Remaining Credits:', exampleAIUsage.remainingCredits);
  console.log('- Has Credits:', exampleAIUsage.hasCredits);
  console.log('- Reset Date:', exampleAIUsage.resetDate);
  console.log('');
  
  // Run examples
  await generateBookTitles();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await generateBookCover();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await generateChapterSummary();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await analyzeChapterWithDatabase();
  
  console.log('\n✅ All examples completed!');
}

// Export functions for use in other files
export {
  generateBookTitles,
  generateBookCover,
  generateChapterSummary,
  analyzeChapterWithDatabase,
  runExamples,
  exampleAIUsage,
  exampleInteractionType,
  exampleBookContext,
  exampleChapterContext
};

generateBookTitles();