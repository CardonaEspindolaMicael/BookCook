import {Router} from "express"
import { 
  getVersionesLibro,
  getVersionPorId,
  postVersionLibro,
  putVersionLibro,
  deleteVersionLibro,
  getVersionesPorLibro,
  getVersionPorHash,
  getUltimaVersionLibro,
  getHistorialVersiones,
  getCompararVersiones
} from "./bookVersion.controllers.js";
const routerBookVersion = Router();
import { checkAuth } from "../../middlewares/auth.js";
import { authRole } from "../../middlewares/auth_role.js";

// Basic book version routes
routerBookVersion.get('/', getVersionesLibro);
routerBookVersion.get('/:id', getVersionPorId);
routerBookVersion.post('/', checkAuth, postVersionLibro);
routerBookVersion.put('/', checkAuth, putVersionLibro);
routerBookVersion.delete('/:id', checkAuth, deleteVersionLibro);

// Advanced book version routes
routerBookVersion.get('/libro/:bookId', getVersionesPorLibro);
routerBookVersion.get('/hash/:versionHash', getVersionPorHash);
routerBookVersion.get('/libro/:bookId/ultima', getUltimaVersionLibro);
routerBookVersion.get('/libro/:bookId/historial', getHistorialVersiones);
routerBookVersion.get('/comparar/:versionId1/:versionId2', getCompararVersiones);

export default routerBookVersion; 