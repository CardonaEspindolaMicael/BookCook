import express from "express";
import {
  getUsuarios,
  getUsuariosById,
  getUsuariosByEmail,
  postUsuario,
  actualizarUsuario,
  eliminarUsuario,
  patchContrasena,
  renovarToken,
  asignarRol,
  removerRol,
  getUsuariosPremium,
  getEstadisticasUsuario
} from "./user.controllers.js";

const router = express.Router();

router.get("/", getUsuarios);
router.get("/premium", getUsuariosPremium);
router.get("/email/:email", getUsuariosByEmail);
router.get("/estadisticas/:userId", getEstadisticasUsuario);
router.get("/:id", getUsuariosById);
router.post("/", postUsuario);
router.put("/", actualizarUsuario);
router.patch("/contrasena", patchContrasena);
router.patch("/token", renovarToken);
router.post("/asignar-rol", asignarRol);
router.delete("/remover-rol", removerRol);
router.delete("/:id", eliminarUsuario);

export default router; 