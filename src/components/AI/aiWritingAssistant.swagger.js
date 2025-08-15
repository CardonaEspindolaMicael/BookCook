/**
 * @swagger
 * components:
 *   schemas:
 *     AIInteraction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         bookId:
 *           type: string
 *           format: uuid
 *         chapterId:
 *           type: string
 *           format: uuid
 *         aiAssistantId:
 *           type: string
 *           format: uuid
 *         interactionTypeId:
 *           type: string
 *           format: uuid
 *         userQuery:
 *           type: string
 *         contextData:
 *           type: string
 *         aiResponse:
 *           type: string
 *         tokenUsed:
 *           type: integer
 *         processingTime:
 *           type: integer
 *         satisfaction:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         wasUseful:
 *           type: boolean
 *         timestamp:
 *           type: string
 *           format: date-time
 *         interactionType:
 *           $ref: '#/components/schemas/InteractionType'
 *         aiAssistant:
 *           $ref: '#/components/schemas/AIAssistant'
 *         user:
 *           $ref: '#/components/schemas/User'
 *     
 *     InteractionType:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "brainstorm"
 *         description:
 *           type: string
 *           example: "Help find inspiration for your story"
 *         category:
 *           type: string
 *           example: "writing"
 *         systemPrompt:
 *           type: string
 *         userPrompt:
 *           type: string
 *         costPerUse:
 *           type: number
 *           example: 10
 *         isActive:
 *           type: boolean
 *     
 *     AIAssistant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "GPT-4"
 *         provider:
 *           type: string
 *           example: "openai"
 *         model:
 *           type: string
 *           example: "gpt-4"
 *         isActive:
 *           type: boolean
 *     
 *     AIUsage:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         month:
 *           type: string
 *           example: "2024-01"
 *         totalInteractions:
 *           type: integer
 *         tokensUsed:
 *           type: integer
 *         creditsUsed:
 *           type: number
 *         monthlyLimit:
 *           type: integer
 *         remainingCredits:
 *           type: number
 *         resetAt:
 *           type: string
 *           format: date-time
 *     
 *     AIWritingOptions:
 *       type: object
 *       properties:
 *         hasCredits:
 *           type: boolean
 *         remainingCredits:
 *           type: number
 *         interactionTypes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InteractionType'
 *         bookId:
 *           type: string
 *           format: uuid
 *         chapterId:
 *           type: string
 *           format: uuid
 *     
 *     AIHelpRequest:
 *       type: object
 *       required:
 *         - interactionTypeId
 *         - userQuery
 *       properties:
 *         interactionTypeId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         bookId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         chapterId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174002"
 *         userQuery:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           example: "Help me brainstorm ideas for a fantasy novel about a young wizard"
 *         contextData:
 *           type: string
 *           example: "The story is set in a magical academy..."
 *     
 *     AIHelpResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Respuesta de AI generada exitosamente"
 *         interaction:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             aiResponse:
 *               type: string
 *               example: "Here are some fantasy novel ideas for your wizard story..."
 *             tokenUsed:
 *               type: integer
 *               example: 150
 *             remainingCredits:
 *               type: number
 *               example: 90
 *     
 *     AIRatingRequest:
 *       type: object
 *       required:
 *         - interactionId
 *         - satisfaction
 *       properties:
 *         interactionId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         satisfaction:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         wasUseful:
 *           type: boolean
 *           example: true
 *     
 *     AISuggestionRequest:
 *       type: object
 *       required:
 *         - interactionId
 *         - appliedContent
 *       properties:
 *         interactionId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         appliedContent:
 *           type: object
 *           properties:
 *             bookContent:
 *               type: string
 *               example: "Updated book content with AI suggestions..."
 *             chapterContent:
 *               type: string
 *               example: "Updated chapter content with AI suggestions..."
 *         bookId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         chapterId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174002"
 *     
 *     AIUsageResponse:
 *       type: object
 *       properties:
 *         currentUsage:
 *           type: integer
 *           example: 15
 *         monthlyLimit:
 *           type: integer
 *           example: 100
 *         remainingCredits:
 *           type: number
 *           example: 85
 *         hasCredits:
 *           type: boolean
 *           example: true
 *         resetDate:
 *           type: string
 *           format: date-time
 *           example: "2024-02-01T00:00:00.000Z"
 *     
 *     AIError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Límite mensual de AI alcanzado"
 *         upgradeRequired:
 *           type: boolean
 *           example: true
 *         currentUsage:
 *           type: integer
 *           example: 100
 *         monthlyLimit:
 *           type: integer
 *           example: 100
 *     
 *     InsufficientCreditsError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Créditos insuficientes para esta interacción"
 *         requiredCredits:
 *           type: number
 *           example: 20
 *         availableCredits:
 *           type: number
 *           example: 10
 * 
 * tags:
 *   - name: AI Writing Assistant
 *     description: AI-powered writing assistance for authors
 */

