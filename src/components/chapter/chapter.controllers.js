import {
  obtenerCapitulos,
  crearCapitulo,
  actualizarCapitulo,
  eliminarCapitulo,
  obtenerCapituloPorId,
  obtenerCapitulosPorLibro,
  obtenerCapituloPorOrden,
  reordenarCapitulos,
  buscarCapitulos
} from "./chapter.models.js";
import { crearCapituloSchema } from "./dto/chapter.dto.js";
import { actualizarCapituloSchema } from "./dto/chapter.update.dto.js";

export const getCapitulos = async (req, res) => {
  try {
    const response = await obtenerCapitulos();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getCapituloPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await obtenerCapituloPorId(id);
    if (!response) {
      return res.status(404).json({ message: "Capítulo no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postCapitulo = async (req, res) => {
  try {
    const datos = crearCapituloSchema.parse(req.body);
    
    const nuevoCapitulo = await crearCapitulo(datos);

    res.json({
      message: 'Capítulo creado con éxito!',
      ...nuevoCapitulo
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error(error);
    res.status(500).send({ error: 'Error al crear el capítulo' });
  }
};

export const putCapitulo = async (req, res) => {
  try {
    const datos = actualizarCapituloSchema.parse(req.body);

    const capituloActualizado = await actualizarCapitulo(datos);

    res.status(200).json({
      message: 'Capítulo actualizado con éxito!',
      ...capituloActualizado
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error('Error al actualizar capítulo:', error);
    res.status(500).send({ error: 'Error al actualizar el capítulo' });
  }
};

export const deleteCapitulo = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await eliminarCapitulo(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCapitulosPorLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await obtenerCapitulosPorLibro(bookId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCapituloPorOrden = async (req, res) => {
  const { bookId, orderIndex } = req.params;
  try {
    const response = await obtenerCapituloPorOrden(bookId, parseInt(orderIndex));
    if (!response) {
      return res.status(404).json({ message: "Capítulo no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const putReordenarCapitulos = async (req, res) => {
  const { bookId } = req.params;
  const { capitulosOrdenados } = req.body;
  
  try {
    if (!capitulosOrdenados || !Array.isArray(capitulosOrdenados)) {
      return res.status(400).json({ message: "Lista de capítulos ordenados requerida" });
    }
    
    const response = await reordenarCapitulos(bookId, capitulosOrdenados);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarCapitulosPorTermino = async (req, res) => {
  const { searchTerm } = req.query;
  try {
    if (!searchTerm) {
      return res.status(400).json({ message: "Término de búsqueda requerido" });
    }
    const response = await buscarCapitulos(searchTerm);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 