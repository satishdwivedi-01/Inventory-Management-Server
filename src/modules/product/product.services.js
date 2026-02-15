import { Product } from "./product.model.js";

import { ApiError } from "../../utills/ApiError.js";
import { generateSKU } from "../../utills/SKU.js";
import { createMovement } from "../stock/stock.services.js";

const getUniqueSKU = async (name) => {
  let sku;
  let exists;
  do {
    sku = generateSKU(name);
    exists = await Product.findOne({ sku });
  } while (exists);
  return sku;
};

export const createProduct = async (payload, userId) => {
  // Auto-generate SKU if needed
  if (!payload.sku || payload.sku.trim() === "") {
    payload.sku = await getUniqueSKU(payload.name);
  }

  // Save initial quantity separately
  const initialQuantity = Number(payload.quantity) || 0;
  payload.quantity = 0; // IMPORTANT: reset to 0 for DB

  const product = await Product.create(payload);

  // 🔥 Initial stock movement if quantity > 0
  if (initialQuantity > 0) {
    await createMovement({
      productId: product._id,
      type: "IN",
      quantity: initialQuantity,
      userId,
    });
  }

  return product;
};

export const getProducts = async ({ page = 1, limit = 10, search = "" }) => {
  const query = { isDeleted: false };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(query),
  ]);

  return {
    data,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product || product.isDeleted)
    throw new ApiError(404, "Product not found");
  return product;
};

export const updateProduct = async (id, payload, userId) => {
  const product = await Product.findById(id);
  if (!product || product.isDeleted)
    throw new ApiError(404, "Product not found");

  // Handle SKU
  if ("sku" in payload && payload.sku && payload.sku !== product.sku) {
    const exists = await Product.findOne({ sku: payload.sku });
    if (exists) throw new ApiError(400, "SKU already exists");
    product.sku = payload.sku;
  }

  // Handle quantity changes
  if (payload.quantity !== undefined && payload.quantity !== product.quantity) {
    const diff = payload.quantity - product.quantity;
    if (diff !== 0) {
      await createMovement({
        productId: product._id,
        type: diff > 0 ? "IN" : "OUT",
        quantity: Math.abs(diff),
        userId,
      });
    }
    product.quantity = payload.quantity;
  }

  // Other fields
  if (payload.name) product.name = payload.name;
  if (payload.price !== undefined) product.price = payload.price;
  if (payload.lowStockThreshold !== undefined)
    product.lowStockThreshold = payload.lowStockThreshold;

  return product.save();
};

export const deleteProduct = async (id) => {
  const product = await getProductById(id);
  product.isDeleted = true;
  await product.save();
};
