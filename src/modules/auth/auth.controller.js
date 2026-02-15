import { asyncHandler } from "../../utills/AsyncHandler.js";
import { validateUser, generateToken } from "./auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const user = await validateUser(req.body);

  const token = generateToken(user);

  const isProduction = process.env.NODE_ENV === "production";

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? "none" : "lax", // cross-site for prod
      maxAge: 1000 * 60 * 60 * 24, // optional: 1 day in ms
    })
    .json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
