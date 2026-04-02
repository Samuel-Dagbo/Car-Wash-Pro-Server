const express = require("express");
const {
  createBookingHandler,
  getBookingsHandler,
  getBookingByIdHandler,
  updateBookingStatusHandler,
  updateBookingHandler,
  deleteBookingHandler,
} = require("../controllers/bookingController");
const { apiLimiter, authLimiter, createLimiter } = require("../middleware/rateLimiter");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authLimiter, protect, authorize("customer"), createBookingHandler);
router.get("/", apiLimiter, protect, authorize("admin", "customer"), getBookingsHandler);
router.get("/:id", apiLimiter, protect, authorize("admin", "customer"), getBookingByIdHandler);
router.put("/:id/status", apiLimiter, protect, authorize("admin"), updateBookingStatusHandler);
router.put("/:id", createLimiter, protect, authorize("admin", "customer"), updateBookingHandler);
router.delete("/:id", apiLimiter, protect, authorize("admin", "customer"), deleteBookingHandler);

module.exports = router;
