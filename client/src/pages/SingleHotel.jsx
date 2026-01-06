import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Calendar,
  Users,
  Share2,
  Heart,
} from "lucide-react";

// Icons Mapping (HotelCard එකේ වගේම)
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
  const { id } = useParams(); // URL එකෙන් ID එක ගන්නවා
  const { currency, convertPrice } = useCurrency();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Calculation States
  const [nights, setNights] = useState(1);
  const [rooms, setRooms] = useState(1);

  // 1. Backend එකෙන් Hotel Data ගන්න function එක
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="text-center py-20">Hotel not found!</div>;
  }

  // Price Calculations
  const basePrice = hotel.price?.normal || 0;
  const discount = hotel.price?.discount || 0;
  const pricePerNight = basePrice - discount;
  const totalPrice = pricePerNight * nights * rooms;

  return (
    <div className="min-h-screen bg-background pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* --- 1. Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                {hotel.type}
              </span>
              {hotel.featured && (
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Top Rated
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              {hotel.address}, {hotel.location}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:text-red-500 hover:bg-red-50 hover:border-red-200"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button>Reserve Now</Button>
          </div>
        </div>

        {/* --- 2. Image Gallery (Grid Layout) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 relative h-full">
            <img
              src={hotel.images[0] || "https://via.placeholder.com/800"}
              alt="Main"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Side Images */}
          {/* If there are more images, map them, otherwise show placeholders */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative h-full overflow-hidden hidden md:block"
            >
              <img
                src={hotel.images[i] || hotel.images[0]}
                alt={`Gallery ${i}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* --- 3. Content Grid (Details + Booking Sidebar) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About this place</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {hotel.description}
              </p>
            </div>

            <hr className="border-border" />

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
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

            {/* Features / Policy */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Property Features</h2>
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
            <div className="sticky top-28 bg-card border border-border rounded-2xl p-6 shadow-xl">
              {/* Price Header */}
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-muted-foreground line-through text-sm">
                    {currency} {convertPrice(basePrice)}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">
                      {currency} {convertPrice(pricePerNight)}
                    </span>
                    <span className="text-muted-foreground">/ night</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{hotel.rating}</span>
                  <span className="text-muted-foreground text-xs">
                    ({hotel.reviews})
                  </span>
                </div>
              </div>

              {/* Booking Inputs */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Check-in
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="date" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Check-out
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="date" className="pl-9" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      defaultValue="2"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-secondary/30 p-4 rounded-xl mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline">
                    {convertPrice(pricePerNight)} x {nights} nights
                  </span>
                  <span>
                    {currency} {convertPrice(pricePerNight * nights)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline">
                    Service fee
                  </span>
                  <span>
                    {currency} {convertPrice(25)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-lg mt-2">
                  <span>Total</span>
                  <span>
                    {currency} {convertPrice(pricePerNight * nights + 25)}
                  </span>
                </div>
              </div>

              <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20">
                Reserve
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
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
