const { string } = require("joi");
const mongoose = require("mongoose")
const feedbackSchema = new mongoose.Schema({
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "buses"
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    },

    rating: {
        type: Number,
        required: true

    },
    comment: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }



})
const Feedback = mongoose.model("feedbacks", feedbackSchema);

module.exports = Feedback;