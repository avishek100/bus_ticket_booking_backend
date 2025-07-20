const { string } = require("joi");
const mongoose = require("mongoose")
const ticktSchema = new mongoose.Schema({
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "schedules"
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "buses"
    },

    seatnumber: {
        type: String,
        required: true
    },
    bookingstatus: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    issuedat: {
        type: Date,
        default: Date.now
    }


})
const Ticket = mongoose.model("tickets", ticktSchema);

module.exports = Ticket;