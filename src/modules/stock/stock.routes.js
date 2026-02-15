import express from "express";
import * as controller from "./stock.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stock
 *   description: Stock movement APIs
 */

/**
 * @swagger
 * /api/stocks/movement:
 *   post:
 *     summary: Create stock movement (Admin only)
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - type
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [IN, OUT]
 *               quantity:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: Stock updated
 */
router.post("/movement", protect, authorize("ADMIN"), controller.create);

/**
 * @swagger
 * /api/stocks/history:
 *   get:
 *     summary: List stock movements
 *     tags: [Stock]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *     responses:
 *       200:
 *         description: Movement history
 */
router.get("/history", protect, controller.history);

// Delete movement
router.delete("/movement/:id", protect, authorize("ADMIN"), controller.remove);

export default router;


