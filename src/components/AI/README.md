# AI Writing Assistant Component

## Overview
The AI Writing Assistant is a comprehensive AI-powered writing tool that helps authors create, develop, and improve their stories. It integrates with multiple AI providers (OpenAI, Claude, Gemini) and provides various writing assist ance features.

## 🎯 Features

### Core AI Writing Tools
- **Brainstorm Ideas**: Generate story ideas and plot concepts
- **Title Generator**: Create compelling book and chapter titles
- **Chapter Writer**: Help with chapter development and writing
- **Character Developer**: Develop and flesh out characters
- **Plot Analyzer**: Analyze plot consistency and structure
- **Ending Helper**: Create satisfying story endings
- **One-shot Creator**: Generate standalone stories

### Smart Features
- **Usage Tracking**: Monthly credit system with limits
- **Context Awareness**: AI understands your book's content and style
- **Content Indexing**: Automatic analysis of book and chapter content
- **User Feedback**: Rate AI responses to improve future suggestions
- **Suggestion Application**: Apply AI suggestions directly to content
- **Notification System**: Track AI interactions and updates

## 🔄 Workflow (Based on Flowchart)

### 1. User Initiates AI Help
```
Author writing → Clicks AI Writing Assistant → Check AI Usage
```

### 2. Credit Validation
```
Check AIUsage (monthly limit) → Has credits? → Show options or upgrade message
```

### 3. AI Interaction Types
```
Show AI assistant options:
├── Brainstorm Ideas
├── Generate Title  
├── Write Chapter
├── Develop Character
├── Plot Analysis
└── Create Ending
```

### 4. AI Request Processing
```
Select interaction type → Check InteractionType (cost & prompts) → 
Get BookIndex/ChapterIndex (context) → Send to AI service
```

### 5. Response Handling
```
AI responds → Create AIInteraction record → Update AIUsage → 
Display response to user
```

### 6. User Feedback Loop
```
User rates response → Update AIInteraction → 
Apply suggestions → Update content indexes → Create notifications
```

## 📊 Database Models

### Core AI Models
- **AIAssistant**: AI service providers (GPT-4, Claude, Gemini)
- **InteractionType**: Different AI writing tools and their costs
- **AIInteraction**: Records of all AI interactions
- **AIUsage**: Monthly usage tracking and limits

### Content Indexing
- **BookIndex**: AI analysis of entire books
- **ChapterIndex**: AI analysis of individual chapters

### Supporting Models
- **Notification**: System notifications for AI interactions
- **User**: User authentication and preferences

## 🚀 API Endpoints

### Base URL
```
http://localhost:3001/api-v1/ai-writing
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/options` | Get AI writing options and check credits |
| POST | `/help` | Request AI help |
| POST | `/rate` | Rate AI response |
| POST | `/apply` | Apply AI suggestion to content |
| GET | `/usage` | Get AI usage statistics |

## 💰 Credit System

### Free Tier
- **Monthly Limit**: 100 interactions
- **Default Credits**: 100 per month
- **Reset**: Monthly on the 1st

### Premium Features
- Higher monthly limits
- Priority AI processing
- Advanced AI models
- Custom interaction types

## 🔧 Technical Implementation

### AI Service Integration
```javascript
// Example AI service call
const aiResponse = await sendToAIService({
  interactionType: "brainstorm",
  userQuery: "Help me brainstorm fantasy novel ideas",
  contextData: "Magical academy setting...",
  bookContext: bookIndex,
  chapterContext: chapterIndex
});
```

### Usage Tracking
```javascript
// Check and update usage
const aiUsage = await checkAIUsage(userId);
if (aiUsage.remainingCredits < interactionCost) {
  return insufficientCreditsError();
}
await updateAIUsage(userId, tokensUsed, creditsUsed);
```

### Content Indexing
```javascript
// Update content when AI suggestions are applied
if (appliedContent.bookContent) {
  await updateBookIndex(bookId, appliedContent.bookContent);
}
if (appliedContent.chapterContent) {
  await updateChapterIndex(chapterId, appliedContent.chapterContent);
}
```

## 📝 Usage Examples

