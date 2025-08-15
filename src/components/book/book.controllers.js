import {
  obtenerLibros,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  obtenerLibroPorId,
  obtenerLibrosPorAutor,
  buscarLibros,
  obtenerLibrosPorEstado,
  obtenerEstadisticasLibro,
  obtenerLibrosNFT,
  obtenerLibrosGratuitos,
  incrementarVistas
} from "./book.models.js";
import { crearLibroSchema } from "./dto/book.dto.js";
import { actualizarLibroSchema } from "./dto/book.update.dto.js";

export const getLibros = async (req, res) => {
  try {
    const response = await obtenerLibros();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getLibroPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await obtenerLibroPorId(id);
    if (!response) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postLibro = async (req, res) => {
  try {
    const datos = crearLibroSchema.parse(req.body);
    
    const nuevoLibro = await crearLibro(datos);

    res.json({
      message: 'Libro creado con éxito!',
      ...nuevoLibro
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error(error);
    res.status(500).send({ error: 'Error al crear el libro' });
  }
};

export const putLibro = async (req, res) => {
  try {
    const datos = actualizarLibroSchema.parse(req.body);

    const libroActualizado = await actualizarLibro(datos);

    res.status(200).json({
      message: 'Libro actualizado con éxito!',
      ...libroActualizado
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error('Error al actualizar libro:', error);
    res.status(500).send({ error: 'Error al actualizar el libro' });
  }
};

export const deleteLibro = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await eliminarLibro(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLibrosPorAutor = async (req, res) => {
  const { authorId } = req.params;
  try {
    const response = await obtenerLibrosPorAutor(authorId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarLibrosPorTermino = async (req, res) => {
  const { searchTerm } = req.query;
  try {
    if (!searchTerm) {
      return res.status(400).json({ message: "Término de búsqueda requerido" });
    }
    const response = await buscarLibros(searchTerm);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLibrosPorEstado = async (req, res) => {
  const { status } = req.params;
  try {
    const response = await obtenerLibrosPorEstado(status);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEstadisticasLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await obtenerEstadisticasLibro(bookId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLibrosNFT = async (req, res) => {
  try {
    const response = await obtenerLibrosNFT();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLibrosGratuitos = async (req, res) => {
  try {
    const response = await obtenerLibrosGratuitos();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const incrementarVistaLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await incrementarVistas(bookId);
    res.status(200).json({
      message: 'Vista incrementada exitosamente',
      ...response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 