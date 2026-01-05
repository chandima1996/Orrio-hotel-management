import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import morgan from "morgan";
import cron from "node-cron";
import connectDB from "./config/db.js";

// Models
import Booking from "./models/Booking.js";

// Routes Imports
import hotelRoutes from "./routes/hotels.js";
import roomRoutes from "./routes/rooms.js";
// (පහත routes අපි ඊළඟට හදමු, දැනට import කරලා තියමු)
// import userRoutes from './routes/users.js';
// import bookingRoutes from './routes/bookings.js';

// Configuration
dotenv.config();
const app = express();
const httpServer = createServer(app); // For Socket.io

// 1. Database Connection
connectDB();

// 2. Middlewares (Industry Standard)
app.use(express.json()); // Body Parser
app.use(helmet()); // Security Headers
app.use(morgan("dev")); // Logger

// CORS Configuration (Frontend එක Backend එකත් එක්ක කතා කරන්න)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Vite Frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 3. Real-time Setup (Socket.io)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Socket Connection Logic
io.on("connection", (socket) => {
  console.log(`⚡ User Connected: ${socket.id}`);

  // Example: Room availability update
  socket.on("booking_made", (data) => {
    io.emit("refresh_dates", data); // Broadcast to all users to update calendar
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Make 'io' accessible in routes (req.io කියලා routes ඇතුලේ පාවිච්චි කරන්න පුළුවන්)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 4. API Routes
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/bookings", bookingRoutes);

// Base Route
app.get("/", (req, res) => {
  res.send("💎 Orrio Luxury Hotel Management API is Live");
});

// 5. CRON JOB: Auto Cancel 'Pay Later' Bookings (Every Hour)
cron.schedule("0 * * * *", async () => {
  console.log("⏳ Running Auto-Cancel Cron Job for Orrio...");
  try {
    const now = new Date();
    // සොයනවා: Pay Later + Unpaid + Pending + Expired
    const expiredBookings = await Booking.updateMany(
      {
        paymentMethod: "pay_later",
        paymentStatus: "unpaid",
        status: "pending",
        expireAt: { $lt: now }, // Expire time එක දැනට වඩා අඩුයි නම්
      },
      { $set: { status: "cancelled" } }
    );

    if (expiredBookings.modifiedCount > 0) {
      console.log(
        `🚫 Auto-Cancelled ${expiredBookings.modifiedCount} expired bookings.`
      );
      // මෙතනදි ඕන නම් Socket එකෙන් Admin ට notification එකක් යවන්නත් පුළුවන්
      io.emit("admin_notification", {
        message: `${expiredBookings.modifiedCount} bookings auto-cancelled due to non-payment.`,
      });
    }
  } catch (error) {
    console.error("Cron Job Error:", error);
  }
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

// 7. Server Start
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Orrio Server running on port ${PORT}`);
});
