import express from "express";
import {
  getLibros,
  getLibroPorId,
  postLibro,
  putLibro,
  deleteLibro,
  getLibrosPorAutor,
  buscarLibrosPorTermino,
  getLibrosPorEstado,
  getEstadisticasLibro,
  getLibrosNFT,
  getLibrosGratuitos,
  incrementarVistaLibro
} from "./book.controllers.js";

const router = express.Router();

router.get("/", getLibros);
router.get("/nft", getLibrosNFT);
router.get("/gratuitos", getLibrosGratuitos);
router.get("/buscar", buscarLibrosPorTermino);
router.get("/estado/:status", getLibrosPorEstado);
router.get("/autor/:authorId", getLibrosPorAutor);
router.get("/estadisticas/:bookId", getEstadisticasLibro);
router.get("/:id", getLibroPorId);
router.post("/", postLibro);
router.put("/", putLibro);
router.delete("/:id", deleteLibro);
router.patch("/:bookId/vista", incrementarVistaLibro);

export default router; 