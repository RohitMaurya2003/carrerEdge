import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  console.log("JWT Token:", token);
  const isProd = process.env.NODE_ENV === "production";
  // For cross-origin deployments (frontend and backend on different domains)
  // browsers require cookies to have SameSite='None' and Secure=true.
  // In development we keep SameSite strict/lax to ease testing on localhost.
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });

  return token;
};
