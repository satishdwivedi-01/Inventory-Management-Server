import mongoose from "mongoose";
import { Product } from "../product/product.model.js";
import { StockMovement } from "./stock.model.js";
import { ApiError } from "../../utills/ApiError.js";

// Create movement
export const createMovement = async ({ productId, type, quantity, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Product.findById(productId).session(session);

    if (!product || product.isDeleted)
      throw new ApiError(404, "Product not found");

    quantity = Number(quantity); // <-- ensure it's a number
    if (isNaN(quantity) || quantity <= 0)
      throw new ApiError(400, "Invalid quantity");

    if (type === "OUT" && product.quantity < quantity)
      throw new ApiError(400, "Insufficient stock");

    const beforeQuantity = product.quantity;
    product.quantity =
      type === "IN" ? product.quantity + quantity : product.quantity - quantity;

    await product.save({ session });

    await StockMovement.create(
      [
        {
          product: productId,
          type,
          quantity,
          createdBy: userId,
          beforeQuantity,
          afterQuantity: product.quantity,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return product;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

// Get history (only not deleted)
export const getHistory = async ({ page = 1, limit = 10, search = "" }) => {
  const skip = (page - 1) * limit;
  const query = { isDeleted: false };

  if (search) {
    const regex = new RegExp(search, "i"); // case-insensitive
    query.$or = [
      { "product.name": regex },
      { "product.sku": regex },
      {
        createdAt: {
          $gte: new Date(search),
          $lte: new Date(search + " 23:59:59"),
        },
      }, // only if search parses to date
    ].filter(Boolean);
  }

  const [data, total] = await Promise.all([
    StockMovement.find(query)
      .populate("product", "name sku")
      .populate("createdBy", "email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    StockMovement.countDocuments(query),
  ]);

  return {
    data,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

// Soft delete movement
export const deleteMovement = async (id) => {
  const movement = await StockMovement.findById(id);
  if (!movement || movement.isDeleted)
    throw new ApiError(404, "Movement not found");

  movement.isDeleted = true;
  await movement.save();
};
