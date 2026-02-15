// Utility to generate SKU(stock keeping unit) for products
import crypto from "crypto";
export const generateSKU = (name) => {
  const code = name.substring(0, 3).toUpperCase();
  const unique = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${code}-${unique}`;
};
