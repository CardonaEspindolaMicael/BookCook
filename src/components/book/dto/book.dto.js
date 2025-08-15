import { z } from "zod";

export const crearLibroSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(10, "La descripción debe tener mínimo 10 caracteres"),
  cover: z.string().url("La URL de la portada debe ser válida").default('https://www.globaluniversityalliance.org/wp-content/uploads/2017/10/No-Cover-Image-01.png'),
  authorId: z.string().uuid("El ID del autor debe ser un UUID válido"),
  isFree: z.boolean().optional().default(true),
  isComplete: z.boolean().optional().default(false),
  totalChapters: z.number().int().min(0, "El número de capítulos debe ser mayor o igual a 0").optional().default(0),
  isNFT: z.boolean().optional().default(false),
  nftPrice: z.number().min(0, "El precio NFT debe ser mayor o igual a 0").optional(),
  maxSupply: z.number().int().min(1, "El suministro máximo debe ser mayor a 0").optional(),
  status: z.enum(["draft", "published", "completed"]).optional().default("draft")
}); 