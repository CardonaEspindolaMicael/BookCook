import { z } from "zod";

export const actualizarCapituloSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
  title: z.string().min(1, "El título es requerido").optional(),
  content: z.string().min(10, "El contenido debe tener mínimo 10 caracteres").optional(),
  orderIndex: z.number().int().min(1, "El índice de orden debe ser mayor a 0").optional(),
  isFree: z.boolean().optional(),
  wordCount: z.number().int().min(0, "El contador de palabras debe ser mayor o igual a 0").optional()
});  