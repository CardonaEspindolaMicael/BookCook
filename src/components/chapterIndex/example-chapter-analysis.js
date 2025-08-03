import { actualizarAnalisisCapitulo } from './chapterIndex.models.js';

// Example usage of the updated function with Gemini AI integration
async function exampleChapterAnalysis() {
  console.log('📚 Example: Chapter Analysis with Gemini AI\n');
  
  try {
    // Example chapter ID (replace with actual chapter ID from your database)
    const chapterId = 'example-chapter-id';
    
    console.log('🔄 Starting AI-powered chapter analysis...');
    console.log('Chapter ID:', chapterId);
    console.log('');
    
    // Call the updated function
    const result = await actualizarAnalisisCapitulo(chapterId);
    
    console.log('✅ Analysis completed successfully!');
    console.log('');
    
    // Display the results
    console.log('📊 Analysis Results:');
    console.log('- Chapter Title:', result.chapter?.title);
    console.log('- Summary:', result.summary);
    console.log('- Key Events:', JSON.parse(result.keyEvents));
    console.log('- Characters:', JSON.parse(result.characters));
    console.log('- Mood:', result.mood);
    console.log('- Cliffhanger:', result.cliffhanger);
    console.log('- Word Count:', result.wordCount);
    console.log('- Thematic Analysis:', result.thematicAnalysis || 'N/A');
    console.log('');
    
    // Display AI analysis metadata
    if (result.aiAnalysis) {
      console.log('🤖 AI Analysis Metadata:');
      if (result.aiAnalysis.success) {
        console.log('- AI Success: ✅');
        console.log('- Processing Time:', result.aiAnalysis.processingTime + 'ms');
        console.log('- Tokens Used:', result.aiAnalysis.tokenUsed);
        console.log('- Model Used:', result.aiAnalysis.model);
      } else {
        console.log('- AI Success: ❌');
        console.log('- Error:', result.aiAnalysis.error);
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Error during chapter analysis:', error.message);
    throw error;
  }
}

// Example of batch processing multiple chapters
async function batchChapterAnalysis(chapterIds) {
  console.log('🔄 Starting batch chapter analysis...');
  console.log('Chapters to analyze:', chapterIds.length);
  console.log('');
  
  const results = [];
  
  for (let i = 0; i < chapterIds.length; i++) {
    const chapterId = chapterIds[i];
    console.log(`📖 Analyzing chapter ${i + 1}/${chapterIds.length}: ${chapterId}`);
    
    try {
      const result = await actualizarAnalisisCapitulo(chapterId);
      results.push({
        chapterId,
        success: true,
        result
      });
      console.log('✅ Success');
    } catch (error) {
      console.log('❌ Failed:', error.message);
      results.push({
        chapterId,
        success: false,
        error: error.message
      });
    }
    
    // Add a small delay between requests to avoid rate limiting
    if (i < chapterIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('');
  console.log('📊 Batch Analysis Summary:');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`- Successful: ${successful}`);
  console.log(`- Failed: ${failed}`);
  console.log(`- Total: ${results.length}`);
  
  return results;
}

// Example of analyzing chapters by book
async function analyzeBookChapters(bookId) {
  console.log('📚 Analyzing all chapters for book:', bookId);
  
  // This would typically query your database to get all chapter IDs for a book
  // For this example, we'll use placeholder chapter IDs
  const chapterIds = [
    'chapter-1-id',
    'chapter-2-id', 
    'chapter-3-id'
  ];
  
  return await batchChapterAnalysis(chapterIds);
}

// Export functions for use in other files
export {
  exampleChapterAnalysis,
  batchChapterAnalysis,
  analyzeBookChapters
};

// Run example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleChapterAnalysis()
    .then(() => console.log('\n✅ Example completed successfully!'))
    .catch(error => console.error('\n❌ Example failed:', error.message));
} 