import express from "express";
import {
  createHotel,
  getHotel,
  getHotels,
  getHotelAmenities,
} from "../controllers/hotelController.js";
import { requireAuth } from "../middleware/authMiddleware.js"; // Clerk Auth

const router = express.Router();

// GET routes (Public)
router.get("/", getHotels); // Search works here
router.get("/find/:id", getHotel);
router.get("/amenities", getHotelAmenities); // For Admin form

// POST routes (Admin Only - Protected)
// මෙතනට පස්සේ අපි checkAdmin කියලා middleware එකක් දාන්න ඕන, දැනට requireAuth තියමු.
router.post("/", requireAuth, createHotel);

export default router;
