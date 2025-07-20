const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// ✅ Load env file
dotenv.config({
  path: "./config/config.env",
});

// ✅ Connect to database
connectDB();

// ✅ Enable CORS (Fix OPTIONS 204 No Content issue)
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Dev logging middleware (Only in development mode)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Security Middleware
app.use(mongoSanitize());
app.use(helmet()); // Prevent security vulnerabilities
app.use(xss()); // Prevent cross-site scripting (XSS) attacks

// ✅ Fix "Cross-Origin Resource Policy" Issue
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// ✅ Set static folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Import Routes
const authRoutes = require("./routes/customer");
const routeRoutes = require("./routes/route");
const busRoutes = require("./routes/BusRoute");
const khaltiRoutes = require("./routes/khaltiRoutes");
const bookingRoutes = require("./routes/BookingRoute"); // ✅ Fix import (Ensure file exists)

// ✅ Mount Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/route", routeRoutes);
app.use("/api/v1/bus", busRoutes);
app.use("/api/khalti", khaltiRoutes);

app.use("/api/v1/bookings", bookingRoutes); // ✅ Ensure this is correct

// ✅ Export `app` for testing
module.exports = app;

// ✅ Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
  );

  // ✅ Handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
  });
}
