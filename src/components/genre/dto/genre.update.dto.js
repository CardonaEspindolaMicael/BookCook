import { z } from "zod";

export const actualizarGeneroSchema = z.object({
  id: z.string()
    .uuid("El ID del género debe ser un UUID válido"),
  name: z.string()
    .min(1, "El nombre del género es requerido")
    .max(100, "El nombre del género no puede exceder 100 caracteres")
    .trim()
    .optional(),
  description: z.string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  isActive: z.boolean()
    .optional()
}); 