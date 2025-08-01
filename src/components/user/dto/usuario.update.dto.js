import { z } from "zod";

export const actualizarUsuarioSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  email: z.string().email("Correo no válido").optional(),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres").optional(),
  image: z.string().optional(),
  isPremium: z.boolean().optional()
});
