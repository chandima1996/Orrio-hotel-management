import Hotel from "../models/Hotel.js";

// 1. Create Hotel
export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 2. Update Hotel
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // එවපු ඩේටා ටික විතරක් update වෙනවා
      { new: true } // Update වුනාට පස්සේ අලුත් data ටික return වෙනවා
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 3. Delete Hotel
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
};

// 4. Get Single Hotel
export const getHotel = async (req, res, next) => {
  try {
    // Hotel එක ගන්නකොටම එකේ තියෙන Rooms ටිකත් විස්තර සහිතව (populate) ගේන්න ඕනේ
    const hotel = await Hotel.findById(req.params.id).populate("rooms");
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 5. Get All Hotels
export const getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json(err);
  }
};
