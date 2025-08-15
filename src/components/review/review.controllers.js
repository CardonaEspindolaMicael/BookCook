import {
  obtenerReviews,
  crearReview,
  actualizarReview,
  eliminarReview,
  obtenerReviewPorId,
  obtenerReviewsPorLibro,
  obtenerReviewsPorUsuario,
  obtenerReviewsPorRating,
  obtenerReviewsVerificadas,
  obtenerPromedioRatingLibro
} from "./review.models.js";
import { crearReviewSchema } from "./dto/review.dto.js";
import { actualizarReviewSchema } from "./dto/review.update.dto.js";

export const getReviews = async (req, res) => {
  try {
    const response = await obtenerReviews();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getReviewPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await obtenerReviewPorId(id);
    if (!response) {
      return res.status(404).json({ message: "Review no encontrada" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postReview = async (req, res) => {
  try {
    const datos = crearReviewSchema.parse(req.body);
    
    const nuevaReview = await crearReview(datos);

    res.json({
      message: 'Review creada con éxito!',
      ...nuevaReview
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error(error);
    res.status(500).send({ error: 'Error al crear la review' });
  }
};

export const putReview = async (req, res) => {
  try {
    const datos = actualizarReviewSchema.parse(req.body);

    const reviewActualizada = await actualizarReview(datos);

    res.status(200).json({
      message: 'Review actualizada con éxito!',
      ...reviewActualizada
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ ok: false, errores: error.errors });
    }

    console.error('Error al actualizar review:', error);
    res.status(500).send({ error: 'Error al actualizar la review' });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await eliminarReview(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewsPorLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await obtenerReviewsPorLibro(bookId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewsPorUsuario = async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await obtenerReviewsPorUsuario(userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewsPorRating = async (req, res) => {
  const { rating } = req.params;
  try {
    const response = await obtenerReviewsPorRating(parseInt(rating));
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewsVerificadas = async (req, res) => {
  try {
    const response = await obtenerReviewsVerificadas();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPromedioRatingLibro = async (req, res) => {
  const { bookId } = req.params;
  try {
    const response = await obtenerPromedioRatingLibro(bookId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 