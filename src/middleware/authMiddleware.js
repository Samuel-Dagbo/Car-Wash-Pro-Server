const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

// 🔐 Protect route
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authorized", 401));
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return next(new AppError("Invalid or expired token", 401));
  }

  req.user = decoded; // { id, role }
  next();
};

// 🔑 Role-based access
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
};

module.exports = { protect, authorize };