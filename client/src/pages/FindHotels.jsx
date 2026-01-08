import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import HotelCard from "@/components/HotelCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RefreshCcw,
  Check,
  Loader2, // Loader icon එක import කළා
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

// Model එකේ තියෙන Amenities ලිස්ට් එක
const amenityOptions = [
  "High-Speed Wifi",
  "Infinity Pool",
  "Luxury Gym",
  "Fine Dining",
  "Spa & Wellness",
  "Bar / Lounge",
  "Free Parking",
  "Air Conditioning",
  "Private Beach",
  "24/7 Concierge",
];

const FindHotels = () => {
  const { currency, exchangeRate } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- States ---
  const [destination, setDestination] = useState(
    searchParams.get("search") || ""
  );
  // Default value එක හිස් Array එකක් ලෙස තියන්න
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  // Pagination & View
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Fetch Logic (Optimized) ---
  const fetchHotels = async (overrideParams = {}) => {
    setLoading(true);
    try {
      const searchTerm = overrideParams.hasOwnProperty("search")
        ? overrideParams.search
        : destination;

      const currentMin = overrideParams.hasOwnProperty("min")
        ? overrideParams.min
        : minPrice;

      const currentMax = overrideParams.hasOwnProperty("max")
        ? overrideParams.max
        : maxPrice;

      const currentType = overrideParams.hasOwnProperty("type")
        ? overrideParams.type
        : selectedType;

      const currentAmenities = overrideParams.hasOwnProperty("amenities")
        ? overrideParams.amenities
        : selectedAmenities;

      const currentSort = overrideParams.hasOwnProperty("sort")
        ? overrideParams.sort
        : sortBy;

      const currentPage = overrideParams.hasOwnProperty("page")
        ? overrideParams.page
        : page;

      // Currency Conversion
      let minUSD = currentMin;
      let maxUSD = currentMax;

      if (currency !== "USD" && exchangeRate > 0) {
        if (currentMin)
          minUSD = (parseFloat(currentMin) / exchangeRate).toFixed(2);
        if (currentMax)
          maxUSD = (parseFloat(currentMax) / exchangeRate).toFixed(2);
      }

      // Prepare URL Params
      const params = new URLSearchParams({
        search: searchTerm,
        sort: currentSort,
        page: currentPage,
        limit: 9,
      });

      if (minUSD) params.append("min", minUSD);
      if (maxUSD) params.append("max", maxUSD);
      if (currentType && currentType !== "All")
        params.append("type", currentType);

      if (currentAmenities && currentAmenities.length > 0) {
        params.append("amenities", currentAmenities.join(","));
      }

      const res = await axios.get(`http://localhost:5000/api/hotels?${params}`);

      // --- CRITICAL FIX: Response Handling ---
      let hotelData = [];
      let total = 1;

      // 1. Backend එකෙන් කෙලින්ම Array එකක් එනවා නම් (Pagination නැතුව)
      if (Array.isArray(res.data)) {
        hotelData = res.data;
      }
      // 2. Backend එකෙන් Object එකක් එනවා නම් ({ hotels: [], totalPages: ... })
      else if (res.data && Array.isArray(res.data.hotels)) {
        hotelData = res.data.hotels;
        total = res.data.totalPages || 1;
      }

      setHotels(hotelData);
      setTotalPages(total);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setHotels([]); // Error ආවොත් Crash නොවෙන්න හිස් Array එකක් දානවා
    } finally {
      setLoading(false);
    }
  };

  // --- useEffects ---
  useEffect(() => {
    const query = searchParams.get("search");
    fetchHotels({ search: query || "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, selectedType, selectedAmenities]);

  // --- Handlers ---
  const handleSearch = () => {
    setPage(1);
    setSearchParams({ search: destination });
    fetchHotels({ search: destination, page: 1 });
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenity)) {
        return prev.filter((item) => item !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  const handleReset = () => {
    setDestination("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedType("");
    setSelectedAmenities([]);
    setSortBy("newest");
    setPage(1);
    setSearchParams({});

    fetchHotels({
      search: "",
      min: "",
      max: "",
      type: "",
      amenities: [],
      sort: "newest",
      page: 1,
    });
  };

  return (
    <div className="min-h-screen pb-10 bg-gray-50/50 dark:bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full flex items-center justify-center mb-10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000"
          alt="Luxury Hotel"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-extrabold text-white md:text-6xl">
            Find Your Perfect Stay
          </h1>
          <p className="mt-4 text-xl text-gray-200">
            Search by City, Country, Hotel Name, or Amenities
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 px-4 mx-auto max-w-7xl md:px-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="flex-shrink-0 w-full space-y-6 lg:w-80">
          <div className="sticky p-6 border shadow-lg bg-card rounded-2xl border-border/60 top-24">
            <div className="flex items-center justify-between pb-4 mb-6 border-b">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <SlidersHorizontal className="w-5 h-5 text-primary" /> Filters
              </h3>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-red-500 hover:underline"
              >
                <RefreshCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="mb-6 space-y-3">
              <label className="text-sm font-semibold">Search Anything</label>
              <div className="relative">
                <MapPin className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="e.g. Sri Lanka, Pool, Villa..."
                  className="pl-9"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 space-y-3">
              <label className="text-sm font-semibold">
                Price ({currency})
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Property Type */}
            <div className="mb-6 space-y-3">
              <label className="text-sm font-semibold">Property Type</label>
              <div className="flex flex-wrap gap-2">
                {["All", "Hotel", "Villa", "Resort", "Chalet"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type === "All" ? "" : type)}
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                      (type === "All" && selectedType === "") ||
                      selectedType === type
                        ? "bg-primary text-white border-primary"
                        : "bg-background border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Filter Section */}
            <div className="mb-6 space-y-3">
              <label className="text-sm font-semibold">Amenities</label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer dark:text-gray-300 hover:text-primary"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? "bg-primary border-primary"
                          : "border-gray-300 bg-background"
                      }`}
                    >
                      {selectedAmenities.includes(amenity) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <Button className="w-full font-bold" onClick={handleSearch}>
              Apply Filters
            </Button>
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-grow">
          {/* Top Bar (Sort & View) */}
          <div className="flex flex-col items-center justify-between gap-4 p-4 mb-6 border shadow-sm bg-card rounded-xl sm:flex-row">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                placeholder="Search hotels, cities, amenities..."
                className="pl-9"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                className="h-10 px-3 text-sm border rounded-md bg-background focus:ring-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <div className="flex border rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list" ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Hotel List */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[350px] bg-gray-200 dark:bg-muted rounded-xl flex items-center justify-center"
                >
                  <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
                </div>
              ))}
            </div>
          ) : (
            // Safety Check: Array එකක් සහ හිස් නොවේ නම් පමණක් Map කරන්න
            <>
              {Array.isArray(hotels) && hotels.length > 0 ? (
                <>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {hotels.map((hotel) => (
                      <HotelCard key={hotel._id} hotel={hotel} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-8">
                      <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="py-2 font-semibold">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                // No Hotels Found
                <div className="py-20 text-center border-2 border-dashed rounded-xl">
                  <h3 className="text-xl font-bold text-gray-500">
                    No hotels found
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Try removing some amenities or filters.
                  </p>
                  <Button variant="link" onClick={handleReset} className="mt-2">
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindHotels;
