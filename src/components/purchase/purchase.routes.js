import express from "express";
import {
  getPurchases,
  getPurchasePorId,
  postPurchase,
  putPurchase,
  deletePurchase,
  getPurchasesPorUsuario,
  getPurchasesPorLibro,
  getPurchasesPorEstado,
  getPurchasesPorMoneda,
  getEstadisticasVentas
} from "./purchase.controllers.js";

const router = express.Router();

router.get("/", getPurchases);
router.get("/estadisticas", getEstadisticasVentas);
router.get("/usuario/:userId", getPurchasesPorUsuario);
router.get("/libro/:bookId", getPurchasesPorLibro);
router.get("/estado/:status", getPurchasesPorEstado);
router.get("/moneda/:currency", getPurchasesPorMoneda);
router.get("/:id", getPurchasePorId);
router.post("/", postPurchase);
router.put("/", putPurchase);
router.delete("/:id", deletePurchase);

export default router; 