import express from "express";
import {
  getIndicesCapitulo,
  getIndicePorId,
  getIndicePorCapitulo,
  postIndiceCapitulo,
  putIndiceCapitulo,
  deleteIndiceCapitulo,
  putAnalisisCapitulo,
  getCapitulosPorEvento,
  getCapitulosPorPersonaje,
  getCapitulosPorEstadoAnimo
} from "./chapterIndex.controllers.js";

const router = express.Router();

router.get("/", getIndicesCapitulo);
router.get("/capitulo/:chapterId", getIndicePorCapitulo);
router.get("/evento/:evento", getCapitulosPorEvento);
router.get("/personaje/:personaje", getCapitulosPorPersonaje);
router.get("/estado-animo/:estadoAnimo", getCapitulosPorEstadoAnimo);
router.get("/:id", getIndicePorId);
router.post("/", postIndiceCapitulo);
router.put("/", putIndiceCapitulo);
router.delete("/:id", deleteIndiceCapitulo);
router.patch("/:chapterId/analisis", putAnalisisCapitulo);

export default router; 