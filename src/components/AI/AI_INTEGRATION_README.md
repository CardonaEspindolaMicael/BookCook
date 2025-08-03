# AI Integration Setup Guide

This guide explains how to set up the AI integration with Gemini API and Fal for image generation.

## Required Environment Variables

Add these to your `.env` file:

```env
# Gemini API for text generation
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# Fal API for image generation
FAL_API_KEY="your-fal-api-key"
```

## Getting API Keys

### Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### Fal API
1. Go to [Fal AI](https://fal.ai/)
2. Sign up and get your API key
3. Copy the key to your `.env` file

## Features

### Text Generation (Gemini)
- Book title generation
- Chapter summaries
- Character development
- Plot suggestions
- Writing assistance

### Image Generation (Fal)
- Book cover generation
- Character illustrations
- Scene visualizations
- Marketing materials

## API Endpoints

### Check Configuration
```
GET /ai/config
```
Returns the status of AI service configuration.

### Request AI Help
```
POST /ai/help
```
Body:
```json
{
  "interactionTypeId": "uuid",
  "bookId": "uuid",
  "chapterId": "uuid", 
  "userQuery": "Generate a title for my fantasy novel",
  "contextData": {
    "genre": "fantasy",
    "summary": "A young wizard discovers..."
  }
}
```

### Get AI Usage
```
GET /ai/usage/:userId
```

## Usage Examples

### Text Generation
```javascript
// Example request for title generation
const request = {
  interactionTypeId: "62e297b3-8e08-4fa1-8a1e-c496253dcf37",
  userQuery: "Generate a title for my fantasy novel",
  contextData: {
    genre: "fantasy",
    summary: "A young wizard discovers ancient magic...",
    themes: "Betrayal, redemption, the cost of power"
  }
};
```

### Image Generation
```javascript
// Example request for book cover generation
const request = {
  interactionTypeId: "image-generation-uuid",
  userQuery: "A mystical forest with ancient ruins",
  contextData: {
    model: "stability-ai/sdxl",
    imageOptions: {
      image_size: "512x512",
      num_inference_steps: 50
    }
  }
};
```

## Error Handling

The integration includes comprehensive error handling:
- API key validation
- Rate limiting
- Token usage tracking
- Fallback responses

## Cost Management

The system tracks:
- Monthly usage limits
- Per-interaction costs
- Remaining credits
- Usage statistics

## Testing

Test the configuration:
```bash
curl http://localhost:3000/ai/config
```

Expected response:
```json
{
  "message": "AI Service Configuration Status",
  "config": {
    "gemini": true,
    "fal": true,
    "allConfigured": true
  }
}
``` 