const express = require("express");
const {
    getDashBoardStatsHandler,
    getRecentBookingsHandler
} = require("../controllers/dashboardController");
const { apiLimiter } = require("../middleware/rateLimiter");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/stats', apiLimiter, protect, authorize('admin'), getDashBoardStatsHandler);
router.get('/recent-bookings', apiLimiter, protect, authorize('admin'), getRecentBookingsHandler);

module.exports = router;
