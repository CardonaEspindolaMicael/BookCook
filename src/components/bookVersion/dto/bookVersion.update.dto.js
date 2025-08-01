import { z } from "zod";

export const actualizarVersionLibroSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
  versionHash: z.string().min(1, "El hash de la versión es requerido").optional(),
  changes: z.string().min(1, "Los cambios son requeridos").optional()
}); 