import mongoose from "mongoose";

// --- CONSTANTS (Exporting for Controller use) ---
export const HOTEL_TYPES = [
  "Luxury Resort",
  "City Hotel",
  "Chalet",
  "Villa",
  "Apartment",
  "Boutique Hotel",
  "Guest House",
  "Cottage",
  "Hostel",
  "Bungalow",
];

export const HOTEL_AMENITIES = [
  "High-Speed Wifi",
  "Infinity Pool",
  "Luxury Gym",
  "Fine Dining",
  "Spa & Wellness",
  "Bar / Lounge",
  "Free Parking",
  "Air Conditioning",
  "Private Beach",
  "24/7 Concierge",
  "Meeting Rooms",
  "Elevator",
];

export const HOTEL_FEATURES = [
  "Private Beach Access",
  "24/7 Room Service",
  "Airport Shuttle",
  "Kids Club",
  "Water Sports Center",
  "Cinema Room",
  "Pet Friendly",
  "Wheelchair Accessible",
];

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: HOTEL_TYPES, // Validation added
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    price: {
      normal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    amenities: {
      type: [String],
      enum: HOTEL_AMENITIES,
    },
    features: {
      type: [String],
      enum: HOTEL_FEATURES,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rooms: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
