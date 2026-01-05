import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// 1. Create Room
export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid; // URL එකෙන් Hotel ID එක ගන්නවා
  const newRoom = new Room({ ...req.body, hotelId }); // Room එකට Hotel ID එකත් දානවා

  try {
    // Room එක Database එකේ save කරනවා
    const savedRoom = await newRoom.save();

    // ඊට පස්සේ අදාළ Hotel එක හොයලා, එකේ rooms array එකට අලුත් Room ID එක දානවා
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }

    res.status(200).json(savedRoom);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 2. Update Room
export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 3. Delete Room
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    // Room එක මැකුවාම Hotel එකේ ලිස්ට් එකෙනුත් අයින් කරන්න ඕනේ
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
};

// 4. Get Single Room
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 5. Get All Rooms
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json(err);
  }
};
