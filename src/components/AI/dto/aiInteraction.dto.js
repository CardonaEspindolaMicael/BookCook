import { z } from "zod";

export const aiInteractionSchema = z.object({
  interactionTypeId: z.string().uuid("El ID del tipo de interacción debe ser un UUID válido"),
  bookId: z.string().uuid("El ID del libro debe ser un UUID válido").optional(),
  chapterId: z.string().uuid("El ID del capítulo debe ser un UUID válido").optional(),
  userQuery: z.string().min(1, "La consulta del usuario es requerida").max(2000, "La consulta no puede exceder 2000 caracteres"),
  contextData: z.string().optional()
});

export const aiRatingSchema = z.object({
  interactionId: z.string().uuid("El ID de la interacción debe ser un UUID válido"),
  satisfaction: z.number().int().min(1).max(5, "La satisfacción debe estar entre 1 y 5"),
  wasUseful: z.boolean().optional()
});

export const aiSuggestionSchema = z.object({
  interactionId: z.string().uuid("El ID de la interacción debe ser un UUID válido"),
  appliedContent: z.object({
    bookContent: z.string().optional(),
    chapterContent: z.string().optional()
  }),
  bookId: z.string().uuid("El ID del libro debe ser un UUID válido").optional(),
  chapterId: z.string().uuid("El ID del capítulo debe ser un UUID válido").optional()
}); 