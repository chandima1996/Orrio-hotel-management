import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  getRoomsByHotel, // මේක import කරන්න අමතක කරන්න එපා
  updateRoom,
} from "../controllers/roomController.js";

const router = express.Router();

// CREATE
router.post("/:hotelid", createRoom);

// UPDATE
router.put("/:id", updateRoom);

// DELETE
router.delete("/:id/:hotelid", deleteRoom);

// GET ROOMS BY HOTEL ID (Frontend එකේ Single Hotel Page එකට ඕනේ කරන එක)
router.get("/hotel/:hotelid", getRoomsByHotel);

// GET SINGLE ROOM
router.get("/:id", getRoom);

// GET ALL ROOMS (Admin side එකට වගේ ඕනේ වෙයි)
router.get("/", getRooms);

export default router;
