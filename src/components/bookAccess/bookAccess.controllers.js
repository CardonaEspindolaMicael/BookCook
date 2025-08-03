import {
  obtenerAccesosLibro,
  crearAccesoLibro,
  actualizarAccesoLibro,
  eliminarAccesoLibro,
  obtenerAccesoPorId,
  obtenerAccesosPorUsuario,
  obtenerAccesosPorLibro,
  verificarAccesoUsuario,
  obtenerAccesosPorTipo
} from "./bookAccess.models.js";
import { crearAccesoLibroSchema } from "./dto/bookAccess.dto.js";
import { actualizarAccesoLibroSchema } from "./dto/bookAccess.update.dto.js";

export const getAccesosLibro = async (req, res) => {
  try {
    const response = await obtenerAccesosLibro();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAccesoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await obtenerAccesoPorId(id);
    if (!response) {
      return res.status(404).json({ message: "Acceso no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postAccesoLibro = async (req, res) => {
  try {
    const datos = crearAccesoLibroSchema.parse(req.body);
    
    const nuevoAcceso = await crearAccesoLibro(datos);

    res.json({
      message: 'Acceso creado con éxito!',
      ...nuevoAcceso
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error(error);
    res.status(500).send({ error: 'Error al crear el acceso' });
  }
};

export const putAccesoLibro = async (req, res) => {
  try {
    const datos = actualizarAccesoLibroSchema.parse(req.body);

    const accesoActualizado = await actualizarAccesoLibro(datos);

    res.status(200).json({
      message: 'Acceso actualizado con éxito!',
      ...accesoActualizado
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error('Error al actualizar acceso:', error);
    res.status(500).send({ error: 'Error al actualizar el acceso' });
  }
};

export const deleteAccesoLibro = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await eliminarAccesoLibro(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAccesosPorUsuario = async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await obtenerAccesosPorUsuario(userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAccesosPorLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await obtenerAccesosPorLibro(bookId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verificarAccesoUsuarioLibro = async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    const response = await verificarAccesoUsuario(userId, bookId);
    res.status(200).json({
      tieneAcceso: response,
      message: response ? 'Usuario tiene acceso al libro' : 'Usuario no tiene acceso al libro'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAccesosPorTipo = async (req, res) => {
  const { accessType } = req.params;
  try {
    const response = await obtenerAccesosPorTipo(accessType);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 