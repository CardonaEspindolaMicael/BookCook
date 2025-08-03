# Genre Component

This component handles all operations related to book genres in the NFT Book Platform.

## Features

- **CRUD Operations**: Create, Read, Update, Delete genres
- **Search**: Find genres by name
- **Active Genres**: Get only active genres
- **Book Relationships**: Get genres with their associated books
- **Statistics**: Get book counts and statistics per genre
- **Validation**: Zod schema validation for all inputs

## API Endpoints

### Get All Genres
```
GET /genre
```
Returns all genres ordered alphabetically.

### Get Active Genres
```
GET /genre/activos
```
Returns only active genres.

### Search Genres by Name
```
GET /genre/buscar/:nombre
```
Returns genres that match the search term (case-insensitive).

### Get Genres with Books
```
GET /genre/con-libros
```
Returns genres with their associated books and book details.

### Get Book Count by Genre
```
GET /genre/:generoId/libros/count
```
Returns the total number of books in a specific genre.

### Get Genre by ID
```
GET /genre/:id
```
Returns a specific genre by its ID.

### Create New Genre
```
POST /genre
```
Body:
```json
{
  "name": "Fantasy",
  "description": "Fantasy literature with magical elements",
  "isActive": true
}
```

### Update Genre
```
PUT /genre/:id
```
Body:
```json
{
  "name": "Fantasy Updated",
  "description": "Updated description",
  "isActive": false
}
```

### Delete Genre
```
DELETE /genre/:id
```
Deletes a genre (only if no books are associated).

## Data Models

### Genre Model
```javascript
{
  id: "uuid",
  name: "string (unique)",
  description: "string (optional)",
  isActive: "boolean (default: true)"
}
```

### BookGenre Relationship
```javascript
{
  id: "uuid",
  bookId: "uuid",
  genreId: "uuid"
}
```

## Validation Rules

- **Name**: Required, 1-100 characters, unique
- **Description**: Optional, max 500 characters
- **isActive**: Optional boolean, defaults to true
- **ID**: Must be valid UUID format

## Error Handling

- **400**: Invalid input data
- **404**: Genre not found
- **409**: Duplicate name or cannot delete (has books)
- **500**: Internal server error

## Usage Examples

### Create a new genre
```javascript
const newGenre = {
  name: "Science Fiction",
  description: "Futuristic and technological stories",
  isActive: true
};

const response = await fetch('/genre', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newGenre)
});
```

### Get genres with statistics
```javascript
const response = await fetch('/genre/con-libros');
const genres = await response.json();
```

### Search for genres
```javascript
const response = await fetch('/genre/buscar/fantasy');
const matchingGenres = await response.json();
```

## Database Schema

The Genre component works with the following Prisma models:

```prisma
model Genre {
  id          String @id @default(uuid())
  name        String @unique @db.VarChar(100)
  description String?
  isActive    Boolean @default(true)
  
  books BookGenre[]
  
  @@map("genres")
}

model BookGenre {
  id      String @id @default(uuid())
  bookId  String
  genreId String
  
  book  Book  @relation(fields: [bookId], references: [id], onDelete: Cascade)
  genre Genre @relation(fields: [genreId], references: [id], onDelete: Cascade)
  
  @@unique([bookId, genreId])
  @@map("book_genres")
}
``` 