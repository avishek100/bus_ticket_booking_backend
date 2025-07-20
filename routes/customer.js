const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/uploads"); // ✅ Correct import




const {
  getCustomers,
  getCustomer,
  register,
  login,
  uploadImage,
} = require("../controllers/customer");

// ✅ Public Routes
router.post("/register", register);
router.post("/login", login);

// ✅ Private Routes
router.get("/customers", getCustomers); // Admin Only
router.get("/customer/:id", getCustomer); // User or Admin
router.post("/uploadImage", upload.single("profilePicture"), uploadImage); // User Only

module.exports = router;
