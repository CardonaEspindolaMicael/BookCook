# Chapter Index with Gemini AI Integration

This module provides chapter analysis functionality with integrated Gemini AI capabilities for automatic chapter analysis and indexing.

## Features

- **AI-Powered Analysis**: Uses Gemini AI to automatically analyze chapter content
- **Structured Data**: Extracts key information including summary, events, characters, mood, and cliffhanger detection
- **Fallback System**: Provides fallback analysis if AI fails
- **Database Integration**: Seamlessly integrates with Prisma database
- **Batch Processing**: Support for analyzing multiple chapters

## Functions

### `actualizarAnalisisCapitulo(chapterId)`

Analyzes a chapter using Gemini AI and updates the database with structured analysis data.

**Parameters:**
- `chapterId` (string): The ID of the chapter to analyze

**Returns:**
```javascript
{
  // Database record
  id: string,
  chapterId: string,
  bookId: string,
  content: string,
  summary: string,
  keyEvents: string, // JSON string
  characters: string, // JSON string
  mood: string,
  cliffhanger: boolean,
  wordCount: number,
  thematicAnalysis: string,
  lastAnalyzed: Date,
  
  // AI analysis metadata
  aiAnalysis: {
    success: boolean,
    processingTime: number,
    tokenUsed: number,
    model: string,
    error?: string
  }
}
```

## AI Analysis Features

The Gemini AI integration provides:

1. **Executive Summary**: Concise 2-3 sentence summary of the chapter
2. **Key Events**: List of important events that occur
3. **Character Tracking**: Characters present or mentioned
4. **Mood Analysis**: Emotional tone of the chapter (e.g., tense, joyful, mysterious)
5. **Cliffhanger Detection**: Identifies if chapter ends with a narrative hook
6. **Thematic Analysis**: Optional analysis of themes explored

## Example Usage

```javascript
import { actualizarAnalisisCapitulo } from './chapterIndex.models.js';

// Analyze a single chapter
const result = await actualizarAnalisisCapitulo('chapter-id-123');

console.log('Summary:', result.summary);
console.log('Key Events:', JSON.parse(result.keyEvents));
console.log('Characters:', JSON.parse(result.characters));
console.log('Mood:', result.mood);
console.log('Cliffhanger:', result.cliffhanger);

// Check AI analysis success
if (result.aiAnalysis.success) {
  console.log('AI Processing Time:', result.aiAnalysis.processingTime + 'ms');
  console.log('Tokens Used:', result.aiAnalysis.tokenUsed);
}
```

## Batch Processing

```javascript
import { batchChapterAnalysis } from './example-chapter-analysis.js';

const chapterIds = ['chapter-1', 'chapter-2', 'chapter-3'];
const results = await batchChapterAnalysis(chapterIds);

console.log(`Successfully analyzed ${results.filter(r => r.success).length} chapters`);
```

## Error Handling

The function includes robust error handling:

- **AI Service Failure**: Falls back to basic analysis if AI fails
- **JSON Parsing Error**: Handles malformed AI responses gracefully
- **Database Errors**: Proper error propagation
- **Missing Chapters**: Clear error messages for non-existent chapters

## Configuration

The AI integration uses the following environment variables:

- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini API key
- `FAL_API_KEY`: For image generation (if needed)

## Database Schema

The function expects a `chapterIndex` table with the following fields:

- `id`: Primary key
- `chapterId`: Foreign key to chapters table
- `bookId`: Foreign key to books table
- `content`: Chapter content
- `summary`: AI-generated summary
- `keyEvents`: JSON string of key events
- `characters`: JSON string of characters
- `mood`: Emotional tone
- `cliffhanger`: Boolean for cliffhanger detection
- `wordCount`: Word count
- `thematicAnalysis`: Optional thematic analysis
- `lastAnalyzed`: Timestamp of last analysis

## Performance Considerations

- **Token Usage**: Each analysis uses approximately 3-5 tokens
- **Processing Time**: Typically 1-3 seconds per chapter
- **Rate Limiting**: Built-in delays for batch processing
- **Caching**: Results are stored in database to avoid re-analysis

## Dependencies

- `@google/generative-ai`: Gemini AI client
- `@prisma/client`: Database ORM
- `../AI/aiServiceIntegration.js`: AI service integration

## Troubleshooting

### Common Issues

1. **AI Service Unavailable**
   - Check API key configuration
   - Verify network connectivity
   - Function will use fallback analysis

2. **JSON Parsing Errors**
   - AI response format issues
   - Function includes fallback parsing
   - Check console for warnings

3. **Database Connection Issues**
   - Verify Prisma configuration
   - Check database connectivity
   - Ensure proper schema setup

### Debug Mode

Enable detailed logging by setting:

```javascript
console.log('AI Request:', aiRequest);
console.log('AI Response:', aiResult);
```

## Future Enhancements

- **Custom Analysis Templates**: User-defined analysis criteria
- **Multi-language Support**: Analysis in different languages
- **Advanced Thematic Analysis**: Deeper theme exploration
- **Character Development Tracking**: Character arc analysis
- **Plot Structure Analysis**: Story structure identification 