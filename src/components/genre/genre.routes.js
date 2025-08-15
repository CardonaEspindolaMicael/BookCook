import express from "express";
import {
  getGeneros,
  getGeneroPorId,
  postGenero,
  putGenero,
  deleteGenero,
  getGenerosActivos,
  getGenerosPorNombre,
  getGenerosConLibros,
  getContarLibrosPorGenero
} from "./genre.controllers.js";

const router = express.Router();

// Get all genres
router.get("/", getGeneros);

// Get active genres only
router.get("/activos", getGenerosActivos);

// Search genres by name
router.get("/buscar/:nombre", getGenerosPorNombre);

// Get genres with their books
router.get("/con-libros", getGenerosConLibros);

// Get book count by genre
router.get("/:generoId/libros/count", getContarLibrosPorGenero);

// Get genre by ID
router.get("/:id", getGeneroPorId);

// Create new genre
router.post("/", postGenero);

// Update genre
router.put("/:id", putGenero);

// Delete genre
router.delete("/:id", deleteGenero);

export default router; 