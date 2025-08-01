import {Router} from "express"
import { 
  getLibros,
  getLibroPorId,
  postLibro,
  putLibro,
  deleteLibro,
  getLibrosPorAutor,
  buscarLibrosPorTermino,
  getLibrosPorEstado,
  getEstadisticasLibro
} from "./book.controllers.js";
const routerBook = Router();
import { checkAuth } from "../../middlewares/auth.js";
import { authRole } from "../../middlewares/auth_role.js";

// Basic book routes
routerBook.get('/', getLibros);
routerBook.get('/:id', getLibroPorId);
routerBook.post('/', checkAuth, postLibro);
routerBook.put('/', checkAuth, putLibro);
routerBook.delete('/:id', checkAuth, deleteLibro);

// Advanced book routes
routerBook.get('/autor/:authorId', getLibrosPorAutor);
routerBook.get('/buscar', buscarLibrosPorTermino);
routerBook.get('/estado/:status', getLibrosPorEstado);
routerBook.get('/:bookId/estadisticas', checkAuth, getEstadisticasLibro);

export default routerBook; 