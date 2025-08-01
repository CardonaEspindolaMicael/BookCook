import {Router} from "express"
import { 
  postUsuario,
  patchContrasena, 
  getUsuarios, 
  actualizarUsuario, 
  eliminarUsuario,
  renovarToken,
  getUsuariosById,
  getUsuariosByEmail,
  getUsuarioConRelaciones,
  asignarRol,
  removerRol
} from "./user.controllers.js";
const routerUser = Router();
import { checkAuth } from "../../middlewares/auth.js";
import { authRole } from "../../middlewares/auth_role.js";
//import { validateCreate } from "../../validators/user.js";

routerUser.get('/cajeros', (req, res) => {
  res.send('Hola Mundo');
});

// Basic user routes
routerUser.get('/', [checkAuth], getUsuarios);
routerUser.get('/:id', checkAuth, getUsuariosById);
routerUser.get('/email/:email', checkAuth, getUsuariosByEmail);
routerUser.put('/', checkAuth, actualizarUsuario);
routerUser.post('/', postUsuario);
routerUser.patch('/cambiarClave', patchContrasena);
routerUser.delete('/:id', checkAuth, eliminarUsuario);
routerUser.get('/renew', checkAuth, renovarToken);

// Enhanced user routes with relationships
routerUser.get('/:id/relaciones', checkAuth, getUsuarioConRelaciones);

// Role management routes
routerUser.post('/asignar-rol', checkAuth, asignarRol);
routerUser.delete('/remover-rol', checkAuth, removerRol);

export default routerUser; 