import { z } from "zod";

export const actualizarReviewSchema = z.object({
  id: z.string().uuid("El ID de la review debe ser un UUID válido"),
  rating: z.number().int().min(1, "El rating debe ser entre 1 y 5").max(5, "El rating debe ser entre 1 y 5").optional(),
  title: z.string().min(1, "El título es requerido").max(200, "El título no puede exceder 200 caracteres").optional(),
  content: z.string().max(1000, "El contenido no puede exceder 1000 caracteres").optional(),
  isVerifiedOwner: z.boolean().optional()
}); 