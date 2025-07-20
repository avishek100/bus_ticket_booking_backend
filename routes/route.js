const express = require("express");
const router = express.Router();
const {
    getAllRoutes,
    getRouteById,
    createRoute,
    updateRoute,
    deleteRoute
} = require("../controllers/route");

// Middleware to protect admin routes (Implement authentication later)
const { protect, authorize } = require("../middleware/auth"); // Use for role-based access control

// Public Routes (Anyone can access)
router.get("/", getAllRoutes);
router.get("/:id", getRouteById);

// Private Admin Routes (Only Admins can create, update, and delete routes)
router.post("/", createRoute);
router.put("/:id",updateRoute);
router.delete("/:id", deleteRoute);

module.exports = router;
