const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus", // Reference to Bus Model
    required: true,
  },
  userDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  selectedSeats: {
    type: [String], // Array of seat numbers
    required: true,
  },
  boardingPoint: {
    type: String,
    required: true,
  },
  totalFare: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Khalti", "Esewa", "Cash"],
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
