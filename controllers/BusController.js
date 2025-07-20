const Bus = require("../models/Bus");
const Route = require("../models/Route");
const createSeats = require("../models/seatGenerator"); // Import seat generator

// @desc    Get all buses
// @route   GET /api/v1/bus
const findAll = async (req, res) => {
    try {
        const buses = await Bus.find().populate("route"); // ✅ Populates route details
        res.status(200).json({ success: true, data: buses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch buses" });
    }
};

// @desc    Create a new bus (with seats)
// @route   POST /api/v1/bus
const save = async (req, res) => {
    try {
        const { busNumber, driverName, route, capacity, busType, date } = req.body;
        if (!busNumber || !driverName || !route || !capacity || !busType || !date) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Ensure seat generation based on capacity
        const seats = createSeats(capacity);

        // Save bus with correct seats
        const bus = new Bus({
            busNumber,
            driverName,
            route,
            capacity,
            busType,
            date: new Date(date),
            seats, // Ensure seats match capacity
        });

        await bus.save();
        res.status(201).json({ success: true, data: bus });
    } catch (error) {
        console.error("Error saving bus:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to add bus" });
    }
};
// @desc    Get bus by ID (includes seat info)
// @route   GET /api/v1/bus/:id
const findById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id).populate("route");
        if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

        res.status(200).json({ success: true, data: bus, seats: bus.seats });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch bus" });
    }
};

// @desc    Delete bus by ID
// @route   DELETE /api/v1/bus/:id
const deleteById = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

        res.status(200).json({ success: true, message: "Bus deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete bus" });
    }
};

// @desc    Update bus details (does not modify seats directly)
// @route   PUT /api/v1/bus/:id
const update = async (req, res) => {
    try {
        const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("route");
        if (!updatedBus) return res.status(404).json({ success: false, message: "Bus not found" });

        res.status(200).json({ success: true, data: updatedBus });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update bus" });
    }
};

// @desc    Search for buses based on route and date
// @route   GET /api/v1/bus-search/search
const searchBuses = async (req, res) => {
    try {
        console.log("🟢 Received Query Params:", req.query);
        const { startPoint, endPoint, date } = req.query;
        if (!startPoint || !endPoint || !date) {
            return res.status(400).json({ success: false, message: "Please provide startPoint, endPoint, and date." });
        }

        const normalizedStart = startPoint.toLowerCase();
        const normalizedEnd = endPoint.toLowerCase();
        const selectedDate = new Date(date);
        selectedDate.setUTCHours(0, 0, 0, 0);
        const nextDate = new Date(selectedDate);
        nextDate.setUTCDate(selectedDate.getUTCDate() + 1);

        console.log("🔍 Searching routes with:", normalizedStart, normalizedEnd, selectedDate);

        const matchingRoutes = await Route.find({
            startPoint: { $regex: new RegExp(`^${normalizedStart}$`, "i") },
            endPoint: { $regex: new RegExp(`^${normalizedEnd}$`, "i") }
        }).select("_id");

        console.log("🔍 Found Routes:", matchingRoutes);

        if (matchingRoutes.length === 0) {
            return res.status(200).json({ success: true, buses: [] });
        }

        const routeIds = matchingRoutes.map(route => route._id);

        const buses = await Bus.find({
            route: { $in: routeIds },
            date: { $gte: selectedDate, $lt: nextDate }
        }).populate("route");

        console.log("🚌 Found Buses:", buses);
        res.status(200).json({ success: true, buses });
    } catch (error) {
        console.error("❌ Error searching buses:", error.stack);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// @desc    Fetch seats for a specific bus
// @route   GET /api/v1/bus/:busId/seats
const getSeatsByBusId = async (req, res) => {
    try {
        const { busId } = req.params;
        const bus = await Bus.findById(busId);

        if (!bus) {
            return res.status(404).json({ success: false, message: "Bus not found" });
        }

        res.status(200).json({ success: true, seats: bus.seats });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch seats" });
    }
};

// @desc    Book seats for a specific bus
// @route   POST /api/v1/bus/:busId/book
const bookSeats = async (req, res) => {
    try {
        const { busId } = req.params;
        const { seats } = req.body; // Array of seat numbers, e.g., ["A1", "B2"]

        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

        let updatedSeats = bus.seats.map((seat) => {
            if (seats.includes(seat.number)) {
                if (seat.booked) {
                    return seat; // Skip if already booked
                }
                return { ...seat, booked: true };
            }
            return seat;
        });

        bus.seats = updatedSeats;
        await bus.save();

        res.status(200).json({ success: true, message: "Seats booked successfully", seats: updatedSeats });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to book seats" });
    }
};

module.exports = {
    findAll,
    save,
    findById,
    deleteById,
    update,
    searchBuses,
    getSeatsByBusId,
    bookSeats,
};
