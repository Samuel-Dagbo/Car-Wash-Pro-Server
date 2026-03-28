const jwt = require("jsonwebtoken");
const config = require("../config/config");

// 🔐 Access Token
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role }, // ✅ consistent
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );
};

// 🔁 Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpire }
  );
};

// 🔍 Verify Token
const verifyToken = (token, isRefresh = false) => {
  try {
    const secret = isRefresh
      ? config.jwt.refreshSecret
      : config.jwt.secret;

    return jwt.verify(token, secret);
  } catch (error) {
    return null; // handled in middleware
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};