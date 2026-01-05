import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true }, // AI search එකට මේක වැදගත්
    location: { type: String, required: true },
    address: { type: String, required: true },

    type: {
      type: String,
      enum: ["3 Star", "5 Star", "7 Star", "Apartment", "Villa"],
      required: true,
    },

    // Pre-defined amenities (Pool, Gym, WiFi etc.)
    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String], // Array of Image URLs
      required: true,
    },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    cheapestPrice: { type: Number, required: true }, // Sorting වලට ලේසියි
    featured: { type: Boolean, default: false }, // Top Trending වලට
  },
  { timestamps: true }
);

// --- AI Search Optimization ---
// නම, location එක, විස්තරය සහ පහසුකම් වලින් search කරන්න පුළුවන් විදියට index කරනවා.
hotelSchema.index({
  name: "text",
  location: "text",
  description: "text",
  amenities: "text",
});

export default mongoose.model("Hotel", hotelSchema);
