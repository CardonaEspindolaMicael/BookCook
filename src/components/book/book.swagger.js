/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - authorId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the book
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         title:
 *           type: string
 *           maxLength: 200
 *           description: Title of the book
 *           example: "The Great Adventure"
 *         description:
 *           type: string
 *           description: Detailed description of the book
 *           example: "An epic tale of adventure and discovery..."
 *         cover:
 *           type: string
 *           format: uri
 *           description: URL to the book cover image
 *           example: "https://example.com/cover.jpg"
 *         authorId:
 *           type: string
 *           format: uuid
 *           description: ID of the book author
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         isFree:
 *           type: boolean
 *           default: true
 *           description: Whether the book is free to read
 *         isComplete:
 *           type: boolean
 *           default: false
 *           description: Whether the book is completed
 *         totalChapters:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           description: Total number of chapters planned
 *         isNFT:
 *           type: boolean
 *           default: false
 *           description: Whether the book has been minted as NFT
 *         nftPrice:
 *           type: number
 *           minimum: 0
 *           description: Price in ETH/MATIC when minting as NFT
 *           example: 0.1
 *         maxSupply:
 *           type: integer
 *           minimum: 1
 *           description: Maximum NFT copies for limited editions
 *           example: 100
 *         currentSupply:
 *           type: integer
 *           default: 0
 *           description: Currently minted NFTs
 *         viewCount:
 *           type: integer
 *           default: 0
 *           description: Number of views
 *         averageRating:
 *           type: number
 *           default: 0
 *           description: Average rating from reviews
 *         totalReviews:
 *           type: integer
 *           default: 0
 *           description: Total number of reviews
 *         status:
 *           type: string
 *           enum: [draft, published, completed]
 *           default: draft
 *           description: Current status of the book
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         author:
 *           $ref: '#/components/schemas/User'
 *         chapters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Chapter'
 *         genres:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BookGenre'
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         nftOwnerships:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NFTOwnership'
 *         purchases:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Purchase'
 *         bookAccesses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BookAccess'
 *         aiInteractions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AIInteraction'
 *         bookIndex:
 *           $ref: '#/components/schemas/BookIndex'
 *     
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         image:
 *           type: string
 *         isPremium:
 *           type: boolean
 *     
 *     Chapter:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         orderIndex:
 *           type: integer
 *         isFree:
 *           type: boolean
 *         wordCount:
 *           type: integer
 *     
 *     BookGenre:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         genre:
 *           $ref: '#/components/schemas/Genre'
 *     
 *     Genre:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         isActive:
 *           type: boolean
 *     
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *     
 *     NFTOwnership:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tokenId:
 *           type: string
 *         contractAddress:
 *           type: string
 *         network:
 *           type: string
 *         currentOwner:
 *           type: string
 *         owner:
 *           $ref: '#/components/schemas/User'
 *     
 *     Purchase:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *         status:
 *           type: string
 *         buyer:
 *           $ref: '#/components/schemas/User'
 *     
 *     BookAccess:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         accessType:
 *           type: string
 *           enum: [free, nft_owner, purchased]
 *         user:
 *           $ref: '#/components/schemas/User'
 *     
 *     AIInteraction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userQuery:
 *           type: string
 *         aiResponse:
 *           type: string
 *         interactionType:
 *           type: object
 *         aiAssistant:
 *           type: object
 *     
 *     BookIndex:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         fullText:
 *           type: string
 *         summary:
 *           type: string
 *         wordCount:
 *           type: integer
 *     
 *     BookCreate:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - authorId
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           example: "The Great Adventure"
 *         description:
 *           type: string
 *           minLength: 10
 *           example: "An epic tale of adventure and discovery..."
 *         cover:
 *           type: string
 *           format: uri
 *           example: "https://example.com/cover.jpg"
 *         authorId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         isFree:
 *           type: boolean
 *           default: true
 *         isComplete:
 *           type: boolean
 *           default: false
 *         totalChapters:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         isNFT:
 *           type: boolean
 *           default: false
 *         nftPrice:
 *           type: number
 *           minimum: 0
 *         maxSupply:
 *           type: integer
 *           minimum: 1
 *         status:
 *           type: string
 *           enum: [draft, published, completed]
 *           default: draft
 *     
 *     BookUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           required: true
 *         title:
 *           type: string
 *           minLength: 1
 *         description:
 *           type: string
 *           minLength: 10
 *         cover:
 *           type: string
 *           format: uri
 *         isFree:
 *           type: boolean
 *         isComplete:
 *           type: boolean
 *         totalChapters:
 *           type: integer
 *           minimum: 0
 *         isNFT:
 *           type: boolean
 *         nftPrice:
 *           type: number
 *           minimum: 0
 *         maxSupply:
 *           type: integer
 *           minimum: 1
 *         status:
 *           type: string
 *           enum: [draft, published, completed]
 *     
 *     BookStatistics:
 *       type: object
 *       properties:
 *         purchases:
 *           type: integer
 *           description: Number of purchases
 *         reviews:
 *           type: integer
 *           description: Number of reviews
 *         nftOwnerships:
 *           type: integer
 *           description: Number of NFT ownerships
 *         bookAccesses:
 *           type: integer
 *           description: Number of book accesses
 *         totalRevenue:
 *           type: number
 *           description: Total revenue from purchases
 *         averageRating:
 *           type: number
 *           description: Average rating from reviews
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *     
 *     ValidationError:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 *           example: false
 *         errores:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               message:
 *                 type: string
 *               path:
 *                 type: array
 *                 items:
 *                   type: string
 *     
 *     SuccessMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *     
 *   parameters:
 *     bookId:
 *       name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: Book ID
 *       example: "123e4567-e89b-12d3-a456-426614174000"
 *     
 *     authorId:
 *       name: authorId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: Author ID
 *       example: "123e4567-e89b-12d3-a456-426614174001"
 *     
 *     bookStatus:
 *       name: status
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *         enum: [draft, published, completed]
 *       description: Book status
 *       example: "published"
 *     
 *     searchTerm:
 *       name: searchTerm
 *       in: query
 *       required: true
 *       schema:
 *         type: string
 *       description: Search term for books
 *       example: "adventure"
 *     
 *     bookIdParam:
 *       name: bookId
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: Book ID for statistics
 *       example: "123e4567-e89b-12d3-a456-426614174000"
 * 
 * tags:
 *   - name: Books
 *     description: Book management operations
 */

