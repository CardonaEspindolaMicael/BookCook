import express from 'express';
import {
  getBookGenres,
  getBookGenreById,
  getGenresByBook,
  getBooksByGenre,
  createBookGenre,
  createBookGenres,
  updateBookGenre,
  deleteBookGenre,
  deleteBookGenresByBook,
  updateBookGenres
} from './bookGenre.controllers.js';

const router = express.Router();

// GET - Obtener todos los book genres
router.get('/', getBookGenres);

// GET - Obtener book genre por ID
router.get('/:id', getBookGenreById);

// GET - Obtener géneros por libro
router.get('/book/:bookId', getGenresByBook);

// GET - Obtener libros por género
router.get('/genre/:genreId', getBooksByGenre);

// POST - Crear un book genre
router.post('/', createBookGenre);

// POST - Crear múltiples book genres
router.post('/multiple', createBookGenres);

// PUT - Actualizar book genre
router.put('/:id', updateBookGenre);

// PUT - Actualizar géneros de un libro
router.put('/book/:bookId', updateBookGenres);

// DELETE - Eliminar book genre
router.delete('/:id', deleteBookGenre);

// DELETE - Eliminar todos los book genres de un libro
router.delete('/book/:bookId', deleteBookGenresByBook);

export default router; 