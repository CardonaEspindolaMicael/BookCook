import { z } from "zod";

export const actualizarPurchaseSchema = z.object({
  id: z.string().uuid("El ID de la compra debe ser un UUID válido"),
  amount: z.number().min(0, "El monto debe ser mayor o igual a 0").optional(),
  currency: z.string().optional(),
  status: z.enum(["pending", "completed", "failed", "refunded"], {
    errorMap: () => ({ message: "El estado debe ser 'pending', 'completed', 'failed' o 'refunded'" })
  }).optional()
}); 