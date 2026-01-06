import Hotel from "../models/Hotel.js";

// Create, Update, Delete, GetSingle එහෙමම තියන්න...

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

// --- SEARCH & FILTER LOGIC ---
export const getHotels = async (req, res, next) => {
  try {
    // 1. amenities parameter එකත් මෙතනට ගන්න
    const { min, max, limit, type, featured, search, sort, amenities } =
      req.query;

    let query = {};

    // --- Super Search Logic (Existing) ---
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { amenities: { $regex: search, $options: "i" } },
      ];
    }

    // --- Type Filter ---
    if (type && type !== "All") {
      if (search) {
        query = { $and: [query, { type: type }] };
      } else {
        query.type = type;
      }
    }

    // --- Price Filter ---
    if (min || max) {
      const priceQuery = {};
      if (min) priceQuery.$gte = Number(min);
      if (max) priceQuery.$lte = Number(max);

      if (Object.keys(query).length > 0) {
        if (!query.$and) query.$and = [];
        query.$and.push({ "price.normal": priceQuery });
      } else {
        query["price.normal"] = priceQuery;
      }
    }

    // --- NEW: Amenities Filter Logic ---
    if (amenities) {
      // Frontend එකෙන් එන්නේ "Wifi,Pool,Gym" වගේ string එකක්
      const amenitiesList = amenities.split(",");

      // $all පාවිච්චි කරන්නේ තෝරාගත් *සියලුම* පහසුකම් තියෙන ඒවා විතරක් පෙන්නන්න.
      const amenityQuery = { amenities: { $all: amenitiesList } };

      if (Object.keys(query).length > 0) {
        if (!query.$and) query.$and = [];
        query.$and.push(amenityQuery);
      } else {
        Object.assign(query, amenityQuery);
      }
    }

    // --- Featured Filter ---
    if (featured) {
      query.featured = featured === "true";
    }

    // --- Sorting ---
    let sortOptions = {};
    if (sort === "price_asc") sortOptions["price.normal"] = 1;
    else if (sort === "price_desc") sortOptions["price.normal"] = -1;
    else if (sort === "rating") sortOptions["rating"] = -1;
    else sortOptions["createdAt"] = -1;

    // --- Pagination ---
    const page = parseInt(req.query.page) || 1;
    const limitVal = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limitVal;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitVal);

    const totalCount = await Hotel.countDocuments(query);

    res.status(200).json({
      hotels,
      totalCount,
      totalPages: Math.ceil(totalCount / limitVal),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};
