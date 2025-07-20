const Route = require("../models/Route");

// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        res.status(200).json({ success: true, count: routes.length, data: routes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get a single route by ID
// @route   GET /api/routes/:id
// @access  Public
exports.getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ success: false, message: "Route not found" });
        }
        res.status(200).json({ success: true, data: route });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Create a new route
// @route   POST /api/routes
// @access  Private (Admin Only)
exports.createRoute = async (req, res) => {
    try {
        const { routeName, startPoint, endPoint, distance } = req.body;

        if (!routeName || !startPoint || !endPoint || !distance) {
            return res.status(400).json({ success: false, message: "Please provide all fields" });
        }

        const newRoute = await Route.create({
            routeName,
            startPoint,
            endPoint,
            distance,
        });

        res.status(201).json({ success: true, data: newRoute });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Update a route by ID
// @route   PUT /api/routes/:id
// @access  Private (Admin Only)
exports.updateRoute = async (req, res) => {
    try {
        const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedRoute) {
            return res.status(404).json({ success: false, message: "Route not found" });
        }

        res.status(200).json({ success: true, data: updatedRoute });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete a route by ID
// @route   DELETE /api/routes/:id
// @access  Private (Admin Only)
exports.deleteRoute = async (req, res) => {
    try {
        const deletedRoute = await Route.findByIdAndDelete(req.params.id);
        if (!deletedRoute) {
            return res.status(404).json({ success: false, message: "Route not found" });
        }

        res.status(200).json({ success: true, message: "Route deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
