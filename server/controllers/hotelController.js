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

export const getHotels = async (req, res, next) => {
  const { min, max, limit, page, city, type, featured, sort } = req.query;

  try {
    // 1. Query Object එක හදාගැනීම
    let query = {};

    // Search by City (Case insensitive)
    if (city) {
      query.location = { $regex: city, $options: "i" };
    }

    // Filter by Type
    if (type) {
      query.type = type;
    }

    // Filter by Price Range
    if (min || max) {
      query["price.normal"] = {
        $gte: min || 0,
        $lte: max || 99999,
      };
    }

    // Filter by Featured
    if (featured) {
      query.featured = featured === "true";
    }

    // 2. Sorting Logic
    let sortOptions = {};
    if (sort === "price_asc") sortOptions["price.normal"] = 1; // මිල අඩු සිට වැඩි
    if (sort === "price_desc") sortOptions["price.normal"] = -1; // මිල වැඩි සිට අඩු
    if (sort === "rating") sortOptions["rating"] = -1; // හොඳම rating මුලට
    if (sort === "newest") sortOptions["createdAt"] = -1; // අලුත් ඒවා මුලට

    // 3. Pagination Logic
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 6; // පිටුවකට හෝටල් 6යි
    const skip = (pageNumber - 1) * limitNumber;

    // 4. Data Fetching
    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .limit(limitNumber)
      .skip(skip);

    // මුළු හෝටල් ගණන (Pagination සඳහා)
    const totalCount = await Hotel.countDocuments(query);

    res.status(200).json({
      hotels,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
