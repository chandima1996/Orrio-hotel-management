import { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  SlidersHorizontal,
  Trash2,
  Check,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import HotelCard from "@/components/HotelCard";

// --- MOCK DATA ---
const HOTELS_DATA = [
  {
    _id: "1",
    name: "Crystal Sands Resort",
    location: "Maldives, South Atoll",
    price: 450,
    rating: 4.8,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
    type: "Resort",
    amenities: ["Wifi", "Infinity Pool", "Spa", "Dining"],
  },
  {
    _id: "2",
    name: "Urban Heights Hotel",
    location: "New York, USA",
    price: 220,
    rating: 4.5,
    reviews: 85,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
    type: "Hotel",
    amenities: ["Wifi", "Gym"],
  },
  {
    _id: "3",
    name: "Azure Villa Escape",
    location: "Santorini, Greece",
    price: 850,
    rating: 4.9,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000",
    type: "Villa",
    amenities: ["Wifi", "Private Pool", "Kitchen"],
  },
  {
    _id: "4",
    name: "Mountain View Cabin",
    location: "Aspen, Colorado",
    price: 350,
    rating: 4.7,
    reviews: 95,
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000",
    type: "Cabin",
    amenities: ["Fireplace", "Wifi"],
  },
  {
    _id: "5",
    name: "Tokyo Grand Hotel",
    location: "Tokyo, Japan",
    price: 180,
    rating: 4.4,
    reviews: 320,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
    type: "Hotel",
    amenities: ["Wifi", "Gym", "Spa"],
  },
];

// --- FILTER SIDEBAR ---
const FilterSidebar = ({ filters, setFilters, resetFilters }) => {
  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  return (
    <div className="space-y-8 bg-card border border-border p-6 rounded-3xl h-fit sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" /> Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-destructive hover:bg-destructive/10 h-8 px-2 text-xs"
        >
          <Trash2 className="w-3 h-3 mr-1" /> Clear All
        </Button>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-semibold mb-4">Price Range</h4>
        <Slider
          defaultValue={[0, 1000]}
          value={filters.priceRange}
          max={1000}
          step={10}
          onValueChange={(val) =>
            setFilters((prev) => ({ ...prev, priceRange: val }))
          }
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}+</span>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h4 className="font-semibold mb-3">Property Type</h4>
        <div className="space-y-2">
          {["Hotel", "Resort", "Villa", "Cabin"].map((type) => (
            <div
              key={type}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => toggleFilter("types", type)}
            >
              <div
                className={`w-5 h-5 rounded border border-primary flex items-center justify-center ${
                  filters.types.includes(type)
                    ? "bg-primary text-white"
                    : "bg-transparent"
                }`}
              >
                {filters.types.includes(type) && <Check className="w-3 h-3" />}
              </div>
              <span className="text-sm">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-semibold mb-3">Amenities</h4>
        <div className="space-y-2">
          {["Wifi", "Pool", "Spa", "Gym", "Kitchen"].map((amenity) => (
            <div
              key={amenity}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => toggleFilter("amenities", amenity)}
            >
              <div
                className={`w-5 h-5 rounded border border-primary flex items-center justify-center ${
                  filters.amenities.includes(amenity)
                    ? "bg-primary text-white"
                    : "bg-transparent"
                }`}
              >
                {filters.amenities.includes(amenity) && (
                  <Check className="w-3 h-3" />
                )}
              </div>
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const FindHotels = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // Layout State

  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    types: [],
    amenities: [],
  });

  const resetAllFilters = () => {
    setFilters({ priceRange: [0, 1000], types: [], amenities: [] });
    setSearchQuery("");
  };

  const filteredHotels = useMemo(() => {
    return HOTELS_DATA.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice =
        hotel.price >= filters.priceRange[0] &&
        hotel.price <= filters.priceRange[1];
      const matchesType =
        filters.types.length === 0 || filters.types.includes(hotel.type);

      // Simple amenities check (if selected amenities exist in hotel)
      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((a) =>
          hotel.amenities.some((ha) =>
            ha.toLowerCase().includes(a.toLowerCase())
          )
        );

      return matchesSearch && matchesPrice && matchesType && matchesAmenities;
    });
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-10">
      <div className="container mx-auto px-4">
        {/* Search Bar Section */}
        <div className="max-w-5xl mx-auto mb-16 w-full bg-card border border-border p-3 rounded-3xl shadow-2xl shadow-primary/5 flex flex-col lg:flex-row items-center gap-3 relative z-20">
          <div className="flex-1 w-full relative group px-2">
            <label className="text-xs text-muted-foreground ml-3 mb-1 block">
              Location or Hotel
            </label>
            <div className="flex items-center gap-3 px-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Where are you going?"
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 text-base font-medium h-auto placeholder:text-muted-foreground/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="w-[1px] h-10 bg-border hidden lg:block"></div>

          <div className="flex-1 w-full relative group px-2 border-t lg:border-t-0 border-border pt-2 lg:pt-0">
            <label className="text-xs text-muted-foreground ml-3 mb-1 block">
              Dates
            </label>
            <div className="flex items-center gap-3 px-3 cursor-pointer">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-base font-medium text-muted-foreground">
                Add Dates
              </span>
            </div>
          </div>

          <div className="w-[1px] h-10 bg-border hidden lg:block"></div>

          <div className="flex-1 w-full relative group px-2 border-t lg:border-t-0 border-border pt-2 lg:pt-0">
            <label className="text-xs text-muted-foreground ml-3 mb-1 block">
              Guests
            </label>
            <div className="flex items-center gap-3 px-3 cursor-pointer">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-base font-medium text-muted-foreground">
                Add Guests
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="rounded-2xl h-14 px-8 w-full lg:w-auto shadow-lg shadow-primary/25"
          >
            <Search className="w-5 h-5 mr-2" /> Search
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              resetFilters={resetAllFilters}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Header: Count, Sort, Toggle */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold">
                {filteredHotels.length} Properties found
              </h2>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="px-3 py-1 cursor-pointer hover:bg-muted h-9"
                >
                  Sort by: Recommended
                </Badge>

                {/* Layout Toggle Buttons */}
                <div className="bg-muted p-1 rounded-lg flex border border-border items-center">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "grid"
                        ? "bg-background shadow-sm text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "list"
                        ? "bg-background shadow-sm text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Hotel Cards Display */}
            {filteredHotels.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "flex flex-col gap-6"
                }
              >
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} layout={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                <h3 className="text-xl font-bold text-muted-foreground">
                  No hotels found.
                </h3>
                <Button
                  variant="link"
                  onClick={resetAllFilters}
                  className="mt-2 text-primary"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindHotels;
