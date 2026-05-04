const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
    getBookingsByDate,
    getBookingsByStatus,
    getBookingsByUser
     } = require("../services/bookingService");

const createBookingHandler = asyncHandler(async(req,res) => {
    const booking = await createBooking({
        ...req.body,
        customer: req.user?.id,
        customerName: req.user?.name || req.body.customerName,
        customerContact: req.user?.contact || req.body.customerContact || req.body.customerPhone,
        customerEmail: req.user?.email || req.body.customerEmail,
        vehicleImageUrl: req.body.vehicleImageUrl,
    });
    res.status(201).json({ success: true, data: booking });
});

const getBookingsHandler = asyncHandler(async(req,res) => {
    const {status,date} = req.query;
    const user = req.user;

     let bookings;

        if (user?.role === "admin") {
            if (status) {
                bookings = await getBookingsByStatus(status);
            } 
            else if (date) {
                bookings = await getBookingsByDate(date);
            } 
            else {
                bookings = await getAllBookings();
            }
        } else {
            bookings = await getBookingsByUser(user.id, { status, date });
        }

        res.status(200).json(bookings);
});

const getBookingByIdHandler = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const user = req.user;
    const booking = await getBookingById(id);

    if (user?.role !== "admin" && String(booking.customer) !== String(user.id)) {
        throw new AppError("You are not authorized to access this booking", 403);
    }

    res.status(200).json({status: "success",data:booking});
});

const updateBookingStatusHandler = asyncHandler(async(req,res) => {
    const id = req.params.id;
    const {status} = req.body;
    const updatedBooking = await updateBookingStatus(id, status);
        res.status(200).json({
            status: "success",
            data: updatedBooking
        });
});

const updateBookingHandler = asyncHandler(async(req,res)=> {
    const id = req.params.id;
    const user = req.user;
    const booking = await getBookingById(id);

    if (user?.role !== "admin" && String(booking.customer) !== String(user.id)) {
        throw new AppError("You are not authorized to update this booking", 403);
    }

    const updatePayload = {
        ...req.body,
        vehicleImageUrl: req.body.vehicleImageUrl,
    };

    if (String(req.body.clearVehicleImage).toLowerCase() === "true") {
        updatePayload.vehicleImageUrl = null;
    }

    const updatedBooking = await updateBooking(id, updatePayload);
    res.status(200).json({
            status: "success",
            data: updatedBooking
      });
});

const deleteBookingHandler = asyncHandler(async(req,res)=> {
    const id = req.params.id;
    const user = req.user;
    const booking = await getBookingById(id);

    if (user?.role !== "admin" && String(booking.customer) !== String(user.id)) {
        throw new AppError("You are not authorized to delete this booking", 403);
    }

    await deleteBooking(id);
    res.status(204).send();
})

module.exports = {
    createBookingHandler,
    getBookingsHandler,
    getBookingByIdHandler,
    updateBookingStatusHandler,
    updateBookingHandler,
    deleteBookingHandler
}