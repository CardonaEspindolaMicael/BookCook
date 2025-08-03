import express from "express";
import {
  getAccesosLibro,
  getAccesoPorId,
  postAccesoLibro,
  putAccesoLibro,
  deleteAccesoLibro,
  getAccesosPorUsuario,
  getAccesosPorLibro,
  verificarAccesoUsuarioLibro,
  getAccesosPorTipo
} from "./bookAccess.controllers.js";

const router = express.Router();

router.get("/", getAccesosLibro);
router.get("/usuario/:userId", getAccesosPorUsuario);
router.get("/libro/:bookId", getAccesosPorLibro);
router.get("/tipo/:accessType", getAccesosPorTipo);
router.get("/verificar/:userId/:bookId", verificarAccesoUsuarioLibro);
router.get("/:id", getAccesoPorId);
router.post("/", postAccesoLibro);
router.put("/", putAccesoLibro);
router.delete("/:id", deleteAccesoLibro);

export default router; 