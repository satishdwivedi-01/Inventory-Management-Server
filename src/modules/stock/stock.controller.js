import { asyncHandler } from "../../utills/AsyncHandler.js";
import * as service from "./stock.services.js";

export const create = asyncHandler(async (req, res) => {
  const product = await service.createMovement({
    ...req.body,
    userId: req.user.id,
  });

  res.json(product);
});

export const history = asyncHandler(async (req, res) => {
  const result = await service.getHistory(req.query);
  res.json(result);
});

export const remove = asyncHandler(async (req, res) => {
  await service.deleteMovement(req.params.id);
  res.json({ message: "Movement deleted" });
});
