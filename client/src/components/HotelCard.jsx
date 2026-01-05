import { Link } from "react-router-dom";
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
  MonitorPlay,
  Coffee,
  ArrowRight,
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

// 1. Database එකේ තියෙන නම් වලට Icons ගැලපීම
const amenityIcons = {
  "High-Speed Wifi": { icon: Wifi, label: "Wifi" },
  "Infinity Pool": { icon: Waves, label: "Pool" },
  "Luxury Gym": { icon: Dumbbell, label: "Gym" },
  "Fine Dining": { icon: Utensils, label: "Dining" },
  "Spa & Wellness": { icon: Coffee, label: "Spa" },
  "Bar / Lounge": { icon: Utensils, label: "Bar" },
  "Free Parking": { icon: Car, label: "Parking" },
  "Air Conditioning": { icon: Wind, label: "A/C" },
  "Private Beach": { icon: Umbrella, label: "Beach" },
  "24/7 Concierge": { icon: ConciergeBell, label: "Concierge" },
};

const HotelCard = ({ hotel }) => {
  const { currency, convertPrice } = useCurrency();

  const displayImage =
    hotel.images && hotel.images.length > 0
      ? hotel.images[0]
      : "https://via.placeholder.com/400x300";

  const basePrice = hotel.price?.normal || 0;
  const discountAmount = hotel.price?.discount || 0;
  const finalPrice = basePrice - discountAmount;

  return (
    <Link to={`/hotels/${hotel._id}`} className="group block h-full">
      <div className="bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-300 h-full flex flex-col relative">
        {/* --- Image Section --- */}
        <div className="relative h-60 overflow-hidden">
          <img
            src={displayImage}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {hotel.featured && (
              <span className="bg-white/90 backdrop-blur text-black text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                Featured
              </span>
            )}
            {discountAmount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide animate-pulse">
                Save {currency} {convertPrice(discountAmount)}
              </span>
            )}
          </div>

          {/* Bottom Info on Image */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <div className="text-white">
              <p className="text-xs font-medium opacity-90 flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3" /> {hotel.location}
              </p>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-sm">{hotel.rating}</span>
                <span className="text-xs opacity-70">
                  ({hotel.reviews} Reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="p-5 flex flex-col flex-grow gap-4">
          <div>
            <div className="text-[10px] font-bold text-primary tracking-wider uppercase mb-1">
              {hotel.type}
            </div>
            <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
              {hotel.name}
            </h3>
          </div>

          {/* Amenities with Icons (Professional Look) */}
          <div className="flex flex-wrap gap-3">
            {hotel.amenities?.slice(0, 4).map((amenity, index) => {
              const IconData = amenityIcons[amenity];
              const IconComponent = IconData ? IconData.icon : CheckCircle2;
              const Label = IconData ? IconData.label : amenity;

              return (
                <div
                  key={index}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full"
                >
                  {IconData && <IconComponent className="w-3.5 h-3.5" />}
                  <span className="font-medium">{Label}</span>
                </div>
              );
            })}
            {hotel.amenities?.length > 4 && (
              <span className="text-xs text-muted-foreground self-center">
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>

          {/* Pricing Footer */}
          <div className="mt-auto pt-4 border-t border-border/50 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Price per night
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">
                  {currency} {convertPrice(finalPrice)}
                </span>
                {discountAmount > 0 && (
                  <span className="text-xs text-muted-foreground line-through">
                    {convertPrice(basePrice)}
                  </span>
                )}
              </div>
            </div>

            <button className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
