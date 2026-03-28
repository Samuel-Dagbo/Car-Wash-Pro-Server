const mongoose = require("mongoose");
const generateBookingReference = require("../utils/bookingReference");

const bookingSchema = new mongoose.Schema({
  bookingReference: { type: String, unique: true, index: true, required: true },

  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  customerName: { type: String, required: true, trim: true },
  customerContact: { type: String, required: true, trim: true },
  customerEmail: {
    type: String,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
  },

  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },

  date: { type: Date, required: true },
  time: {
    type: String,
    required: true,
    match: [/^\d{2}:\d{2}$/, "Use HH:MM format"]
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "In Progress", "Completed", "Rejected", "Cancelled"],
    default: "Pending",
  },

  totalAmount: { type: Number, min: 0 },

  vehicleMake: { type: String, trim: true },
  vehicleModel: { type: String, trim: true },
  vehiclePlate: { type: String, trim: true },
  notes: { type: String, trim: true },

  cancelledAt: { type: Date },
  cancelledBy: {
    type: String,
    enum: ["customer", "admin"],
    default: null
  },
  cancellationReason: { type: String, trim: true },

  originalDate: { type: Date },
  originalTime: { type: String },
  rescheduledAt: { type: Date },

  adminNotes: { type: String, trim: true },

}, { timestamps: true });

bookingSchema.pre("validate", function () {
  if (!this.bookingReference) {
    this.bookingReference = generateBookingReference();
  }
});

module.exports = mongoose.model("Booking", bookingSchema);