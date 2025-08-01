import {Router} from "express"
import { 
  getRoles,
  getRolPorId,
  getRolPorNombre,
  postRol,
  putRol,
  deleteRol,
  getUsuariosConRol,
  getRolesActivos
} from "./role.controllers.js";
const routerRole = Router();
import { checkAuth } from "../../middlewares/auth.js";
import { authRole } from "../../middlewares/auth_role.js";

// Basic role routes
routerRole.get('/', getRoles);
routerRole.get('/:id', getRolPorId);
routerRole.get('/nombre/:name', getRolPorNombre);
routerRole.post('/', checkAuth, postRol);
routerRole.put('/', checkAuth, putRol);
routerRole.delete('/:id', checkAuth, deleteRol);

// Advanced role routes
routerRole.get('/:roleId/usuarios', getUsuariosConRol);
routerRole.get('/activos/roles', getRolesActivos);

export default routerRole; 