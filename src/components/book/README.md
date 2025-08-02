# Book Component Documentation

## Overview
The Book component provides comprehensive API endpoints for managing books in the NFT Book Platform. This component supports both traditional book management and NFT functionality.

## Features
- **CRUD Operations**: Create, read, update, and delete books
- **NFT Support**: Manage books as NFTs with blockchain integration
- **Search & Filter**: Search books by title/description and filter by status
- **Statistics**: Get comprehensive book statistics
- **View Tracking**: Track book views
- **Author Management**: Get books by specific authors

## API Endpoints

### Base URL
```
http://localhost:3001/api-v1/books
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all books |
| POST | `/` | Create a new book |
| PUT | `/` | Update a book |
| DELETE | `/{id}` | Delete a book |
| GET | `/{id}` | Get book by ID |
| GET | `/nft` | Get NFT books |
| GET | `/gratuitos` | Get free books |
| GET | `/buscar?searchTerm={term}` | Search books |
| GET | `/estado/{status}` | Get books by status |
| GET | `/autor/{authorId}` | Get books by author |
| GET | `/estadisticas/{bookId}` | Get book statistics |
| PATCH | `/{bookId}/vista` | Increment book view count |

## Book Model

### Core Fields
- `id` (UUID): Unique identifier
- `title` (String): Book title (max 200 chars)
- `description` (Text): Book description
- `cover` (String): Cover image URL
- `authorId` (UUID): Author's user ID

### Content Settings
- `isFree` (Boolean): Whether the book is free to read
- `isComplete` (Boolean): Whether the book is finished
- `totalChapters` (Integer): Total chapters planned

### NFT Settings
- `isNFT` (Boolean): Whether the book has been minted as NFT
- `nftPrice` (Float): Price in ETH/MATIC for NFT minting
- `maxSupply` (Integer): Maximum NFT copies for limited editions
- `currentSupply` (Integer): Currently minted NFTs

### Statistics
- `viewCount` (Integer): Number of views
- `averageRating` (Float): Average rating from reviews
- `totalReviews` (Integer): Total number of reviews

### Status
- `status` (Enum): "draft", "published", "completed"

## Relationships
- **Author**: User who wrote the book
- **Chapters**: Book chapters
- **Genres**: Book genres
- **Reviews**: User reviews
- **NFT Ownerships**: NFT ownership records
- **Purchases**: Purchase records
- **Book Accesses**: Access control records
- **AI Interactions**: AI assistance records
- **Book Index**: AI-generated book analysis

## Swagger Documentation

The complete API documentation is available through Swagger UI at:
```
http://localhost:3001/api-docs
```

### Features of the Documentation
- **Interactive Testing**: Test endpoints directly from the browser
- **Request/Response Examples**: See example data for all endpoints
- **Schema Validation**: Understand required and optional fields
- **Error Responses**: See all possible error scenarios
- **Authentication**: JWT Bearer token support

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Swagger dependencies:
```bash
npm install swagger-jsdoc swagger-ui-express
```

3. Start the server:
```bash
npm run dev
```

4. Access the documentation:
```
http://localhost:3001/api-docs
```

## Usage Examples

### Create a Book
```bash
curl -X POST http://localhost:3001/api-v1/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Adventure",
    "description": "An epic tale of adventure and discovery...",
    "authorId": "123e4567-e89b-12d3-a456-426614174001",
    "isFree": true,
    "status": "draft"
  }'
```

### Get All Books
```bash
curl -X GET http://localhost:3001/api-v1/books
```

### Search Books
```bash
curl -X GET "http://localhost:3001/api-v1/books/buscar?searchTerm=adventure"
```

### Get Book Statistics
```bash
curl -X GET http://localhost:3001/api-v1/books/estadisticas/123e4567-e89b-12d3-a456-426614174000
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

Error responses include detailed messages and validation errors when applicable.

## Validation

All endpoints use Zod schemas for validation:
- Required fields are enforced
- Data types are validated
- String lengths are checked
- UUID formats are validated
- Enum values are restricted

## Security

- JWT Bearer token authentication is supported
- Input validation prevents malicious data
- SQL injection is prevented through Prisma ORM
- CORS is configured for cross-origin requests 