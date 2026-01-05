import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// 1. Create Room (Admin Only)
export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    // Hotel Model එකේ rooms array එකට මේ room id එක push කරනවා
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

// 2. Get Rooms by Hotel ID (Frontend එකේ Single Hotel Page එකට)
export const getRoomsByHotel = async (req, res, next) => {
  try {
    const rooms = await Room.find({ hotelId: req.params.hotelId });
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};
