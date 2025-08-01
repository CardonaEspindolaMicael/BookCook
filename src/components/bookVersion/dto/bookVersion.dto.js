import { z } from "zod";

export const crearVersionLibroSchema = z.object({
  bookId: z.string().uuid("El ID del libro debe ser un UUID válido"),
  versionHash: z.string().min(1, "El hash de la versión es requerido"),
  changes: z.string().min(1, "Los cambios son requeridos")
}); 