import express from "express";
import {
  getReviews,
  getReviewPorId,
  postReview,
  putReview,
  deleteReview,
  getReviewsPorLibro,
  getReviewsPorUsuario,
  getReviewsPorRating,
  getReviewsVerificadas,
  getPromedioRatingLibro
} from "./review.controllers.js";

const router = express.Router();

router.get("/", getReviews);
router.get("/verificadas", getReviewsVerificadas);
router.get("/libro/:bookId", getReviewsPorLibro);
router.get("/usuario/:userId", getReviewsPorUsuario);
router.get("/rating/:rating", getReviewsPorRating);
router.get("/promedio/:bookId", getPromedioRatingLibro);
router.get("/:id", getReviewPorId);
router.post("/", postReview);
router.put("/", putReview);
router.delete("/:id", deleteReview);

export default router; 