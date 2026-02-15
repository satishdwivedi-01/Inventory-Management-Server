import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";

import { errorHandler } from "./middlewares/error.middleware.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";

console.log("CLIENT URL =", process.env.CLIENT_URL);


// routes
import authRoutes  from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import stockRoutes from "./modules/stock/stock.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";


const app = express();

app.get("/api/health", (req, res) => res.json({ status: "OK" }));

app.use(
  cors({
    origin: process.env.CLIENT_URL, // frontend URL
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes here
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;

