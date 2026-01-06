import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("--- DB Connected for Room Seeding ---"))
  .catch((err) => console.log(err));

const seedRooms = async () => {
  try {
    // 1. පරණ Rooms මකා දමන්න
    await Room.deleteMany({});
    console.log("🗑️  Old rooms removed...");

    // 2. දැනට තිබෙන Hotels ලබා ගැනීම (ID එක ගැනීමට)
    const hotels = await Hotel.find({});

    if (hotels.length === 0) {
      console.log("❌ No hotels found! Run seedHotels.js first.");
      return;
    }

    const roomData = [];

    // --- Hotel 1: Crystal Sands Resort (Luxury) ---
    const resortHotel = hotels.find((h) => h.name === "Crystal Sands Resort");
    if (resortHotel) {
      roomData.push(
        {
          hotelId: resortHotel._id,
          name: "Ocean View Deluxe Suite",
          description:
            "A spacious suite with a panoramic view of the Indian Ocean. Includes a private balcony.",
          price: { normal: 450, discount: 50 },
          capacity: 2,
          size: 650,
          images: [
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000",
          ],
          amenities: [
            "King Bed",
            "Ocean Balcony",
            "Bathtub",
            "Free Wifi",
            "AC",
            "Minibar",
          ],
          roomNumbers: [{ number: 101 }, { number: 102 }],
        },
        {
          hotelId: resortHotel._id,
          name: "Presidential Pool Villa",
          description:
            "Ultimate luxury with a private infinity pool and direct beach access.",
          price: { normal: 1200, discount: 100 },
          capacity: 4,
          size: 1500,
          images: [
            "https://images.unsplash.com/photo-1590490360182-f33d5e6a385c?q=80&w=1000",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000",
          ],
          amenities: [
            "2 Queen Beds",
            "Pool Access",
            "Kitchen",
            "Smart TV",
            "Work Desk",
            "Free Wifi",
          ],
          roomNumbers: [{ number: 201 }],
        }
      );
    }

    // --- Hotel 2: Blue Lagoon Villa (Nature) ---
    const villaHotel = hotels.find((h) => h.name === "Blue Lagoon Villa");
    if (villaHotel) {
      roomData.push({
        hotelId: villaHotel._id,
        name: "Garden View Villa",
        description: "Surrounded by lush greenery, perfect for nature lovers.",
        price: { normal: 200, discount: 0 },
        capacity: 2,
        size: 500,
        images: [
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1000",
        ],
        amenities: ["King Bed", "Free Wifi", "AC", "Work Desk"],
        roomNumbers: [{ number: 10 }],
      });
    }

    // --- Hotel 3: Urban Heights (City) ---
    const cityHotel = hotels.find((h) => h.name === "Urban Heights");
    if (cityHotel) {
      roomData.push({
        hotelId: cityHotel._id,
        name: "Executive City Room",
        description:
          "Modern room designed for business travelers with city views.",
        price: { normal: 120, discount: 10 },
        capacity: 2,
        size: 350,
        images: [
          "https://images.unsplash.com/photo-1631049307204-152f686a2e40?q=80&w=1000",
        ],
        amenities: ["Queen Bed", "Free Wifi", "AC", "Smart TV", "Work Desk"],
        roomNumbers: [{ number: 305 }, { number: 306 }, { number: 307 }],
      });
    }

    // 3. Insert Rooms
    const savedRooms = await Room.insertMany(roomData);
    console.log(`✅ ${savedRooms.length} Rooms added successfully!`);

    // (Optional) Update Hotel models with room IDs if necessary
    // නමුත් අපි හදන අලුත් controller method එක නිසා මෙය අනිවාර්ය නැත.

    mongoose.connection.close();
    console.log("👋 Connection Closed.");
  } catch (err) {
    console.log("❌ Error Seeding Rooms:", err);
  }
};

seedRooms();
