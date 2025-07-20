const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/BookingController");

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.delete("/:id", cancelBooking);

module.exports = router;
