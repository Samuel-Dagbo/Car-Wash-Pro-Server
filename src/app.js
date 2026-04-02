const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Health route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Routes (uncomment when ready)
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/services", require("./routes/serviceRoute"));
app.use("/api/bookings", require("./routes/bookingRoute"));
app.use("/api/dashboard", require("./routes/dashboardRoute"));

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;