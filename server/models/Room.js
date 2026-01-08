import mongoose from "mongoose";

// --- CONSTANTS ---
export const ROOM_TYPES = [
  "Single Room",
  "Double Room",
  "Twin Room",
  "King Room",
  "Queen Room",
  "Deluxe Room",
  "Suite",
  "Presidential Suite",
  "Penthouse",
  "Studio Apartment",
  "Villa",
  "Cabana",
  "Family Room",
];

export const ROOM_AMENITIES = [
  "King Bed",
  "Queen Bed",
  "2 Queen Beds",
  "Twin Beds",
  "Ocean Balcony",
  "City View",
  "Garden View",
  "Minibar",
  "Kitchen",
  "Kitchenette",
  "Pool Access",
  "Smart TV",
  "Work Desk",
  "Bathtub",
  "Jacuzzi",
  "Free Wifi",
  "AC",
  "Room Service",
  "Hair Dryer",
  "Ironing Facilities",
];

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // --- Added Type Field ---
    type: {
      type: String,
      enum: ROOM_TYPES,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      normal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
    },
    capacity: {
      type: Number,
      required: true,
    },
    size: {
      type: Number, // in sq meters/feet
    },
    images: {
      type: [String],
    },
    amenities: {
      type: [String],
      enum: ROOM_AMENITIES,
    },
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
