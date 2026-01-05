import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true, // Example: "Luxury Resort", "Villa", "Hotel"
    },
    location: {
      type: String,
      required: true, // Example: "Maldives, South Atoll"
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
    // --- Images ---
    images: {
      type: [String], // Image URLs array ekak
    },
    // --- Pricing Section (Oya illapu widiyata) ---
    price: {
      normal: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0, // Discount ekak nathnam 0
      },
    },
    // --- Ratings (Frontend eke thibuna key fields) ---
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: {
      type: Number, // Review count eka
      default: 0,
    },
    // --- Amenities (Selection List 1) ---
    amenities: {
      type: [String],
      enum: [
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
      ],
    },
    // --- What this place offers (Selection List 2) ---
    features: {
      type: [String],
      enum: [
        "Private Beach Access",
        "24/7 Room Service",
        "Airport Shuttle",
        "Kids Club",
        "Water Sports Center",
        "Cinema Room",
        "Butler Service",
        "BBQ Facilities",
        "Currency Exchange",
        "Laundry Service",
      ],
    },
    // --- Relationships ---
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room", // Room model eka link karanawa
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
