import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel", // Room eka aithi Hotel eka
      required: true,
    },
    name: {
      type: String,
      required: true, // Example: "Ocean View Suite"
    },
    price: {
      normal: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
    },
    description: {
      type: String,
      required: true,
    },
    // --- Capacity & Size ---
    capacity: {
      type: Number, // Maximum people (Frontend: capacity)
      required: true,
    },
    size: {
      type: Number, // Square feet/meters (Frontend: size)
    },
    // --- Room Images ---
    images: {
      type: [String],
    },
    // --- Room Amenities ---
    amenities: {
      type: [String],
      enum: [
        "King Bed",
        "2 Queen Beds",
        "Ocean Balcony",
        "Minibar",
        "Kitchen",
        "Pool Access",
        "Smart TV",
        "Work Desk",
        "Bathtub",
        "Free Wifi",
        "AC",
      ],
    },
    // --- Availability Handling ---
    // Room numbers saha ewa book wela thiyena dates track karanna
    roomNumbers: [
      {
        number: Number,
        unavailableDates: { type: [Date] },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
