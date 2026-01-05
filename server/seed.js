import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "./models/Hotel.js";

dotenv.config();

// 1. Database සම්බන්ධ කරගැනීම
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("--------------- DB Connection Successful! ---------------")
  )
  .catch((err) => {
    console.log("DB Connection Error:");
    console.log(err);
  });

// 2. Dummy Data සකස් කිරීම (Model Enums වලට 100% ගැලපෙන ලෙස)
const hotels = [
  {
    name: "Crystal Sands Resort",
    type: "Luxury Resort",
    location: "Maldives, South Atoll",
    address: "No 12, Paradise Island, Maldives",
    contact: "+960 123 4567",
    email: "info@crystalsands.com",
    description:
      "Experience the ultimate luxury at Crystal Sands Resort with breathtaking ocean views and world-class service.",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000",
    ],
    price: {
      normal: 450,
      discount: 50, // Final: $400
    },
    rating: 4.8,
    reviews: 128,
    // Enum: "High-Speed Wifi", "Infinity Pool", "Luxury Gym", "Fine Dining", "Spa & Wellness", "Bar / Lounge", "Free Parking", "Air Conditioning", "Private Beach", "24/7 Concierge"
    amenities: [
      "Infinity Pool",
      "Private Beach",
      "Spa & Wellness",
      "Fine Dining",
      "High-Speed Wifi",
    ],
    // Enum: "Private Beach Access", "24/7 Room Service", "Airport Shuttle", "Kids Club", "Water Sports Center", "Cinema Room", "Butler Service", "BBQ Facilities", "Currency Exchange", "Laundry Service"
    features: ["Airport Shuttle", "Water Sports Center", "Butler Service"],
    featured: true,
  },
  {
    name: "Blue Lagoon Villa",
    type: "Villa",
    location: "Bali, Indonesia",
    address: "Ubud, Bali, Indonesia",
    contact: "+62 123 4567",
    email: "stay@bluelagoon.com",
    description:
      "A serene escape in the heart of Bali, surrounded by lush greenery and calming waters.",
    images: [
      "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=1000",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000",
    ],
    price: {
      normal: 200,
      discount: 0, // Final: $200
    },
    rating: 4.5,
    reviews: 85,
    amenities: [
      "High-Speed Wifi",
      "Air Conditioning",
      "Private Beach",
      "Free Parking",
    ],
    features: ["BBQ Facilities", "Laundry Service"],
    featured: true,
  },
  {
    name: "Urban Heights",
    type: "Hotel",
    location: "Colombo, Sri Lanka",
    address: "Galle Road, Colombo 03",
    contact: "+94 11 234 5678",
    email: "reservations@urbanheights.lk",
    description:
      "Modern luxury in the city center. Perfect for business travelers and tourists alike.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
    ],
    price: {
      normal: 120,
      discount: 10, // Final: $110
    },
    rating: 4.2,
    reviews: 210,
    amenities: [
      "Luxury Gym",
      "Bar / Lounge",
      "24/7 Concierge",
      "High-Speed Wifi",
    ],
    features: ["Currency Exchange", "Laundry Service", "24/7 Room Service"],
    featured: false,
  },
  {
    name: "Mountain Mist Chalet",
    type: "Chalet",
    location: "Ella, Sri Lanka",
    address: "Ella Rock Road, Ella",
    contact: "+94 77 123 9999",
    email: "relax@mountainmist.lk",
    description:
      "Wake up to the misty mountains and enjoy a cozy stay with nature.",
    images: [
      "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?q=80&w=1000",
    ],
    price: {
      normal: 80,
      discount: 0, // Final: $80
    },
    rating: 4.7,
    reviews: 320,
    amenities: ["Free Parking", "High-Speed Wifi"],
    features: ["BBQ Facilities"],
    featured: false,
  },
];

// 3. Database එකට Data දාන function එක
const seedDB = async () => {
  try {
    // පරණ Data මකන්න
    await Hotel.deleteMany({});
    console.log("🗑️  Old hotels removed...");

    // අලුත් Data දාන්න
    await Hotel.insertMany(hotels);
    console.log("✅ New hotels added successfully!");

    // Connection එක close කරන්න
    mongoose.connection.close();
    console.log("👋 Connection Closed.");
  } catch (err) {
    console.log("❌ Error Seeding Database:");
    console.log(err);
  }
};

// Function එක Run කරන්න
seedDB();
