import { z } from "zod";

export const actualizarAccesoLibroSchema = z.object({
  id: z.string().uuid("El ID del acceso debe ser un UUID válido"),
  accessType: z.enum(["free", "nft_owner", "purchased"], {
    errorMap: () => ({ message: "El tipo de acceso debe ser 'free', 'nft_owner' o 'purchased'" })
  }).optional(),
  expiresAt: z.string().datetime("La fecha de expiración debe ser una fecha válida").optional()
}); 