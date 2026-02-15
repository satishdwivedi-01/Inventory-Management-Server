import { getDashboardData } from "./dashboard.sevices.js";

export const getDashboard = async (req, res, next) => {
  try {
    const data = await getDashboardData();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
