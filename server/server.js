import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http"; // Socket.io වලට ඕන
import { Server } from "socket.io";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const httpServer = createServer(app); // HTTP Server for Socket.io

// --- Middleware Setup ---
app.use(express.json()); // Body parser
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL (Vite default)
    credentials: true,
  })
);
app.use(helmet()); // Security
app.use(morgan("dev")); // Logging

// --- Socket.io Setup (Real-time) ---
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// --- Routes Placeholder ---
app.get("/", (req, res) => {
  res.send("Orrio Hotel Management API is Running...");
});

// Clerk Auth Error Handling (Specific Fix)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
