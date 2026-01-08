import Hotel, {
  HOTEL_TYPES,
  HOTEL_AMENITIES,
  HOTEL_FEATURES,
} from "../models/Hotel.js";

export const getHotelConstants = (req, res) => {
  try {
    res.status(200).json({
      types: HOTEL_TYPES,
      amenities: HOTEL_AMENITIES,
      features: HOTEL_FEATURES,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("rooms");
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json(err);
  }
};

// --- GET ALL HOTELS (CORRECTED) ---
export const getHotels = async (req, res, next) => {
  // FIX: 'page' එක මෙතනින් destructure කරලා අයින් කරගන්න ඕනේ.
  // නැත්නම් ඒක 'others' එකට ගිහින් DB query එක අවුල් කරනවා.
  const {
    min,
    max,
    limit,
    page,
    sort,
    city,
    type,
    featured,
    amenities,
    search,
    ...others
  } = req.query;

  try {
    const minPrice = min || 0;
    const maxPrice = max || 10000000;

    let query = {
      ...others,
      "price.normal": { $gte: minPrice, $lte: maxPrice },
    };

    if (search) {
      query.$or = [
        { city: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    } else if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (type && type !== "All") {
      query.type = type;
    }

    if (featured) {
      query.featured = featured === "true";
    }

    if (amenities) {
      const amenitiesList = amenities.split(",");
      query.amenities = { $all: amenitiesList };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "price_asc") sortOptions = { "price.normal": 1 };
    else if (sort === "price_desc") sortOptions = { "price.normal": -1 };
    else if (sort === "rating") sortOptions = { rating: -1 };

    const pageNum = parseInt(page) || 1;
    const limitVal = parseInt(limit) || 9;
    const skip = (pageNum - 1) * limitVal;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .limit(limitVal)
      .skip(skip);

    const count = await Hotel.countDocuments(query);

    res.status(200).json({
      hotels: hotels,
      totalPages: Math.ceil(count / limitVal),
      currentPage: pageNum,
      totalCount: count,
    });
  } catch (err) {
    next(err);
  }
};
