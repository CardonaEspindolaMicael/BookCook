import {
  obtenerIndicesCapitulo,
  crearIndiceCapitulo,
  actualizarIndiceCapitulo,
  eliminarIndiceCapitulo,
  obtenerIndicePorId,
  obtenerIndicePorCapitulo,
  actualizarAnalisisCapitulo,
  obtenerCapitulosPorEvento,
  obtenerCapitulosPorPersonaje,
  obtenerCapitulosPorEstadoAnimo
} from "./chapterIndex.models.js";
import { crearIndiceCapituloSchema } from "./dto/chapterIndex.dto.js";
import { actualizarIndiceCapituloSchema } from "./dto/chapterIndex.update.dto.js";

export const getIndicesCapitulo = async (req, res) => {
  try {
    const response = await obtenerIndicesCapitulo();
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

export const getIndicePorCapitulo = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const response = await obtenerIndicePorCapitulo(chapterId);
    if (!response) {
      return res.status(404).json({ message: "Índice no encontrado para este capítulo" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postIndiceCapitulo = async (req, res) => {
  try {
    const datos = crearIndiceCapituloSchema.parse(req.body);
    
    const nuevoIndice = await crearIndiceCapitulo(datos);

    res.json({
      message: 'Índice de capítulo creado con éxito!',
      ...nuevoIndice
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error(error);
    res.status(500).send({ error: 'Error al crear el índice del capítulo' });
  }
};

export const putIndiceCapitulo = async (req, res) => {
  try {
    const datos = actualizarIndiceCapituloSchema.parse(req.body);

    const indiceActualizado = await actualizarIndiceCapitulo(datos);

    res.status(200).json({
      message: 'Índice de capítulo actualizado con éxito!',
      ...indiceActualizado
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error('Error al actualizar índice de capítulo:', error);
    res.status(500).send({ error: 'Error al actualizar el índice del capítulo' });
  }
};

export const deleteIndiceCapitulo = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await eliminarIndiceCapitulo(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const putAnalisisCapitulo = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const response = await actualizarAnalisisCapitulo(chapterId);
    res.status(200).json({
      message: 'Análisis de capítulo actualizado exitosamente',
      ...response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCapitulosPorEvento = async (req, res) => {
  const { evento } = req.params;
  try {
    const response = await obtenerCapitulosPorEvento(evento);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCapitulosPorPersonaje = async (req, res) => {
  const { personaje } = req.params;
  try {
    const response = await obtenerCapitulosPorPersonaje(personaje);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCapitulosPorEstadoAnimo = async (req, res) => {
  const { estadoAnimo } = req.params;
  try {
    const response = await obtenerCapitulosPorEstadoAnimo(estadoAnimo);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 