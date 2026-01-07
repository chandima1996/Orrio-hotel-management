import express from "express";
import {
  createBooking,
  getUserBookings,
  confirmPayment,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create new booking
router.post("/", createBooking);

// Get bookings by User ID
router.get("/user/:userId", getUserBookings);

// Confirm Payment (Pay Later -> Confirmed)
router.put("/pay/:id", confirmPayment);

export default router;
