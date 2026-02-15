import { asyncHandler } from "../../utills/AsyncHandler.js";
import * as service from "./product.services.js";

export const create = asyncHandler(async (req, res) => {
  const product = await service.createProduct(req.body , req.user.id);
  res.status(201).json(product);
});

export const list = asyncHandler(async (req, res) => {
  const result = await service.getProducts(req.query);
  res.json(result);
});

export const getOne = asyncHandler(async (req, res) => {
  const product = await service.getProductById(req.params.id);
  res.json(product);
});

export const update = asyncHandler(async (req, res) => {
  const product = await service.updateProduct(req.params.id, req.body,req.user.id);
  res.json(product);
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteProduct(req.params.id);
  res.json({ message: "Product deleted" });
});
