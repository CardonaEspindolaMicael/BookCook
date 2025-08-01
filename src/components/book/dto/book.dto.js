import { z } from "zod";

export const crearLibroSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(10, "La descripción debe tener mínimo 10 caracteres"),
  cover: z.string().url("La URL de la portada debe ser válida").optional(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  status: z.enum(["draft", "published", "archived"]).optional().default("draft"),
  authorId: z.string().uuid("El ID del autor debe ser un UUID válido")
}); 