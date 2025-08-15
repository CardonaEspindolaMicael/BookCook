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
    const model = params.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp", // can use 1.5-flash if you want cheaper/faster
  generationConfig: {
    temperature: 0.8,
    responseMimeType: "application/json" // Force JSON output
  } });
    
    // Generate content with Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Estimate token usage (rough approximation)
    const tokenUsed = Math.ceil(fullPrompt.length / 4) + Math.ceil(text.length / 4);
    
    return {
      success: true,
      response: JSON.parse(text), 
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





export async function createFullBook(params) {
  const startTime = Date.now();
  try {
    // Build the complete prompt with context
    console.log(params)
    let fullPrompt = params.interactionType.systemPrompt + "\n\n";
       
    // Add user query
    fullPrompt += `User Query: ${params.userQuery}\n\n`;




    
    // Add the user prompt template if it exists
    /*if (params.interactionType.userPrompt) {
      // Replace placeholders in user prompt
      let userPrompt = params.interactionType.userPrompt;
      
      fullPrompt += userPrompt;
    }
    */

    // Get the model
    const model = params.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp", // can use 1.5-flash if you want cheaper/faster
  generationConfig: {
    temperature: 0.8,
    responseMimeType: "application/json" // Force JSON output
  } });
    
    // Generate content with Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Estimate token usage (rough approximation)
    
    const tokenUsed = Math.ceil(fullPrompt.length / 4) + Math.ceil(text.length / 4);
        console.log(fullPrompt)
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


// Example usage




