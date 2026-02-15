import { asyncHandler } from "../../utills/AsyncHandler.js";
import { validateUser, generateToken } from "./auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const user = await validateUser(req.body);

  const token = generateToken(user);

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with https
      sameSite: "lax",
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
