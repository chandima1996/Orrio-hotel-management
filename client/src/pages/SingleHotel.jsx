import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, differenceInCalendarDays } from "date-fns";
import { useCurrency } from "@/context/CurrencyContext";
// Auth Context එක import කරගන්න (ඔබේ project එකේ ඇති path එක අනුව)
// import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  Star,
  MapPin,
  Wifi,
  Waves,
  Dumbbell,
  Utensils,
  Car,
  Wind,
  Umbrella,
  ConciergeBell,
  CheckCircle2,
  Calendar as CalendarIcon,
  Users,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";

// Icons Mapping
const amenityIcons = {
  "High-Speed Wifi": { icon: Wifi, label: "High-Speed Wifi" },
  "Infinity Pool": { icon: Waves, label: "Infinity Pool" },
  "Luxury Gym": { icon: Dumbbell, label: "Fitness Center" },
  "Fine Dining": { icon: Utensils, label: "Restaurant" },
  "Spa & Wellness": { icon: ConciergeBell, label: "Spa & Wellness" },
  "Bar / Lounge": { icon: Utensils, label: "Bar & Lounge" },
  "Free Parking": { icon: Car, label: "Free Parking" },
  "Air Conditioning": { icon: Wind, label: "Air Conditioning" },
  "Private Beach": { icon: Umbrella, label: "Private Beach" },
  "24/7 Concierge": { icon: ConciergeBell, label: "24/7 Service" },
};

const SingleHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currency, convertPrice } = useCurrency();

  // Auth Check (ඔබේ Context එකෙන් ගන්න)
  // const { user } = useAuth();
  const user = true; // Testing සඳහා hardcode කර ඇත. User නැති විට මෙය null කරන්න.

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Image Slider State ---
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // --- Booking States (Initialized from URL Params if available) ---
  const queryParams = new URLSearchParams(location.search);

  const [date, setDate] = useState({
    from: queryParams.get("from")
      ? new Date(queryParams.get("from"))
      : new Date(),
    to: queryParams.get("to")
      ? new Date(queryParams.get("to"))
      : addDays(new Date(), 1),
  });

  const [guests, setGuests] = useState({
    adults: queryParams.get("adults") ? parseInt(queryParams.get("adults")) : 1,
    children: queryParams.get("children")
      ? parseInt(queryParams.get("children"))
      : 0,
  });

  // Fetch Hotel Data
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/hotels/find/${id}`
        );
        setHotel(res.data);
      } catch (err) {
        console.error("Error fetching hotel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // Auto Scroll Images
  useEffect(() => {
    if (hotel?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % hotel.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [hotel]);

  // Handle Back Navigation with Error Handling
  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/"); // History එකක් නැත්නම් Home එකට යවන්න
    }
  };

  // Handle Share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  // Guest Update Helper
  const updateGuests = (type, operation) => {
    setGuests((prev) => ({
      ...prev,
      [type]:
        operation === "inc" ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="py-20 text-center">Hotel not found!</div>;
  }

  // Price Calculations
  const basePrice = hotel.price?.normal || 0;
  const discount = hotel.price?.discount || 0;
  const pricePerNight = basePrice - discount;

  // Calculate Nights
  const daysDifference =
    date?.from && date?.to ? differenceInCalendarDays(date.to, date.from) : 1;
  const nights = daysDifference > 0 ? daysDifference : 1;

  // Total logic implies 1 room for simplicity, or based on guests
  const totalPrice = pricePerNight * nights;

  return (
    <div className="min-h-screen pt-24 pb-10 bg-background">
      <div className="px-4 mx-auto max-w-7xl md:px-8">
        {/* --- Back Button --- */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 mb-6 transition-colors text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* --- 1. Header Section --- */}
        <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-bold tracking-wider uppercase rounded bg-primary/10 text-primary">
                {hotel.type}
              </span>
              {hotel.featured && (
                <span className="px-2 py-1 text-xs font-bold tracking-wider text-yellow-700 uppercase bg-yellow-100 rounded">
                  Top Rated
                </span>
              )}
            </div>
            <h1 className="mb-2 text-3xl font-extrabold md:text-4xl text-foreground">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {hotel.address}, {hotel.location}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>

            {/* Show Favorite only if Logged In */}
            {user && (
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:text-red-500 hover:bg-red-50 hover:border-red-200"
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}

            {/* Removed "Reserve Now" Button as requested */}
          </div>
        </div>

        {/* --- 2. Image Slider (Horizontal Swipe) --- */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10 group bg-black">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImgIndex}
              src={hotel.images[currentImgIndex]}
              alt={`Slide ${currentImgIndex}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="object-cover w-full h-full"
            />
          </AnimatePresence>

          {/* Slider Controls */}
          {hotel.images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImgIndex((prev) =>
                    prev === 0 ? hotel.images.length - 1 : prev - 1
                  )
                }
                className="absolute p-2 text-white transition-all -translate-y-1/2 rounded-full opacity-0 left-4 top-1/2 bg-black/30 hover:bg-black/60 backdrop-blur-sm group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setCurrentImgIndex((prev) => (prev + 1) % hotel.images.length)
                }
                className="absolute p-2 text-white transition-all -translate-y-1/2 rounded-full opacity-0 right-4 top-1/2 bg-black/30 hover:bg-black/60 backdrop-blur-sm group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
                {hotel.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImgIndex ? "bg-white w-4" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* --- 3. Content Grid (Details + Booking Sidebar) --- */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Column: Details */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">About this place</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {hotel.description}
              </p>
            </div>
            <hr className="border-border" />

            {/* Amenities */}
            <div>
              <h2 className="mb-6 text-2xl font-bold">
                What this place offers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-y-4 gap-x-8">
                {hotel.amenities?.map((amenity, index) => {
                  const IconData = amenityIcons[amenity];
                  const Icon = IconData ? IconData.icon : CheckCircle2;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-foreground/80"
                    >
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="text-base">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <hr className="border-border" />

            {/* Features */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Property Features</h2>
              <div className="flex flex-wrap gap-2">
                {hotel.features?.map((feature, idx) => (
                  <span
                    key={idx}
                    className="bg-secondary px-3 py-1.5 rounded-lg text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card (Sticky) */}
          <div className="relative">
            <div className="sticky p-6 border shadow-xl top-28 bg-card border-border rounded-2xl">
              {/* Price Header */}
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-sm line-through text-muted-foreground">
                    {currency} {convertPrice(basePrice)}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="mr-1 text-xs font-medium text-muted-foreground">
                      Starting from
                    </span>
                    <span className="text-3xl font-bold text-primary">
                      {currency} {convertPrice(pricePerNight)}
                    </span>
                    <span className="text-muted-foreground">/ night</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-secondary">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{hotel.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({hotel.reviews})
                  </span>
                </div>
              </div>

              {/* Booking Inputs (New Popover Logic) */}
              <div className="mb-6 space-y-4">
                {/* Date Picker (Check-in / Check-out) */}
                <div className="grid grid-cols-1 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd")} -{" "}
                              {format(date.to, "LLL dd")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
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

                {/* Guests Selector (Adults / Children) */}
                <div className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-between w-full h-12"
                      >
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span>
                            {guests.adults} Adults, {guests.children} Children
                          </span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 w-80">
                      <div className="space-y-4">
                        <h4 className="font-medium leading-none text-muted-foreground">
                          Guests
                        </h4>
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Adults</span>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() => updateGuests("adults", "dec")}
                              disabled={guests.adults <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-4 text-center">
                              {guests.adults}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() => updateGuests("adults", "inc")}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {/* Children */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Children</span>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() => updateGuests("children", "dec")}
                              disabled={guests.children <= 0}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-4 text-center">
                              {guests.children}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() => updateGuests("children", "inc")}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-4 mb-6 space-y-2 bg-secondary/30 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="underline text-muted-foreground">
                    {currency} {convertPrice(pricePerNight)} x {nights} nights
                  </span>
                  <span>
                    {currency} {convertPrice(pricePerNight * nights)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="underline text-muted-foreground">
                    Service fee
                  </span>
                  <span>
                    {currency} {convertPrice(25)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 mt-2 text-lg font-bold border-t border-border">
                  <span>Total</span>
                  <span>
                    {currency} {convertPrice(pricePerNight * nights + 25)}
                  </span>
                </div>
              </div>

              <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20">
                Reserve
              </Button>

              <p className="mt-4 text-xs text-center text-muted-foreground">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleHotel;
