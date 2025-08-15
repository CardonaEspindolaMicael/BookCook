import { z } from "zod";

export const actualizarIndiceCapituloSchema = z.object({
  id: z.string().uuid("El ID del índice debe ser un UUID válido"),
  content: z.string().min(1, "El contenido es requerido").optional(),
  summary: z.string().optional(),
  keyEvents: z.string().optional(), // JSON string
  characters: z.string().optional(), // JSON string
  mood: z.string().optional(),
  cliffhanger: z.boolean().optional(),
  wordCount: z.number().int().min(0, "El conteo de palabras debe ser mayor o igual a 0").optional(),
  lastAnalyzed: z.string().datetime("La fecha de análisis debe ser una fecha válida").optional()
}); 