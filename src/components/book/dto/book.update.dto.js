import { z } from "zod";

export const actualizarLibroSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
  title: z.string().min(1, "El título es requerido").optional(),
  description: z.string().min(10, "La descripción debe tener mínimo 10 caracteres").optional(),
  cover: z.string().url("La URL de la portada debe ser válida").optional(),
  isFree: z.boolean().optional(),
  isComplete: z.boolean().optional(),
  totalChapters: z.number().int().min(0, "El número de capítulos debe ser mayor o igual a 0").optional(),
  isNFT: z.boolean().optional(),
  nftPrice: z.number().min(0, "El precio NFT debe ser mayor o igual a 0").optional(),
  maxSupply: z.number().int().min(1, "El suministro máximo debe ser mayor a 0").optional(),
  status: z.enum(["draft", "published", "completed"]).optional()
}); 