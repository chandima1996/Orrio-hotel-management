import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Clerk User ID
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }], // Book කරපු කාමර

    guestDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      nic: { type: String }, // User ID number
      address: { type: String },
    },

    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "pay_later"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },

    // Pay Later Logic එකට (Booking එක දාලා පැය 24 කින් කල් ඉකුත් වෙන්න)
    expireAt: {
      type: Date,
      default: function () {
        if (this.paymentMethod === "pay_later") {
          return new Date(Date.now() + 24 * 60 * 60 * 1000); // Now + 24 hours
        }
        return null;
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
