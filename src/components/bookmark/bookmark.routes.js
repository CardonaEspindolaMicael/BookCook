import express from "express";
import {
  getBookmarks,
  getBookmarkPorId,
  postBookmark,
  deleteBookmark,
  getBookmarksPorUsuario,
  getBookmarksPorLibro,
  verificarBookmarkUsuarioLibro,
  getBookmarksRecientes
} from "./bookmark.controllers.js";

const router = express.Router();

router.get("/", getBookmarks);
router.get("/recientes", getBookmarksRecientes);
router.get("/usuario/:userId", getBookmarksPorUsuario);
router.get("/libro/:bookId", getBookmarksPorLibro);
router.get("/verificar/:userId/:bookId", verificarBookmarkUsuarioLibro);
router.get("/:id", getBookmarkPorId);
router.post("/", postBookmark);
router.delete("/:id", deleteBookmark);

export default router; 