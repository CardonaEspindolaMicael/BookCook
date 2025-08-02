import { z } from "zod";

export const crearCapituloSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  content: z.string().min(10, "El contenido debe tener mínimo 10 caracteres"),
  orderIndex: z.number().int().min(1, "El índice de orden debe ser mayor a 0"),
  bookId: z.string().uuid("El ID del libro debe ser un UUID válido"),
  isFree: z.boolean().optional().default(true),
  wordCount: z.number().int().min(0, "El contador de palabras debe ser mayor o igual a 0").optional().default(0)
}); 