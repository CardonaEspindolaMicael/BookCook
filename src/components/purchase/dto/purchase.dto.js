import { z } from "zod";

export const crearPurchaseSchema = z.object({
  buyerId: z.string().uuid("El ID del comprador debe ser un UUID válido").optional(),
  bookId: z.string().uuid("El ID del libro debe ser un UUID válido"),
  walletAddress: z.string().optional(),
  amount: z.number().min(0, "El monto debe ser mayor o igual a 0"),
  currency: z.string().optional().default("ETH"),
  status: z.enum(["pending", "completed", "failed", "refunded"], {
    errorMap: () => ({ message: "El estado debe ser 'pending', 'completed', 'failed' o 'refunded'" })
  }).optional().default("completed")
}); 