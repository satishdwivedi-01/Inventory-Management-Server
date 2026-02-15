import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["IN", "OUT"], required: true },
    quantity: { type: Number, required: true, min: 1 },
    beforeQuantity: { type: Number, required: true },
    afterQuantity: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"  },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const StockMovement = mongoose.model("StockMovement", schema);


