const asyncHandler = require("../middleware/async");
const { protect, authorize } = require("../middleware/auth");
const Customer = require("../models/customer");
const path = require("path");
const fs = require("fs");


exports.getCustomers = asyncHandler(async (req, res, next) => {
  

  const customers = await Customer.find({});
  res.status(200).json({
    success: true,
    count: customers.length,
    data: customers,
  });
});

// @desc    Get single customer (Self or Admin)
// @route   GET /api/v1/customers/:id
// @access  Private
exports.getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res.status(404).json({ message: `Customer not found with ID ${req.params.id}` });
  }

  

  res.status(200).json({
    success: true,
    data: customer,
  });
});

// @desc    Register a new customer
// @route   POST /api/v1/customers/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { fname, lname, phone, email, password, role, image } = req.body;

  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    return res.status(400).json({ message: "Customer already exists" });
  }

  // Restrict role assignment: only "customer" or "admin" allowed
  const assignedRole = role && role === "admin" ? "admin" : "customer";

  const customer = await Customer.create({
    fname,
    lname,
    phone,
    email,
    password,
    image,
    role: assignedRole,
  });

  // Remove password from the response
  const { password: _, ...customerData } = customer.toObject();

  res.status(201).json({
    success: true,
    message: "Customer registered successfully",
    customer: customerData,
  });
});


// @desc    Login customer
// @route   POST /api/v1/customers/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide an email and password" });
  }

  const customer = await Customer.findOne({ email }).select("+password");

  if (!customer || !(await customer.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  sendTokenResponse(customer, 200, res);
});

// @desc Upload Single Image (Only for authenticated users)
// @route POST /api/v1/customers/uploadImage
// @access Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }

  // ✅ Update customer image field in database
  const customer = await Customer.findById(req.user.id);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  customer.image = req.file.filename;
  await customer.save();

  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

// ✅ Get token from model, create cookie, and send response
const sendTokenResponse = (customer, statusCode, res) => {
  const token = customer.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  // Use secure cookies in production
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    role: customer.role,
  });
};
