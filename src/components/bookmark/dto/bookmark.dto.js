import { z } from "zod";

export const crearBookmarkSchema = z.object({
  userId: z.string().uuid("El ID del usuario debe ser un UUID válido"),
  bookId: z.string().uuid("El ID del libro debe ser un UUID válido")
}); 