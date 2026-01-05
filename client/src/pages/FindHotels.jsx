import { useState, useEffect } from "react";
import axios from "axios";
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
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

const FindHotels = () => {
  const { currency } = useCurrency();

  // --- States ---
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [destination, setDestination] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination & View Mode
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Data Fetching ---
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        city: destination,
        sort: sortBy,
        page: page,
        limit: 6, // පිටුවකට හෝටල් 6යි
      });

      if (minPrice) params.append("min", minPrice);
      if (maxPrice) params.append("max", maxPrice);
      if (selectedType) params.append("type", selectedType);

      const res = await axios.get(`http://localhost:5000/api/hotels?${params}`);

      setHotels(res.data.hotels);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  // State වෙනස් වෙනකොට Data update කරන්න
  useEffect(() => {
    fetchHotels();
  }, [page, sortBy, selectedType]);

  // Search Button එකට
  const handleSearch = () => {
    setPage(1);
    fetchHotels();
  };

  // Reset Filters
  const handleReset = () => {
    setDestination("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedType("");
    setSortBy("newest");
    setPage(1);
    fetchHotels();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background pb-10">
      {/* --- 1. NEW HERO SECTION (Title with Background) --- */}
      <div className="relative h-[450px] w-full flex items-center justify-center mb-10 overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000"
          alt="Luxury Hotel"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
        />
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        {/* Centered Content */}
        <div className="relative z-10 text-center px-4 space-y-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl">
            Find Your{" "}
            <span className="text-primary bg-white/10 px-2 rounded-lg backdrop-blur-sm">
              Perfect Stay
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md font-medium">
            Discover luxury hotels, cozy villas, and serene resorts at the best
            prices around the world.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        {/* --- 2. Filter Sidebar (Sticky) --- */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-lg sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" /> Filters
              </h3>
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <RefreshCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Location Search */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-semibold text-foreground/80">
                Location
              </label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-hover:text-primary transition-colors" />
                <Input
                  placeholder="City or Area..."
                  className="pl-9 bg-background/50 focus:bg-background transition-all"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-semibold text-foreground/80">
                Price Range{" "}
                <span className="text-xs text-primary font-normal">
                  ({currency})
                </span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="pl-3 bg-background/50"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="relative w-full">
                  <Input
                    type="number"
                    placeholder="Max"
                    className="pl-3 bg-background/50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-semibold text-foreground/80">
                Property Type
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", "Hotel", "Villa", "Resort", "Chalet"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type === "All" ? "" : type)}
                    className={`text-xs px-4 py-2 rounded-lg border transition-all duration-200 ${
                      (type === "All" && selectedType === "") ||
                      selectedType === type
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                        : "bg-background border-border hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full font-bold shadow-lg shadow-primary/25"
              onClick={handleSearch}
            >
              Apply Filters
            </Button>
          </div>
        </aside>

        {/* --- 3. Main Results Area --- */}
        <div className="flex-grow">
          {/* Top Control Bar */}
          <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-hover:text-primary transition-colors" />
              <Input
                placeholder="Search hotels by name..."
                className="pl-9 h-10 bg-background border-transparent hover:border-border focus:border-primary transition-all shadow-sm"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            {/* Sort & View Toggle */}
            <div className="flex gap-3 items-center w-full sm:w-auto justify-end">
              <select
                className="h-10 px-3 rounded-md border border-border bg-background text-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer hover:border-primary/50 transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="flex border border-border rounded-md overflow-hidden bg-background">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "list"
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Hotels Grid / List */}
          {loading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-[350px] bg-muted/60 rounded-2xl border border-border/50"
                ></div>
              ))}
            </div>
          ) : hotels.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border/60">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                No hotels found
              </h3>
              <p className="text-sm text-muted-foreground mt-2 text-center max-w-xs">
                We couldn't find any properties matching your search. Try
                changing your filters.
              </p>
              <Button
                variant="link"
                onClick={handleReset}
                className="mt-4 text-primary"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            // Results Grid
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
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2 items-center">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="text-sm font-semibold px-6 bg-card py-2.5 rounded-lg border border-border shadow-sm">
                Page <span className="text-primary">{page}</span> of{" "}
                {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindHotels;
