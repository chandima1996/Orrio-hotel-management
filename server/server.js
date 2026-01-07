import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js"; // 1. Import
import roomRoutes from "./routes/roomRoutes.js"; // 2. Import
import bookingRoutes from "./routes/bookingRoutes.js"; // 2. Import

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes); // 3. Use Hotel Routes
app.use("/api/rooms", roomRoutes); // 4. Use Room Routes
app.use("/api/bookings", bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
