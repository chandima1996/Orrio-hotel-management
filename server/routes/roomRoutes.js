import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  getRoomsByHotel,
  updateRoom,
  getRoomConstants, // <--- Import
} from "../controllers/roomController.js";

const router = express.Router();

// GET CONSTANTS (Must be first to avoid ID conflict)
router.get("/constants", getRoomConstants);

// CREATE
router.post("/:hotelid", createRoom);

// UPDATE
router.put("/:id", updateRoom);

// DELETE
router.delete("/:id/:hotelid", deleteRoom);

// GET ROOMS BY HOTEL ID
router.get("/hotel/:hotelid", getRoomsByHotel);

// GET SINGLE ROOM
router.get("/:id", getRoom);

// GET ALL ROOMS
router.get("/", getRooms);

export default router;
