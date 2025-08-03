import express from "express";
import {
  getIndicesLibro,
  getIndicePorId,
  getIndicePorLibro,
  postIndiceLibro,
  putIndiceLibro,
  deleteIndiceLibro,
  putAnalisisLibro,
  getLibrosPorTema,
  getLibrosPorGenero,
  getLibrosPorTono
} from "./bookIndex.controllers.js";

const router = express.Router();

router.get("/", getIndicesLibro);
router.get("/libro/:bookId", getIndicePorLibro);
router.get("/tema/:tema", getLibrosPorTema);
router.get("/genero/:genero", getLibrosPorGenero);
router.get("/tono/:tono", getLibrosPorTono);
router.get("/:id", getIndicePorId);
router.post("/", postIndiceLibro);
router.put("/", putIndiceLibro);
router.delete("/:id", deleteIndiceLibro);
router.patch("/:bookId/analisis", putAnalisisLibro);

export default router; 