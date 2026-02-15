import express from "express";
import * as controller from "./prodouct.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products with pagination and search
 *     tags: [Products]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: pen
 *     responses:
 *       200:
 *         description: Product list
 *       401:
 *         description: Not authenticated
 */
router.get("/", protect, controller.list);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/:id", protect, controller.getOne);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create product (Admin only)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sku
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pen
 *               sku:
 *                 type: string
 *                 example: PEN-001
 *               category:
 *                 type: string
 *                 example: Stationery
 *               price:
 *                 type: number
 *                 example: 10
 *               quantity:
 *                 type: number
 *                 example: 100
 *               lowStockThreshold:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: SKU exists
 */
router.post("/", protect, authorize("ADMIN"), controller.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product (Admin only)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/:id", protect, authorize("ADMIN"), controller.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Soft delete product (Admin only)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", protect, authorize("ADMIN"), controller.remove);

export default router;