/**
 * @swagger
 * /api-v1/ai-writing/options:
 *   get:
 *     summary: Get AI writing options and check credits
 *     description: Check user's AI usage limits and get available interaction types
 *     tags: [AI Writing Assistant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookId
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Book ID for context
 *         example: "123e4567-e89b-12d3-a456-426614174001"
 *       - name: chapterId
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Chapter ID for context
 *         example: "123e4567-e89b-12d3-a456-426614174002"
 *     responses:
 *       200:
 *         description: AI writing options retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIWritingOptions'
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no autenticado"
 *       402:
 *         description: Monthly AI limit reached
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * 
 * /api-v1/ai-writing/help:
 *   post:
 *     summary: Request AI help
 *     description: Send a request to the AI writing assistant
 *     tags: [AI Writing Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AIHelpRequest'
 *           example:
 *             interactionTypeId: "123e4567-e89b-12d3-a456-426614174000"
 *             bookId: "123e4567-e89b-12d3-a456-426614174001"
 *             chapterId: "123e4567-e89b-12d3-a456-426614174002"
 *             userQuery: "Help me brainstorm ideas for a fantasy novel about a young wizard"
 *             contextData: "The story is set in a magical academy where students learn to control their powers."
 *     responses:
 *       200:
 *         description: AI help generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIHelpResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos inválidos"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no autenticado"
 *       402:
 *         description: Insufficient credits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InsufficientCreditsError'
 *       404:
 *         description: Interaction type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tipo de interacción no encontrado"
 *       500:
 *         description: AI service error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servicio de AI"
 *                 error:
 *                   type: string
 * 
 * /api-v1/ai-writing/rate:
 *   post:
 *     summary: Rate AI response
 *     description: Rate the quality and usefulness of an AI response
 *     tags: [AI Writing Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AIRatingRequest'
 *           example:
 *             interactionId: "123e4567-e89b-12d3-a456-426614174000"
 *             satisfaction: 5
 *             wasUseful: true
 *     responses:
 *       200:
 *         description: Rating recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Calificación registrada exitosamente"
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no autenticado"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * 
 * /api-v1/ai-writing/apply:
 *   post:
 *     summary: Apply AI suggestion
 *     description: Apply AI suggestions to book or chapter content
 *     tags: [AI Writing Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AISuggestionRequest'
 *           example:
 *             interactionId: "123e4567-e89b-12d3-a456-426614174000"
 *             appliedContent:
 *               bookContent: "Updated book content with AI suggestions..."
 *               chapterContent: "Updated chapter content with AI suggestions..."
 *             bookId: "123e4567-e89b-12d3-a456-426614174001"
 *             chapterId: "123e4567-e89b-12d3-a456-426614174002"
 *     responses:
 *       200:
 *         description: AI suggestion applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sugerencia de AI aplicada exitosamente"
 *                 contentUpdated:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no autenticado"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * 
 * /api-v1/ai-writing/usage:
 *   get:
 *     summary: Get AI usage statistics
 *     description: Get current AI usage and limits for the authenticated user
 *     tags: [AI Writing Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI usage statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIUsageResponse'
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no autenticado"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */ 