import Hotel from "../models/Hotel.js";

// 1. Create Hotel (Admin Only)
export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

// 2. Get All Hotels (Search & Filter Logic)
export const getHotels = async (req, res, next) => {
  const { min, max, limit, search, ...others } = req.query;

  // Basic query for exact matches (city, type, etc.)
  let query = { ...others };

  // Price Filter
  if (min || max) {
    query.cheapestPrice = {
      ...(min && { $gt: min }),
      ...(max && { $lt: max }),
    };
  }

  // --- AI / Text Search Implementation ---
  // User "Beach vibe relax" කියලා ගැහුවොත්, අපි Text Index එකෙන් හොයනවා.
  if (search) {
    query.$text = { $search: search };
  }

  try {
    const hotels = await Hotel.find(query).limit(parseInt(limit || 10));
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

// 3. Get Single Hotel
export const getHotel = async (req, res, next) => {
  try {
    // Hotel එක ගන්න ගමන් ඒකට අදාල Rooms ටිකත් ගන්නවා (Optional if needed here)
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

// 4. Get Amenities List (To show in Admin Panel)
import { HOTEL_AMENITIES } from "../utils/constants.js";
export const getHotelAmenities = (req, res) => {
  res.status(200).json(HOTEL_AMENITIES);
};
