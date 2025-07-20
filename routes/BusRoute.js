const express = require("express");
const router = express.Router();
const { 
    findAll, 
    save, 
    findById, 
    deleteById, 
    update, 
    searchBuses, 
    getSeatsByBusId, 
    bookSeats 
} = require("../controllers/BusController"); // ✅ Import seat-related functions

// ✅ Bus CRUD routes
router.get("/", findAll);      // Get all buses
router.post("/", save);        // Create a new bus
router.get("/:id", findById);  // Get a bus by ID
router.delete("/:id", deleteById); // Delete a bus
router.put("/:id", update);    // Update a bus

// ✅ Search for buses based on route & date
router.get("/bus-search/search", searchBuses);

// ✅ Seat selection routes
router.get("/:busId/seats", getSeatsByBusId); // Get available seats for a bus
router.post("/:busId/book", bookSeats);       // Book selected seats

module.exports = router;
