import { actualizarAnalisisLibro } from './bookIndex.models.js';

// Example usage of the updated function with Gemini AI integration
async function exampleBookAnalysis() {
  console.log('📚 Example: Book Analysis with Gemini AI\n');
  
  try {
    // Example book ID (replace with actual book ID from your database)
    const bookId = 'example-book-id';
    
    console.log('🔄 Starting AI-powered book analysis...');
    console.log('Book ID:', bookId);
    console.log('');
    
    // Call the updated function
    const result = await actualizarAnalisisLibro(bookId);
    
    console.log('✅ Book analysis completed successfully!');
    console.log('');
    
    // Display the results
    console.log('📊 Analysis Results:');
    console.log('- Book Title:', result.book?.title);
    console.log('- Author:', result.book?.author?.name);
    console.log('- Summary:', result.summary);
    console.log('- Themes:', JSON.parse(result.themes));
    console.log('- Characters:', JSON.parse(result.characters));
    console.log('- Plot Points:', JSON.parse(result.plotPoints));
    console.log('- Tone:', result.tone);
    console.log('- Genre:', result.genre);
    console.log('- Word Count:', result.wordCount);
    console.log('- Structure Analysis:', result.structureAnalysis || 'N/A');
    console.log('- Cliffhangers:', JSON.parse(result.cliffhangers || '[]'));
    console.log('');
    
    // Display book statistics
    if (result.bookStats) {
      console.log('📈 Book Statistics:');
      console.log('- Total Chapters:', result.bookStats.totalChapters);
      console.log('- Analyzed Chapters:', result.bookStats.analyzedChapters);
      console.log('- Total Word Count:', result.bookStats.totalWordCount);
      console.log('- Average Word Count per Chapter:', result.bookStats.averageWordCount);
      console.log('- Chapters with Cliffhangers:', result.bookStats.chaptersWithCliffhangers);
      console.log('');
    }
    
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
    console.error('❌ Error during book analysis:', error.message);
    throw error;
  }
}

// Example of batch processing multiple books
async function batchBookAnalysis(bookIds) {
  console.log('🔄 Starting batch book analysis...');
  console.log('Books to analyze:', bookIds.length);
  console.log('');
  
  const results = [];
  
  for (let i = 0; i < bookIds.length; i++) {
    const bookId = bookIds[i];
    console.log(`📖 Analyzing book ${i + 1}/${bookIds.length}: ${bookId}`);
    
    try {
      const result = await actualizarAnalisisLibro(bookId);
      results.push({
        bookId,
        success: true,
        result
      });
      console.log('✅ Success');
    } catch (error) {
      console.log('❌ Failed:', error.message);
      results.push({
        bookId,
        success: false,
        error: error.message
      });
    }
    
    // Add a small delay between requests to avoid rate limiting
    if (i < bookIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
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

// Example of analyzing books by author
async function analyzeAuthorBooks(authorId) {
  console.log('👤 Analyzing all books for author:', authorId);
  
  // This would typically query your database to get all book IDs for an author
  // For this example, we'll use placeholder book IDs
  const bookIds = [
    'book-1-id',
    'book-2-id', 
    'book-3-id'
  ];
  
  return await batchBookAnalysis(bookIds);
}

// Example of complete book analysis workflow
async function completeBookAnalysisWorkflow(bookId) {
  console.log('🔄 Starting complete book analysis workflow...');
  console.log('Book ID:', bookId);
  console.log('');
  
  try {
    // Step 1: Analyze all chapters first
    console.log('📖 Step 1: Analyzing individual chapters...');
    // This would typically call actualizarAnalisisCapitulo for each chapter
    // For demonstration, we'll simulate this step
    console.log('✅ Chapters analyzed (simulated)');
    console.log('');
    
    // Step 2: Analyze the complete book
    console.log('📚 Step 2: Analyzing complete book...');
    const bookResult = await actualizarAnalisisLibro(bookId);
    
    console.log('✅ Complete book analysis finished!');
    console.log('');
    
    // Step 3: Display comprehensive results
    console.log('📊 Comprehensive Analysis Results:');
    console.log('- Book:', bookResult.book?.title);
    console.log('- Author:', bookResult.book?.author?.name);
    console.log('- Summary:', bookResult.summary);
    console.log('- Genre:', bookResult.genre);
    console.log('- Tone:', bookResult.tone);
    console.log('- Word Count:', bookResult.wordCount);
    console.log('- Analysis Version:', bookResult.analysisVersion);
    
    if (bookResult.aiAnalysis?.success) {
      console.log('- AI Processing Time:', bookResult.aiAnalysis.processingTime + 'ms');
      console.log('- AI Tokens Used:', bookResult.aiAnalysis.tokenUsed);
    }
    
    return bookResult;
    
  } catch (error) {
    console.error('❌ Error in complete workflow:', error.message);
    throw error;
  }
}

// Export functions for use in other files
export {
  exampleBookAnalysis,
  batchBookAnalysis,
  analyzeAuthorBooks,
  completeBookAnalysisWorkflow
};

// Run example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleBookAnalysis()
    .then(() => console.log('\n✅ Example completed successfully!'))
    .catch(error => console.error('\n❌ Example failed:', error.message));
} 