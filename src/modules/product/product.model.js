import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true, index: true },
    category: String,
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", schema);
