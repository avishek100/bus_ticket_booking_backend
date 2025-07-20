const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
    number: { type: String, required: true }, // e.g., A1, A2, B1, B2
    booked: { type: Boolean, default: false }, // True if seat is booked
});

const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    driverName: {
        type: String,
        required: true,
        trim: true
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    busType: {
        type: String,
        required: true,
        enum: ["AC", "Non-AC", "Luxury", "Sleeper"]
    },
    date: {
        type: Date,
        required: true
    },
    seats: [seatSchema] // Embedded seat details in each bus document
}, { timestamps: true });

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
