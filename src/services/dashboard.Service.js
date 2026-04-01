const Booking = require("../models/Booking");

const getTotalBookings = async () => {
    const totalBookings = await Booking.countDocuments();
    return totalBookings;
};
const getPendingBookings = async () => {
    const pendingBookings = await Booking.countDocuments({
        status: "Pending"
    });
    return pendingBookings;
};
const getCompletedBookings = async () => {
    const completedBookings = await Booking.countDocuments({
        status: "Completed"
    });
    return completedBookings;
};
const getCancelledBookings = async () => {
    const cancelledBookings = await Booking.countDocuments({
        status: "Cancelled"
    });
    return cancelledBookings;
};
const getTotalRevenue = async () => {
    const completedBookings = await Booking.find({
        status: "Completed"
    });
    const totalRevenue = completedBookings.reduce((total, booking) => {
        return total + (booking.totalAmount || 0);
    }, 0);
    return totalRevenue;
};
const getRecentBookings = async () => {
    const bookings = await Booking.find()
    .sort({createdAt: -1})
    .limit (5)
    .populate("service");

    return bookings;
};
const getDashBoardStats = async () => {
    const [
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        recentBookings
    ] = await Promise.all([
        getTotalBookings(),
        getPendingBookings(),
        getCompletedBookings(),
        getCancelledBookings(),
        getTotalRevenue(),
        getRecentBookings()
    ]);
    return{
         totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        recentBookings
    };
};

module.exports = {
    getDashBoardStats,
    getTotalBookings,
    getPendingBookings,
    getCompletedBookings,
    getCancelledBookings,
    getTotalRevenue,
    getRecentBookings
}