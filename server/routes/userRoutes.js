import express from "express";
import {
  saveUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/save-user", saveUser); // Login වෙනකොට
router.get("/:clerkId", getUserProfile); // Dashboard එක load වෙනකොට
router.put("/update-profile", updateUserProfile); // Dashboard එකේ Save බටන් එක ඔබනකොට

router.get("/", getAllUsers);

export default router;
