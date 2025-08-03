import { z } from "zod";

export const crearIndiceCapituloSchema = z.object({
  chapterId: z.string().uuid("El ID del capítulo debe ser un UUID válido"),
  bookId: z.string().uuid("El ID del libro debe ser un UUID válido"),
  content: z.string().min(1, "El contenido es requerido"),
  summary: z.string().optional(),
  keyEvents: z.string().optional(), // JSON string
  characters: z.string().optional(), // JSON string
  mood: z.string().optional(),
  cliffhanger: z.boolean().optional().default(false),
  wordCount: z.number().int().min(0, "El conteo de palabras debe ser mayor o igual a 0").optional().default(0)
}); 