### Get AI Writing Options
```bash
curl -X GET "http://localhost:3001/api-v1/ai-writing/options?bookId=123&chapterId=456" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Request AI Help
```bash
curl -X POST http://localhost:3001/api-v1/ai-writing/help \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "interactionTypeId": "123e4567-e89b-12d3-a456-426614174000",
    "bookId": "123e4567-e89b-12d3-a456-426614174001",
    "userQuery": "Help me brainstorm ideas for a fantasy novel about a young wizard",
    "contextData": "The story is set in a magical academy..."
  }'
```

### Rate AI Response
```bash
curl -X POST http://localhost:3001/api-v1/ai-writing/rate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "interactionId": "123e4567-e89b-12d3-a456-426614174000",
    "satisfaction": 5,
    "wasUseful": true
  }'
```

### Apply AI Suggestion
```bash
curl -X POST http://localhost:3001/api-v1/ai-writing/apply \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "interactionId": "123e4567-e89b-12d3-a456-426614174000",
    "appliedContent": {
      "bookContent": "Updated book content with AI suggestions...",
      "chapterContent": "Updated chapter content with AI suggestions..."
    },
    "bookId": "123e4567-e89b-12d3-a456-426614174001",
    "chapterId": "123e4567-e89b-12d3-a456-426614174002"
  }'
```

## 🔐 Security & Validation

### Authentication
- JWT Bearer token required for all endpoints
- User ID extracted from token for usage tracking

### Input Validation
- Zod schemas for all request validation
- UUID validation for IDs
- String length limits for queries
- Numeric validation for ratings

### Error Handling
- **401**: Unauthorized (missing/invalid token)
- **402**: Payment Required (insufficient credits)
- **404**: Not Found (interaction type not found)
- **500**: Internal Server Error (AI service issues)

## 📈 Monitoring & Analytics

### Usage Tracking
- Monthly interaction counts
- Token usage per interaction
- Credit consumption tracking
- User satisfaction ratings

### Performance Metrics
- AI response times
- Success/failure rates
- User engagement patterns
- Content update frequency

## 🔄 Integration Points

### With Book Component
- Book content indexing
- Chapter content analysis
- Author relationship tracking

### With User Component
- User authentication
- Premium status checking
- Usage limit enforcement

### With Notification System
- AI interaction notifications
- Credit limit warnings
- Suggestion application confirmations

## 🚀 Future Enhancements

### Planned Features
- **Multi-language Support**: AI assistance in multiple languages
- **Style Transfer**: Adapt AI suggestions to user's writing style
- **Collaborative Writing**: AI assistance for co-authored works
- **Advanced Analytics**: Detailed writing pattern analysis
- **Custom AI Models**: User-specific AI training

### Technical Improvements
- **Real-time Processing**: WebSocket integration for live AI responses
- **Batch Processing**: Handle multiple AI requests simultaneously
- **Caching System**: Cache common AI responses for faster access
- **A/B Testing**: Test different AI models and prompts

## 📚 Swagger Documentation

Complete API documentation is available at:
```
http://localhost:3001/api-docs
```

The documentation includes:
- All endpoint specifications
- Request/response schemas
- Authentication requirements
- Error handling examples
- Interactive testing interface

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Prisma ORM
- JWT authentication

### Installation
```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nftbookplatform"
JWT_SECRET="your-jwt-secret"
OPENAI_API_KEY="your-openai-key"
CLAUDE_API_KEY="your-claude-key"
GEMINI_API_KEY="your-gemini-key"
```

## 🤝 Contributing

### Code Structure
```
src/components/AI/
├── aiWritingAssistant.controllers.js  # Main controller logic
├── aiWritingAssistant.models.js       # Database operations
├── aiWritingAssistant.routes.js       # Express routes
├── aiWritingAssistant.swagger.js      # API documentation
├── dto/
│   └── aiInteraction.dto.js          # Validation schemas
└── README.md                         # This file
```

### Testing
- Unit tests for controllers
- Integration tests for AI services
- Database operation tests
- API endpoint tests

### Code Style
- ESLint configuration
- Prettier formatting
- JSDoc documentation
- TypeScript definitions (future) 