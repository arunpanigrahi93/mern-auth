import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  // Extract token from cookies
  const { token } = req.cookies;

  // If no token found, reject request
  if (!token) {
    return res.status(401).json({ success: false, message: "Please login" });
  }

  try {
    // Verify the token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If decoded token doesn’t have a user ID, reject request
    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Please login" });
    }

    // Attach user ID to request object for later use in controllers
    req.user = { id: decoded.id };

    // Allow request to continue
    next();
  } catch (err) {
    // If token verification fails (invalid/expired), send error response
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default userAuth;
