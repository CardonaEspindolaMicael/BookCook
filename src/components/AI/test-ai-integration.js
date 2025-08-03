import { sendToAIService, checkAIServiceConfig } from './aiServiceIntegration.js';

// Test configuration
async function testAIConfiguration() {
  console.log('🔧 Testing AI Service Configuration...');
  
  const config = checkAIServiceConfig();
  console.log('Configuration Status:', config);
  
  if (!config.allConfigured) {
    console.log('❌ AI services not fully configured');
    console.log('Please set GOOGLE_GENERATIVE_AI_API_KEY and FAL_API_KEY in your .env file');
    return false;
  }
  
  console.log('✅ AI services configured correctly');
  return true;
}

// Test Gemini text generation
async function testGeminiIntegration() {
  console.log('\n🤖 Testing Gemini Text Generation...');
  
  const testRequest = {
    userQuery: "Generate a creative title for a fantasy novel about a young wizard",
    interactionType: {
      name: "Title Forge",
      category: "title_generator",
      systemPrompt: "You are a master marketing copywriter and editor for a major publishing house. You have a proven talent for crafting book titles that are memorable, marketable, and perfectly suited to their genre and audience.",
      userPrompt: "Generate a list of potential titles for my book. Here is the core information:\n- Genre: {genre}\n- Brief Plot Summary: {summary}\n- Key Themes: {themes}",
      costPerUse: 2
    },
    contextData: {
      genre: "fantasy",
      summary: "A young wizard discovers ancient magic and must save his village from dark forces",
      themes: "Courage, friendship, the power of knowledge"
    },
    bookContext: {
      genre: "fantasy",
      summary: "A young wizard discovers ancient magic and must save his village from dark forces",
      themes: "Courage, friendship, the power of knowledge"
    }
  };
  
  try {
    const result = await sendToAIService(testRequest);
    
    if (result.success) {
      console.log('✅ Gemini integration working');
      console.log('Response:', result.response.substring(0, 200) + '...');
      console.log('Tokens used:', result.tokenUsed);
      console.log('Processing time:', result.processingTime + 'ms');
    } else {
      console.log('❌ Gemini integration failed:', result.error);
    }
    
    return result.success;
  } catch (error) {
    console.log('❌ Gemini test error:', error.message);
    return false;
  }
}

// Test Fal image generation
async function testFalIntegration() {
  console.log('\n🎨 Testing Fal Image Generation...');
  
  const testRequest = {
    userQuery: "A mystical forest with ancient stone ruins, fantasy book cover style",
    interactionType: {
      name: "Cover Generator",
      category: "image_generation",
      costPerUse: 5
    },
    contextData: {
      model: "fal-ai/flux-1/schnell",
      imageOptions: {
        image_size: "512x512",
        num_inference_steps: 30,
        guidance_scale: 7.5
      }
    }
  };
  
  try {
    const result = await sendToAIService(testRequest);
    
    if (result.success) {
      console.log('✅ Fal integration working');
      console.log('Image URL:', result.imageUrl);
      console.log('Processing time:', result.processingTime + 'ms');
    } else {
      console.log('❌ Fal integration failed:', result.error);
    }
    
    return result.success;
  } catch (error) {
    console.log('❌ Fal test error:', error.message);
    return false;
  }
}

// Main test function
async function runAITests() {
  console.log('🚀 Starting AI Integration Tests...\n');
  
  // Test configuration
  const configOk = await testAIConfiguration();
  if (!configOk) {
    console.log('\n❌ Configuration test failed. Please check your API keys.');
    return;
  }
  
  // Test Gemini
  const geminiOk = await testGeminiIntegration();
  
  // Test Fal
  const falOk = await testFalIntegration();
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('Configuration:', configOk ? '✅' : '❌');
  console.log('Gemini Integration:', geminiOk ? '✅' : '❌');
  console.log('Fal Integration:', falOk ? '✅' : '❌');
  
  if (configOk && geminiOk && falOk) {
    console.log('\n🎉 All tests passed! AI integration is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the error messages above.');
  }
}

runAITests();

export { runAITests, testAIConfiguration, testGeminiIntegration, testFalIntegration }; 