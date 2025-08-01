import {
  obtenerVersionesLibro,
  crearVersionLibro,
  actualizarVersionLibro,
  eliminarVersionLibro,
  obtenerVersionPorId,
  obtenerVersionesPorLibro,
  obtenerVersionPorHash,
  obtenerUltimaVersionLibro,
  obtenerHistorialVersiones,
  compararVersiones
} from "./bookVersion.models.js";
import { crearVersionLibroSchema } from "./dto/bookVersion.dto.js";
import { actualizarVersionLibroSchema } from "./dto/bookVersion.update.dto.js";

export const getVersionesLibro = async (req, res) => {
  try {
    const response = await obtenerVersionesLibro();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getVersionPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await obtenerVersionPorId(id);
    if (!response) {
      return res.status(404).json({ message: "Versión no encontrada" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postVersionLibro = async (req, res) => {
  try {
    const datos = crearVersionLibroSchema.parse(req.body);
    
    const nuevaVersion = await crearVersionLibro(datos);

    res.json({
      message: 'Versión del libro creada con éxito!',
      ...nuevaVersion
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error(error);
    res.status(500).send({ error: 'Error al crear la versión del libro' });
  }
};

export const putVersionLibro = async (req, res) => {
  try {
    const datos = actualizarVersionLibroSchema.parse(req.body);

    const versionActualizada = await actualizarVersionLibro(datos);

    res.status(200).json({
      message: 'Versión del libro actualizada con éxito!',
      ...versionActualizada
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error('Error al actualizar versión del libro:', error);
    res.status(500).send({ error: 'Error al actualizar la versión del libro' });
  }
};

export const deleteVersionLibro = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await eliminarVersionLibro(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVersionesPorLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await obtenerVersionesPorLibro(bookId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVersionPorHash = async (req, res) => {
  const { versionHash } = req.params;
  try {
    const response = await obtenerVersionPorHash(versionHash);
    if (!response) {
      return res.status(404).json({ message: "Versión no encontrada" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUltimaVersionLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await obtenerUltimaVersionLibro(bookId);
    if (!response) {
      return res.status(404).json({ message: "No se encontraron versiones para este libro" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHistorialVersiones = async (req, res) => {
  const { bookId } = req.params;
  const { limit = 10 } = req.query;
  try {
    const response = await obtenerHistorialVersiones(bookId, parseInt(limit));
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompararVersiones = async (req, res) => {
  const { versionId1, versionId2 } = req.params;
  try {
    const response = await compararVersiones(versionId1, versionId2);
    if (response.error) {
      return res.status(404).json({ message: response.error });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 