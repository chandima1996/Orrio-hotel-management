import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
} from "../controllers/roomController.js";

const router = express.Router();

// CREATE (කාමරයක් හදන්න හෝටල් ID එක ඕනේ)
router.post("/:hotelid", createRoom);

// UPDATE
router.put("/:id", updateRoom);

// DELETE (කාමරයක් මකන්න හෝටල් ID එකත් ඕනේ - ලිස්ට් එක update කරන්න)
router.delete("/:id/:hotelid", deleteRoom);

// GET SINGLE
router.get("/:id", getRoom);

// GET ALL
router.get("/", getRooms);

export default router;
