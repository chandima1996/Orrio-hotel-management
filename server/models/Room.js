import mongoose from "mongoose";

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
    description: {
      type: String,
      required: true,
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
    capacity: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
    },
    images: {
      type: [String],
    },
    // --- Room Amenities ---
    amenities: {
      type: [String],
      // මෙන්න මෙතනට අපි "Queen Bed" එකතු කරා
      enum: [
        "King Bed",
        "Queen Bed", // <--- NEW ADDITION
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
