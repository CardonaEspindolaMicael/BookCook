import {
  obtenerPurchases,
  crearPurchase,
  actualizarPurchase,
  eliminarPurchase,
  obtenerPurchasePorId,
  obtenerPurchasesPorUsuario,
  obtenerPurchasesPorLibro,
  obtenerPurchasesPorEstado,
  obtenerPurchasesPorMoneda,
  obtenerEstadisticasVentas
} from "./purchase.models.js";
import { crearPurchaseSchema } from "./dto/purchase.dto.js";
import { actualizarPurchaseSchema } from "./dto/purchase.update.dto.js";

export const getPurchases = async (req, res) => {
  try {
    const response = await obtenerPurchases();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getPurchasePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await obtenerPurchasePorId(id);
    if (!response) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postPurchase = async (req, res) => {
  try {
    const datos = crearPurchaseSchema.parse(req.body);
    
    const nuevaPurchase = await crearPurchase(datos);

    res.json({
      message: 'Compra creada con éxito!',
      ...nuevaPurchase
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error(error);
    res.status(500).send({ error: 'Error al crear la compra' });
  }
};

export const putPurchase = async (req, res) => {
  try {
    const datos = actualizarPurchaseSchema.parse(req.body);

    const purchaseActualizada = await actualizarPurchase(datos);

    res.status(200).json({
      message: 'Compra actualizada con éxito!',
      ...purchaseActualizada
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error('Error al actualizar compra:', error);
    res.status(500).send({ error: 'Error al actualizar la compra' });
  }
};

export const deletePurchase = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await eliminarPurchase(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPurchasesPorUsuario = async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await obtenerPurchasesPorUsuario(userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPurchasesPorLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await obtenerPurchasesPorLibro(bookId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPurchasesPorEstado = async (req, res) => {
  const { status } = req.params;
  try {
    const response = await obtenerPurchasesPorEstado(status);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPurchasesPorMoneda = async (req, res) => {
  const { currency } = req.params;
  try {
    const response = await obtenerPurchasesPorMoneda(currency);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEstadisticasVentas = async (req, res) => {
  try {
    const response = await obtenerEstadisticasVentas();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 