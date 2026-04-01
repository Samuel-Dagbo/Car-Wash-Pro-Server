const Booking = require("../models/Booking");
const Service = require("../models/Service");
const generateBookingReference = require("../utils/bookingReference");
const AppError = require("../utils/AppError");

const ACTIVE_BOOKING_STATUSES = ["Pending", "Approved", "In Progress", "Completed"];
const ALL_BOOKING_STATUSES = [...ACTIVE_BOOKING_STATUSES, "Rejected", "Cancelled"];

const createBooking = async(data) => {
    const service = await Service.findOne({ _id: data.service, isActive: true });

    if(!service){
        throw new AppError("Service not found", 404);
    }

    const bookingDateValue = data.date || data.bookingDate;
    const bookingTimeValue = data.time || data.timeSlot;

    if (!bookingDateValue || !bookingTimeValue) {
        throw new AppError("Booking date and time are required", 400);
    }

    const parsedDate = new Date(bookingDateValue);
    if (Number.isNaN(parsedDate.getTime())) {
        throw new AppError("Invalid booking date", 400);
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
        date: { $gte: startOfDay, $lte: endOfDay },
        time: bookingTimeValue,
        status: { $in: ACTIVE_BOOKING_STATUSES }
    });

    if(existingBooking){
        throw new AppError("This time slot is already booked", 409);
    }

    const customerName = data.customerName || [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
    const customerContact = data.customerContact || data.customerPhone;

    if (!customerName || !customerContact) {
        throw new AppError("Customer name and contact are required", 400);
    }

    const booking = await Booking.create({
        bookingReference: generateBookingReference(),
        customer: data.customer,
        customerName,
        customerContact,
        customerEmail: data.customerEmail,
        service: data.service,
        date: parsedDate,
        time: bookingTimeValue,
        notes: data.notes,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        vehiclePlate: data.vehiclePlate,
        totalAmount: service.price,
        status: data.status && ALL_BOOKING_STATUSES.includes(data.status) ? data.status : "Pending"
    });
    return booking;
};
const getAllBookings = async() => {
    const bookings = await Booking
    .find()
    .populate("service")
    .sort({createdAt: -1});

    return bookings;

};
const getBookingById = async(id) => {
    const booking = await Booking
    .findById(id)
    .populate("service");

    if(!booking){
        throw new AppError("Booking not found", 404);
    }

    return booking;
};
const updateBookingStatus = async(id,status) =>{
    const allowedStatuses = ALL_BOOKING_STATUSES;

    if (!allowedStatuses.includes(status)) {
        throw new AppError("Invalid booking status", 400);
    }

    const booking = await Booking.findById(id);
    if(!booking){
        throw new AppError("Booking not found", 404);
    }
    const updatedStatus = await Booking.findByIdAndUpdate(id,
        {status: status},
        {new: true}
    );
    return updatedStatus;
};
const updateBooking = async(id,data) =>{
    const booking = await Booking.findById(id);
    if(!booking){
        throw new AppError("Booking not found", 404);
    }

     if (data.bookingDate && !data.date) {
        data.date = data.bookingDate;
        delete data.bookingDate;
     }

     if (data.timeSlot && !data.time) {
        data.time = data.timeSlot;
        delete data.timeSlot;
     }

     if (data.service) {
        const service = await Service.findOne({ _id: data.service, isActive: true });

        if (!service) {
            throw new AppError("Service not found", 404);
        }

        data.totalAmount = service.price;
    }
     // Check if time slot is already taken (if date or slot is being updated)
    if (data.date || data.time) {
        const parsedDate = new Date(data.date || booking.date);
        const startOfDay = new Date(parsedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingBooking = await Booking.findOne({
            date: { $gte: startOfDay, $lte: endOfDay },
            time: data.time || booking.time,
            status: { $in: ACTIVE_BOOKING_STATUSES },
            _id: { $ne: id }
        });

        if (existingBooking) {
            throw new AppError("Time slot already booked", 409);
        }
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        data,
        {new: true}
    );
    return updatedBooking;
};
const deleteBooking = async(id) =>{
    const deletedBooking = await Booking.findByIdAndDelete(id);
        if(!deletedBooking){
            throw new AppError("Booking not found", 404);
        }
        return deletedBooking;
};
const getBookingsByDate = async (date) => {

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        throw new AppError("Invalid booking date", 400);
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ACTIVE_BOOKING_STATUSES }
    }).populate("service");

    return bookings;
};
const getBookingsByStatus = async (status) => {

    const allowedStatuses = ALL_BOOKING_STATUSES;

    if (!allowedStatuses.includes(status)) {
        throw new AppError("Invalid booking status", 400);
    }

    const bookings = await Booking.find({
        status: status
    }).populate("service");

    return bookings;
};




module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
    getBookingsByDate,
    getBookingsByStatus
};