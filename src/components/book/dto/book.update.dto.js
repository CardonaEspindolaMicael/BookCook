import { z } from "zod";

export const actualizarLibroSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
  title: z.string().min(1, "El título es requerido").optional(),
  description: z.string().min(10, "La descripción debe tener mínimo 10 caracteres").optional(),
  cover: z.string().url("La URL de la portada debe ser válida").optional(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0").optional(),
  status: z.enum(["draft", "published", "archived"]).optional()
}); 