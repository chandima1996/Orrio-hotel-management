import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    title: { type: String, required: true }, // e.g., "Ocean View Deluxe"
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Price per night
    maxPeople: { type: Number, required: true },
    amenities: { type: [String] },
    images: { type: [String] },

    // Room Numbers සහ Booking Availability එක
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
