import express from "express";
import { saveUser } from "../controllers/userController.js";

const router = express.Router();

// Frontend එකෙන් මේ URL එකට POST request එකක් එව්වාම saveUser function එක වැඩ කරනවා
router.post("/save-user", saveUser);

export default router;
