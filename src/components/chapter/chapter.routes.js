import express from "express";
import {
  getCapitulos,
  getCapituloPorId,
  postCapitulo,
  putCapitulo,
  deleteCapitulo,
  getCapitulosPorLibro,
  getCapituloPorOrden,
  putReordenarCapitulos,
  buscarCapitulosPorTermino,
  getCapitulosGratuitos,
  actualizarContadorPalabrasCapitulo
} from "./chapter.controllers.js";

const router = express.Router();

router.get("/", getCapitulos);
router.get("/gratuitos", getCapitulosGratuitos);
router.get("/buscar", buscarCapitulosPorTermino);
router.get("/libro/:bookId", getCapitulosPorLibro);
router.get("/libro/:bookId/orden/:orderIndex", getCapituloPorOrden);
router.get("/:id", getCapituloPorId);
router.post("/", postCapitulo);
router.put("/", putCapitulo);
router.put("/libro/:bookId/reordenar", putReordenarCapitulos);
router.patch("/:chapterId/palabras", actualizarContadorPalabrasCapitulo);
router.delete("/:id", deleteCapitulo);

export default router; 