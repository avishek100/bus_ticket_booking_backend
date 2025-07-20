const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
    routeName: {
        type: String,
        required: [true, "Route name is required"],
        trim: true,
    },
    startPoint: {
        type: String,
        required: [true, "Start point is required"],
        trim: true,
    },
    endPoint: {
        type: String,
        required: [true, "End point is required"],
        trim: true,
    },
    distance: {
        type: Number,
        required: [true, "Distance is required"],
        min: [1, "Distance must be greater than 0"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Route", RouteSchema);
