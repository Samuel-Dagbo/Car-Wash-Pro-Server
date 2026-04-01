const asyncHandler = require("../utils/asyncHandler");
const { createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
    getBookingsByDate,
    getBookingsByStatus
     } = require("../services/bookingService");

const createBookingHandler = asyncHandler(async(req,res) => {
    const booking = await createBooking(req.body);
    res.status(201).json({ success: true, data: booking });
});

const getBookingHandler = asyncHandler(async(req,res) => {
    const {status,date} = req.query;

     let bookings;

        if (status) {
            bookings = await getBookingsByStatus(status);
        } 
        else if (date) {
            bookings = await getBookingsByDate(date);
        } 
        else {
            bookings = await getAllBookings();
        }

        res.status(200).json(bookings);
});

const getBookingByIdHandler = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const booking = await getBookingById(id);
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
    const updatedBooking = await updateBooking(id,req.body);
    res.status(200).json({
            status: "success",
            data: updatedBooking
      });
});

const deleteBookingHandler = asyncHandler(async(req,res)=> {
    const id = req.params.id;
    await deleteBooking(id);
    res.status(204).send();
})

module.exports = {
    createBookingHandler,
    getBookingHandler,
    getBookingByIdHandler,
    updateBookingStatusHandler,
    updateBookingHandler,
    deleteBookingHandler
}