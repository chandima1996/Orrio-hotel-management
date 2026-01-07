import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// --- Helper Function: Assign Room Number ---
const assignRoomNumber = async (roomId, checkIn, checkOut) => {
  const room = await Room.findById(roomId);
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  // කාමරයේ ඇති roomNumbers හරහා ගොස්, එම දිනයන් වලට Book නොවුනු අංකයක් සොයයි
  for (let r of room.roomNumbers) {
    const isUnavailable = r.unavailableDates.some((date) => {
      const d = new Date(date);
      return d >= start && d <= end;
    });

    if (!isUnavailable) {
      // දින පරාසය unavailableDates වලට එකතු කරන්න
      let dates = [];
      let currentDate = new Date(start);
      while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Database එක update කරන්න
      await Room.updateOne(
        { "roomNumbers._id": r._id },
        {
          $push: {
            "roomNumbers.$.unavailableDates": dates,
          },
        }
      );

      return r.number; // හමු වූ කාමර අංකය එවන්න
    }
  }
  return null; // කාමර හිස් නැත්නම්
};

// 1. Create Booking
export const createBooking = async (req, res, next) => {
  const { paymentMethod, roomId, checkIn, checkOut } = req.body;

  try {
    let assignedNum = null;
    let status = "pending";

    // Pay Now නම් කෙලින්ම Confirm කර Room එකක් දෙන්න
    if (paymentMethod === "payNow") {
      status = "confirmed";
      assignedNum = await assignRoomNumber(roomId, checkIn, checkOut);

      if (!assignedNum) {
        return res
          .status(400)
          .json({ message: "No rooms available for selected dates." });
      }
    }

    const newBooking = new Booking({
      ...req.body,
      status,
      assignedRoomNumber: assignedNum,
    });

    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    next(err);
  }
};

// 2. Get User Bookings (With Auto-Cancel Logic)
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate("roomId") // Room විස්තර ගන්න
      .populate("hotelId"); // Hotel විස්තර ගන්න

    const updatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        // --- 24 Hour Cancellation Logic ---
        if (
          booking.status === "pending" &&
          booking.paymentMethod === "payLater"
        ) {
          const bookingTime = new Date(booking.createdAt).getTime();
          const currentTime = Date.now();
          const timeDiff = (currentTime - bookingTime) / (1000 * 60 * 60); // පැය ගණන

          if (timeDiff > 24) {
            booking.status = "cancelled";
            await booking.save();
          }
        }
        return booking;
      })
    );

    res.status(200).json(updatedBookings);
  } catch (err) {
    next(err);
  }
};

// 3. Confirm Payment (Edit Booking)
export const confirmPayment = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json("Booking not found!");

    if (booking.status === "cancelled") {
      return res.status(400).json("Cannot pay for a cancelled booking.");
    }

    // Room එක Assign කරන්න
    const assignedNum = await assignRoomNumber(
      booking.roomId,
      booking.checkIn,
      booking.checkOut
    );

    if (!assignedNum) {
      return res.status(400).json("Sorry, rooms are fully booked now.");
    }

    booking.status = "confirmed";
    booking.paymentMethod = "payNow"; // Payment කළ නිසා update කරන්න
    booking.assignedRoomNumber = assignedNum;

    await booking.save();

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};
