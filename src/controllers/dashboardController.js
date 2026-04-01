const asyncHandler = require("../utils/asyncHandler");
const {
    getDashBoardStats,
    getRecentBookings
} = require("../services/dashboard.Service");

const getDashBoardStatsHandler = asyncHandler(async (req, res) => {
    const result = await getDashBoardStats();

    res.status(200).json({
        message: "Dashboard statistics retrieved successfully",
        data: result
    });
});

const getRecentBookingsHandler = asyncHandler(async (req, res) => {
    const bookings = await getRecentBookings();

    res.status(200).json({
        message: "Recent bookings retrieved successfully",
        data: bookings
    });
});

module.exports = {
    getDashBoardStatsHandler,
    getRecentBookingsHandler
};