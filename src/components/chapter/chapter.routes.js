import {Router} from "express"
import { 
  getCapitulos,
  getCapituloPorId,
  postCapitulo,
  putCapitulo,
  deleteCapitulo,
  getCapitulosPorLibro,
  getCapituloPorOrden,
  putReordenarCapitulos,
  buscarCapitulosPorTermino
} from "./chapter.controllers.js";
const routerChapter = Router();
import { checkAuth } from "../../middlewares/auth.js";
import { authRole } from "../../middlewares/auth_role.js";

// Basic chapter routes
routerChapter.get('/', getCapitulos);
routerChapter.get('/:id', getCapituloPorId);
routerChapter.post('/', checkAuth, postCapitulo);
routerChapter.put('/', checkAuth, putCapitulo);
routerChapter.delete('/:id', checkAuth, deleteCapitulo);

// Advanced chapter routes
routerChapter.get('/libro/:bookId', getCapitulosPorLibro);
routerChapter.get('/libro/:bookId/orden/:orderIndex', getCapituloPorOrden);
routerChapter.put('/libro/:bookId/reordenar', checkAuth, putReordenarCapitulos);
routerChapter.get('/buscar', buscarCapitulosPorTermino);

export default routerChapter; 