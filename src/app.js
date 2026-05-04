const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoute = require("./routes/authRoute");
const serviceRoute = require("./routes/serviceRoute");
const bookingRoute = require("./routes/bookingRoute");
const dashboardRoute = require("./routes/dashboardRoute");

const errorHandler = require("./middleware/errorHandler");

const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", apiLimiter);

// Health route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authRoute);
app.use("/api/services", serviceRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/dashboard", dashboardRoute);


//HANDLE UNKNOWN ROUTES 
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;