import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "Please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Please login" });
    }

    // Attach user info safely
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default userAuth;
