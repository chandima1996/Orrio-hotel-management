import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "./models/Hotel.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("--------------- DB Connection Successful! ---------------")
  )
  .catch((err) => console.log(err));

const hotels = [
  {
    name: "Crystal Sands Resort",
    type: "Luxury Resort",
    // New Fields
    country: "Maldives",
    city: "South Atoll",
    address: "No 12, Paradise Island",
    contact: "+960 123 4567",
    email: "info@crystalsands.com",
    description:
      "Experience the ultimate luxury at Crystal Sands Resort with breathtaking ocean views.",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000",
    ],
    price: { normal: 450, discount: 50 },
    rating: 4.8,
    reviews: 128,
    amenities: [
      "Infinity Pool",
      "Private Beach",
      "Spa & Wellness",
      "Fine Dining",
      "High-Speed Wifi",
    ],
    features: ["Airport Shuttle", "Water Sports Center", "Butler Service"],
    featured: true,
  },
  {
    name: "Blue Lagoon Villa",
    type: "Villa",
    country: "Indonesia",
    city: "Bali",
    address: "Ubud Street, Bali",
    contact: "+62 123 4567",
    email: "stay@bluelagoon.com",
    description:
      "A serene escape in the heart of Bali, surrounded by lush greenery.",
    images: [
      "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=1000",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000",
    ],
    price: { normal: 200, discount: 0 },
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
    country: "Sri Lanka",
    city: "Colombo",
    address: "Galle Road, Colombo 03",
    contact: "+94 11 234 5678",
    email: "reservations@urbanheights.lk",
    description:
      "Modern luxury in the city center. Perfect for business travelers.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
    ],
    price: { normal: 120, discount: 10 },
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
    country: "Sri Lanka",
    city: "Ella",
    address: "Ella Rock Road",
    contact: "+94 77 123 9999",
    email: "relax@mountainmist.lk",
    description:
      "Wake up to the misty mountains and enjoy a cozy stay with nature.",
    images: [
      "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?q=80&w=1000",
    ],
    price: { normal: 80, discount: 0 },
    rating: 4.7,
    reviews: 320,
    amenities: ["Free Parking", "High-Speed Wifi"],
    features: ["BBQ Facilities"],
    featured: false,
  },
];

const seedDB = async () => {
  try {
    await Hotel.deleteMany({});
    console.log("🗑️  Old hotels removed...");
    await Hotel.insertMany(hotels);
    console.log("✅ New hotels added successfully!");
    mongoose.connection.close();
    console.log("👋 Connection Closed.");
  } catch (err) {
    console.log("❌ Error Seeding Database:", err);
  }
};

seedDB();
