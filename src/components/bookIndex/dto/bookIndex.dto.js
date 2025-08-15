import { z } from "zod";

export const crearIndiceLibroSchema = z.object({
  bookId: z.string().uuid("El ID del libro debe ser un UUID válido"),
  fullText: z.string().min(1, "El texto completo es requerido"),
  summary: z.string().optional(),
  themes: z.string().optional(), // JSON string
  characters: z.string().optional(), // JSON string
  plotPoints: z.string().optional(), // JSON string
  tone: z.string().optional(),
  genre: z.string().optional(),
  wordCount: z.number().int().min(0, "El conteo de palabras debe ser mayor o igual a 0").optional().default(0),
  analysisVersion: z.string().optional()
}); 