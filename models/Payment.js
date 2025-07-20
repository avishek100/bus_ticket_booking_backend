const { string } = require("joi");
const mongoose = require("mongoose")
const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookings"
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    },

    amount: {
        type: Number,
        required: true
    },
    paymentmethod: {
        type: String,
        required: true
    },
    paymentstatus: {
        type: String,
        required: true
    },
    paidAt: {
        type: Date,
        default: Date.now
    }


})
const Payment = mongoose.model("payments", paymentSchema);

module.exports = Payment;