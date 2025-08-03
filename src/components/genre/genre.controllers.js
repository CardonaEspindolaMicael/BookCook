import {
  obtenerGeneros,
  obtenerGeneroPorId,
  crearGenero,
  actualizarGenero,
  eliminarGenero,
  obtenerGenerosActivos,
  obtenerGenerosPorNombre,
  obtenerGenerosConLibros,
  contarLibrosPorGenero
} from "./genre.models.js";
import { crearGeneroSchema } from "./dto/genre.dto.js";
import { actualizarGeneroSchema } from "./dto/genre.update.dto.js";

// Get all genres
export const getGeneros = async (req, res) => {
  try {
    const generos = await obtenerGeneros();
    
    res.status(200).json({
      message: "Géneros obtenidos exitosamente",
      data: generos
    });
  } catch (error) {
    console.error("Error al obtener géneros:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Get genre by ID
export const getGeneroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const genero = await obtenerGeneroPorId(id);
    
    if (!genero) {
      return res.status(404).json({
        message: "Género no encontrado"
      });
    }
    
    res.status(200).json({
      message: "Género obtenido exitosamente",
      data: genero
    });
  } catch (error) {
    console.error("Error al obtener género:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Create new genre
export const postGenero = async (req, res) => {
  try {
    const validation = crearGeneroSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        message: "Datos de entrada inválidos",
        errors: validation.error.errors
      });
    }
    
    const nuevoGenero = await crearGenero(validation.data);
    
    res.status(201).json({
      message: "Género creado exitosamente",
      data: nuevoGenero
    });
  } catch (error) {
    console.error("Error al crear género:", error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: "Ya existe un género con ese nombre"
      });
    }
    
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Update genre
export const putGenero = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = actualizarGeneroSchema.safeParse({ id, ...req.body });
    
    if (!validation.success) {
      return res.status(400).json({
        message: "Datos de entrada inválidos",
        errors: validation.error.errors
      });
    }
    
    const generoActualizado = await actualizarGenero(id, validation.data);
    
    if (!generoActualizado) {
      return res.status(404).json({
        message: "Género no encontrado"
      });
    }
    
    res.status(200).json({
      message: "Género actualizado exitosamente",
      data: generoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar género:", error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: "Ya existe un género con ese nombre"
      });
    }
    
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Delete genre
export const deleteGenero = async (req, res) => {
  try {
    const { id } = req.params;
    const generoEliminado = await eliminarGenero(id);
    
    if (!generoEliminado) {
      return res.status(404).json({
        message: "Género no encontrado"
      });
    }
    
    res.status(200).json({
      message: "Género eliminado exitosamente",
      data: generoEliminado
    });
  } catch (error) {
    console.error("Error al eliminar género:", error);
    
    if (error.code === 'P2003') {
      return res.status(409).json({
        message: "No se puede eliminar el género porque tiene libros asociados"
      });
    }
    
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Get active genres only
export const getGenerosActivos = async (req, res) => {
  try {
    const generos = await obtenerGenerosActivos();
    
    res.status(200).json({
      message: "Géneros activos obtenidos exitosamente",
      data: generos
    });
  } catch (error) {
    console.error("Error al obtener géneros activos:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Search genres by name
export const getGenerosPorNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    const generos = await obtenerGenerosPorNombre(nombre);
    
    res.status(200).json({
      message: "Géneros encontrados exitosamente",
      data: generos
    });
  } catch (error) {
    console.error("Error al buscar géneros:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Get genres with their books
export const getGenerosConLibros = async (req, res) => {
  try {
    const generos = await obtenerGenerosConLibros();
    
    res.status(200).json({
      message: "Géneros con libros obtenidos exitosamente",
      data: generos
    });
  } catch (error) {
    console.error("Error al obtener géneros con libros:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Get book count by genre
export const getContarLibrosPorGenero = async (req, res) => {
  try {
    const { generoId } = req.params;
    const conteo = await contarLibrosPorGenero(generoId);
    
    res.status(200).json({
      message: "Conteo de libros por género obtenido exitosamente",
      data: {
        generoId,
        totalLibros: conteo
      }
    });
  } catch (error) {
    console.error("Error al contar libros por género:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
}; 