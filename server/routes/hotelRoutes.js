import express from "express";
import {
  createHotel,
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
  getHotelConstants, // <--- Import
} from "../controllers/hotelController.js";

const router = express.Router();

// GET CONSTANTS (Must be first)
router.get("/constants", getHotelConstants);

// CREATE
router.post("/", createHotel);

// UPDATE
router.put("/:id", updateHotel);

// DELETE
router.delete("/:id", deleteHotel);

// GET SINGLE
router.get("/find/:id", getHotel);

// GET ALL
router.get("/", getHotels);

export default router;
