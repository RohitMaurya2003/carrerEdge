import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProd = process.env.NODE_ENV === "production";
  
  // Cookie configuration for cross-origin deployments
  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in MS
    httpOnly: true, // prevent XSS attacks
    sameSite: isProd ? "none" : "lax", // 'none' required for cross-site cookies
    secure: isProd, // true in production (HTTPS required)
    path: "/", // cookie available for all routes
  };

  console.log("Setting JWT cookie with options:", cookieOptions);
  res.cookie("jwt", token, cookieOptions);

  return token;
};
