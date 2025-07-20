const Booking = require("../models/booking");
const Bus = require("../models/Bus");

// ✅ Create a New Booking
exports.createBooking = async (req, res) => {
  try {
    const { busId, boardingPoint, selectedSeats, totalFare, userDetails, paymentMethod } = req.body;

    // ✅ Check if bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    // ✅ Check if seats are available
    let updatedSeats = bus.seats.map((seat) => {
      if (selectedSeats.includes(seat.number)) {
        if (seat.booked) {
          return res.status(400).json({ success: false, message: `Seat ${seat.number} is already booked` });
        }
        return { ...seat, booked: true };
      }
      return seat;
    });

    // ✅ Save booking in database
    const booking = await Booking.create({
      bus: busId,
      userDetails,
      selectedSeats,
      boardingPoint,
      totalFare,
      paymentMethod,
    });

    // ✅ Update booked seats in bus model
    bus.seats = updatedSeats;
    await bus.save();

    res.status(201).json({
      success: true,
      message: "Booking successful",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus");
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

// ✅ Get Booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("bus");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch booking" });
  }
};

// ✅ Cancel a Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // ✅ Free up the booked seats in Bus model
    const bus = await Bus.findById(booking.bus);
    if (bus) {
      bus.seats = bus.seats.map((seat) => {
        if (booking.selectedSeats.includes(seat.number)) {
          return { ...seat, booked: false };
        }
        return seat;
      });
      await bus.save();
    }

    res.status(200).json({ success: true, message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cancel booking" });
  }
};
