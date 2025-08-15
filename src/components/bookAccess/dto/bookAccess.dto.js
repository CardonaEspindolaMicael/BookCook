import { z } from "zod";

export const crearAccesoLibroSchema = z.object({
  bookId: z.string().uuid("El ID del libro debe ser un UUID válido"),
  userId: z.string().uuid("El ID del usuario debe ser un UUID válido").optional(),
  walletAddress: z.string().optional(),
  accessType: z.enum(["free", "nft_owner", "purchased"], {
    errorMap: () => ({ message: "El tipo de acceso debe ser 'free', 'nft_owner' o 'purchased'" })
  }),
  expiresAt: z.string().datetime("La fecha de expiración debe ser una fecha válida").optional()
}); 