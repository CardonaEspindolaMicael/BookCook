import {
  obtenerIndicesLibro,
  crearIndiceLibro,
  actualizarIndiceLibro,
  eliminarIndiceLibro,
  obtenerIndicePorId,
  obtenerIndicePorLibro,
  actualizarAnalisisLibro,
  obtenerLibrosPorTema,
  obtenerLibrosPorGenero,
  obtenerLibrosPorTono,
  obtenerCharacterPorLibro
} from "./bookIndex.models.js";
import { crearIndiceLibroSchema } from "./dto/bookIndex.dto.js";
import { actualizarIndiceLibroSchema } from "./dto/bookIndex.update.dto.js";

export const getIndicesLibro = async (req, res) => {
  try {
    const response = await obtenerIndicesLibro();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getIndicePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await obtenerIndicePorId(id);
    if (!response) {
      return res.status(404).json({ message: "Índice no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIndicePorLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await obtenerIndicePorLibro(bookId);
    if (!response) {
      return res.status(404).json({ message: "Índice no encontrado para este libro" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postIndiceLibro = async (req, res) => {
  try {
    const datos = crearIndiceLibroSchema.parse(req.body);
    
    const nuevoIndice = await crearIndiceLibro(datos);

    res.json({
      message: 'Índice creado con éxito!',
      ...nuevoIndice
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error(error);
    res.status(500).send({ error: 'Error al crear el índice' });
  }
};

export const putIndiceLibro = async (req, res) => {
  try {
    const datos = actualizarIndiceLibroSchema.parse(req.body);

    const indiceActualizado = await actualizarIndiceLibro(datos);

    res.status(200).json({
      message: 'Índice actualizado con éxito!',
      ...indiceActualizado
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error('Error al actualizar índice:', error);
    res.status(500).send({ error: 'Error al actualizar el índice' });
  }
};

export const deleteIndiceLibro = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await eliminarIndiceLibro(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const putAnalisisLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await actualizarAnalisisLibro(bookId);
    res.status(200).json({
      message: 'Análisis actualizado exitosamente',
      ...response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLibrosPorTema = async (req, res) => {
  const { tema } = req.params;
  try {
    const response = await obtenerLibrosPorTema(tema);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLibrosPorGenero = async (req, res) => {
  const { genero } = req.params;
  try {
    const response = await obtenerLibrosPorGenero(genero);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLibrosPorTono = async (req, res) => {
  const { tono } = req.params;
  try {
    const response = await obtenerLibrosPorTono(tono);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

export const getCharacterPorLibro = async (req, res) => {
  const { bookId } = req.params;

  console.log(bookId)
  try {
    const response = await obtenerCharacterPorLibro(bookId);
    if (!response) {
      return res.status(404).json({ message: "No se encontraron personajes para este libro" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}