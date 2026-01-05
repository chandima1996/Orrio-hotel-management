import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
  Users,
  Sparkles,
  Minus,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays } from "date-fns";

// Components
import HotelCard from "../components/HotelCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

// --- Mock Data ---
const allHotels = [
  {
    _id: "1",
    name: "Crystal Sands Resort",
    location: "Maldives",
    description: "Luxury overwater villas with direct ocean access.",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000",
    ],
    cheapestPrice: 450,
    rating: 4.8,
    amenities: ["wifi", "pool", "spa", "restaurant"],
    type: "Resort",
    featured: true,
  },
  {
    _id: "2",
    name: "Neon City Hotel",
    location: "Tokyo, Japan",
    description: "Futuristic stay in the heart of Tokyo.",
    images: [
      "https://images.unsplash.com/photo-1590447158019-883d8d5f8bc7?q=80&w=1000",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000",
    ],
    cheapestPrice: 220,
    rating: 4.5,
    amenities: ["wifi", "gym", "bar", "ac"],
    type: "Hotel",
    featured: true,
  },
  {
    _id: "3",
    name: "Alpine Glass Lodge",
    location: "Swiss Alps",
    description: "Sleep under the stars in glass-roofed igloos.",
    images: [
      "https://images.unsplash.com/photo-1519449556851-5720b33024e7?q=80&w=1000",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000",
    ],
    cheapestPrice: 680,
    rating: 4.9,
    amenities: ["wifi", "hwater", "parking", "restaurant"],
    type: "Villa",
    featured: true,
  },
  {
    _id: "4",
    name: "Desert Mirage",
    location: "Dubai, UAE",
    description: "Sanctuary in the dunes featuring private pools.",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000",
    ],
    cheapestPrice: 350,
    rating: 4.7,
    amenities: ["pool", "ac", "wifi", "bar"],
    type: "Resort",
    featured: false,
  },
  {
    _id: "5",
    name: "Urban Loft",
    location: "New York, USA",
    description: "Industrial chic meets modern luxury.",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000",
    ],
    cheapestPrice: 550,
    rating: 4.4,
    amenities: ["wifi", "gym", "bar"],
    type: "Apartment",
    featured: false,
  },
  {
    _id: "6",
    name: "Cozy Cabin",
    location: "Norway",
    description: "Wooden cabin surrounded by pine forests.",
    images: [
      "https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=1000",
    ],
    cheapestPrice: 150,
    rating: 4.6,
    amenities: ["wifi", "parking", "hwater"],
    type: "Villa",
    featured: false,
  },
];

