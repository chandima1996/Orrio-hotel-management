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
    // --- NEW LOCATION FIELDS ---
    country: {
      type: String,
      required: true, // Example: "Sri Lanka"
    },
    city: {
      type: String,
      required: true, // Example: "Colombo" (Town)
    },
    address: {
      type: String,
      required: true, // Example: "No 10, Galle Road"
    },
    // ---------------------------
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
      normal: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
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
      // Enums ටික එහෙමම තියන්න
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
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
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
