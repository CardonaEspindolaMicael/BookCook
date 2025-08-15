import {
  obtenerBookmarks,
  crearBookmark,
  eliminarBookmark,
  obtenerBookmarkPorId,
  obtenerBookmarksPorUsuario,
  obtenerBookmarksPorLibro,
  verificarBookmarkUsuario,
  obtenerBookmarksRecientes
} from "./bookmark.models.js";
import { crearBookmarkSchema } from "./dto/bookmark.dto.js";

export const getBookmarks = async (req, res) => {
  try {
    const response = await obtenerBookmarks();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getBookmarkPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await obtenerBookmarkPorId(id);
    if (!response) {
      return res.status(404).json({ message: "Bookmark no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postBookmark = async (req, res) => {
  try {
    const datos = crearBookmarkSchema.parse(req.body);
    
    const nuevoBookmark = await crearBookmark(datos);

    res.json({
      message: 'Bookmark creado con éxito!',
      ...nuevoBookmark
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error(error);
    res.status(500).send({ error: 'Error al crear el bookmark' });
  }
};

export const deleteBookmark = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await eliminarBookmark(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookmarksPorUsuario = async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await obtenerBookmarksPorUsuario(userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookmarksPorLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await obtenerBookmarksPorLibro(bookId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verificarBookmarkUsuarioLibro = async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    const response = await verificarBookmarkUsuario(userId, bookId);
    res.status(200).json({
      tieneBookmark: response,
      message: response ? 'Usuario tiene bookmark del libro' : 'Usuario no tiene bookmark del libro'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookmarksRecientes = async (req, res) => {
  const { limit = 10 } = req.query;
  try {
    const response = await obtenerBookmarksRecientes(parseInt(limit));
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 