/**
 * @swagger
 * /api-v1/books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve a list of all books with their relationships
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   
 *   post:
 *     summary: Create a new book
 *     description: Create a new book with the provided data
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookCreate'
 *           example:
 *             title: "The Great Adventure"
 *             description: "An epic tale of adventure and discovery in a magical world."
 *             cover: "https://example.com/cover.jpg"
 *             authorId: "123e4567-e89b-12d3-a456-426614174001"
 *             isFree: true
 *             isComplete: false
 *             totalChapters: 20
 *             isNFT: false
 *             nftPrice: 0.1
 *             maxSupply: 100
 *             status: "draft"
 *     responses:
 *       200:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessMessage'
 *                 - $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   
 *   put:
 *     summary: Update a book
 *     description: Update an existing book with the provided data
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdate'
 *           example:
 *             id: "123e4567-e89b-12d3-a456-426614174000"
 *             title: "The Great Adventure - Updated"
 *             description: "An updated epic tale of adventure and discovery."
 *             status: "published"
 *             isFree: false
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessMessage'
 *                 - $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api-v1/books/nft:
 *   get:
 *     summary: Get NFT books
 *     description: Retrieve all books that have been minted as NFTs
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: NFT books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api-v1/books/gratuitos:
 *   get:
 *     summary: Get free books
 *     description: Retrieve all books that are free to read
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Free books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api-v1/books/buscar:
 *   get:
 *     summary: Search books
 *     description: Search books by title or description
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/searchTerm'
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Search term required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Término de búsqueda requerido"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api-v1/books/estado/{status}:
 *   get:
 *     summary: Get books by status
 *     description: Retrieve books filtered by their status
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/bookStatus'
 *     responses:
 *       200:
 *         description: Books by status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api-v1/books/autor/{authorId}:
 *   get:
 *     summary: Get books by author
 *     description: Retrieve all books written by a specific author
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/authorId'
 *     responses:
 *       200:
 *         description: Author's books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api-v1/books/estadisticas/{bookId}:
 *   get:
 *     summary: Get book statistics
 *     description: Retrieve comprehensive statistics for a specific book
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/bookIdParam'
 *     responses:
 *       200:
 *         description: Book statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookStatistics'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api-v1/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     description: Retrieve a specific book by its ID with all relationships
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/bookId'
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Libro no encontrado"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   
 *   delete:
 *     summary: Delete a book
 *     description: Delete a specific book by its ID
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/bookId'
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /api-v1/books/{bookId}/vista:
 *   patch:
 *     summary: Increment book view count
 *     description: Increment the view count for a specific book
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/bookIdParam'
 *     responses:
 *       200:
 *         description: View count incremented successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessMessage'
 *                 - $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */ 