import { Product } from "../product/product.model.js";
import { StockMovement } from "../stock/stock.model.js";

export const getDashboardData = async () => {
  const [
    totalProducts,
    lowStockProducts,
    recentMovements,
  ] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),

    Product.find({
      isDeleted: false,
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
    })
      .select("name sku quantity lowStockThreshold")
      .sort({ quantity: 1 })
      .limit(10)
      .lean(),

    StockMovement.find()
      .populate("product", "name sku")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  return {
    totalProducts,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    recentMovements,
  };
};

