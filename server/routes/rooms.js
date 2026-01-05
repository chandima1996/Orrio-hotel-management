import express from "express";
import { createRoom, getRoomsByHotel } from "../controllers/roomController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST - Create Room (Linked to a Hotel ID)
router.post("/:hotelid", requireAuth, createRoom);

// GET - Get all rooms for a specific hotel
router.get("/hotel/:hotelId", getRoomsByHotel);

export default router;