// --- Filter Sidebar Component ---
const FilterSidebar = ({ filters, setFilters }) => {
  return (
    <div className="space-y-8">
      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Price Range</h3>
        <Slider
          defaultValue={[filters.priceRange[1]]}
          max={1000}
          step={10}
          value={[filters.priceRange[1]]}
          onValueChange={(value) =>
            setFilters({ ...filters, priceRange: [0, value[0]] })
          }
          className="my-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>$0</span>
          <span className="font-bold text-primary">
            ${filters.priceRange[1]}
          </span>
        </div>
      </div>
      <Separator />
      {/* Property Type */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Property Type</h3>
        <div className="space-y-2">
          {["Hotel", "Resort", "Villa", "Apartment"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filters.types.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked)
                    setFilters({ ...filters, types: [...filters.types, type] });
                  else
                    setFilters({
                      ...filters,
                      types: filters.types.filter((t) => t !== type),
                    });
                }}
              />
              <Label htmlFor={type} className="font-normal cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Amenities</h3>
        <div className="space-y-2">
          {["Wifi", "Pool", "Gym", "Spa", "Restaurant", "Parking"].map(
            (item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={item}
                  checked={filters.amenities.includes(item.toLowerCase())}
                  onCheckedChange={(checked) => {
                    const value = item.toLowerCase();
                    if (checked)
                      setFilters({
                        ...filters,
                        amenities: [...filters.amenities, value],
                      });
                    else
                      setFilters({
                        ...filters,
                        amenities: filters.amenities.filter((a) => a !== value),
                      });
                  }}
                />
                <Label htmlFor={item} className="font-normal cursor-pointer">
                  {item}
                </Label>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const FindHotels = () => {
  // --- States ---
  const [searchQuery, setSearchQuery] = useState(""); // Connected to the Big Search Bar
  const [sortOption, setSortOption] = useState("recommended");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Advanced Search States
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [guests, setGuests] = useState({ adults: 1, children: 0 });

  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    types: [],
    amenities: [],
  });

  // --- Filter Logic ---
  const filteredHotels = useMemo(() => {
    return allHotels
      .filter((hotel) => {
        const matchesSearch =
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = hotel.cheapestPrice <= filters.priceRange[1];
        const matchesType =
          filters.types.length === 0 || filters.types.includes(hotel.type);
        const matchesAmenities =
          filters.amenities.length === 0 ||
          filters.amenities.every((a) => hotel.amenities.includes(a));
        return matchesSearch && matchesPrice && matchesType && matchesAmenities;
      })
      .sort((a, b) => {
        if (sortOption === "priceLow") return a.cheapestPrice - b.cheapestPrice;
        if (sortOption === "priceHigh")
          return b.cheapestPrice - a.cheapestPrice;
        if (sortOption === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [searchQuery, filters, sortOption]);

  // Guest Helper
  const updateGuests = (type, operation) => {
    setGuests((prev) => ({
      ...prev,
      [type]:
        operation === "inc" ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-10">
      <div className="container mx-auto px-4">
        {/* --- 1. Big Advanced Search Bar (Top) --- */}
        <div className="max-w-5xl mx-auto mb-12 w-full bg-card border border-border p-3 rounded-3xl shadow-2xl shadow-primary/5 flex flex-col lg:flex-row items-center gap-3 relative z-20">
          {/* Location / Query */}
          <div className="flex-1 w-full relative group px-2">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Where to? (e.g., 'Maldives', 'Beach')"
              className="w-full h-12 pl-12 pr-4 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Separator (Desktop) */}
          <div className="hidden lg:block w-[1px] h-10 bg-border" />

          {/* Date Picker */}
          <div className="w-full lg:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full lg:w-[260px] h-12 justify-start text-left font-normal hover:bg-muted"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {date?.from
                    ? date.to
                      ? `${format(date.from, "MMM dd")} - ${format(
                          date.to,
                          "MMM dd"
                        )}`
                      : format(date.from, "MMM dd, y")
                    : "Select Dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="hidden lg:block w-[1px] h-10 bg-border" />

          {/* Guest Selector */}
          <div className="w-full lg:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full lg:w-[200px] h-12 justify-start hover:bg-muted"
                >
                  <Users className="mr-2 h-4 w-4 text-primary" />
                  {guests.adults} Adults, {guests.children} Kids
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none text-muted-foreground">
                    Guests
                  </h4>
                  {["adults", "children"].map((type) => (
                    <div
                      key={type}
                      className="flex items-center justify-between capitalize"
                    >
                      <span className="text-sm font-medium">{type}</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateGuests(type, "dec")}
                          disabled={
                            (type === "adults" && guests.adults <= 1) ||
                            (type === "children" && guests.children <= 0)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-4 text-center">{guests[type]}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateGuests(type, "inc")}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <Button className="w-full lg:w-auto h-12 px-8 rounded-2xl bg-primary hover:bg-blue-600 text-lg font-semibold shadow-md">
            Search
          </Button>
        </div>

        {/* --- 2. Main Content Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="hidden md:block col-span-1 h-fit sticky top-24 p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl">Filters</h2>
              {(filters.types.length > 0 ||
                filters.amenities.length > 0 ||
                filters.priceRange[1] < 1000) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setFilters({
                      priceRange: [0, 1000],
                      types: [],
                      amenities: [],
                    })
                  }
                >
                  Reset
                </Button>
              )}
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* Results Section */}
          <div className="col-span-1 md:col-span-3">
            {/* Results Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="text-muted-foreground">
                Found{" "}
                <span className="font-bold text-foreground">
                  {filteredHotels.length}
                </span>{" "}
                properties
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile Filters Trigger */}
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="overflow-y-auto">
                      <SheetHeader className="mb-6">
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Sort Dropdown */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="priceLow">Price: Low to High</SelectItem>
                    <SelectItem value="priceHigh">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggles (Grid vs List) */}
                <div className="flex bg-muted p-1 rounded-lg border border-border">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "grid"
                        ? "bg-background shadow-sm text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "list"
                        ? "bg-background shadow-sm text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Hotels List */}
            {filteredHotels.length > 0 ? (
              <motion.div
                layout
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                <AnimatePresence>
                  {filteredHotels.map((hotel) => (
                    <motion.div
                      key={hotel._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Pass viewMode as 'layout' prop */}
                      <HotelCard hotel={hotel} layout={viewMode} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No hotels found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search.
                </p>
                <Button
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 1000],
                      types: [],
                      amenities: [],
                    });
                    setSearchQuery("");
                  }}
                >
                  Clear all filters
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
