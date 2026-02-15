import jwt from "jsonwebtoken";
import { ApiError } from "../utills/ApiError.js";

export const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next(new ApiError(401, "Not authenticated"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    next(new ApiError(401, "Invalid token"));
  }
};

