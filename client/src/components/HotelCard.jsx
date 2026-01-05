import {
  MapPin,
  Star,
  Wifi,
  Droplets,
  Dumbbell,
  Utensils,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // shadcn utils (nathi nam meka ain karala 'clsx' wage ekak use karanna puluwan, eth godak welawata shadcn ekka meka enawa)

// Amenities වලට අදාළ අයිකන් තෝරන function එක
const getAmenityIcon = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("wifi")) return <Wifi className="w-3 h-3" />;
  if (lowerName.includes("pool")) return <Droplets className="w-3 h-3" />;
  if (lowerName.includes("gym")) return <Dumbbell className="w-3 h-3" />;
  if (lowerName.includes("dining") || lowerName.includes("restaurant"))
    return <Utensils className="w-3 h-3" />;
  return <Star className="w-3 h-3" />;
};

const HotelCard = ({ hotel, layout = "grid" }) => {
  if (!hotel) return null;

  const {
    image = "https://via.placeholder.com/400",
    name = "Unknown Hotel",
    location = "Unknown Location",
    rating = 0,
    type = "Hotel",
    price = 0,
    amenities = [],
    _id,
  } = hotel;

  return (
    <div
      className={`group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 ${
        layout === "list"
          ? "flex flex-col md:flex-row h-auto md:h-64"
          : "flex flex-col h-full"
      }`}
    >
      {/* Image Section */}
      <div
        className={`relative overflow-hidden ${
          layout === "list" ? "w-full md:w-1/3 h-48 md:h-full" : "h-64 w-full"
        }`}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          {rating}
        </div>
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-black hover:bg-white">
            {type}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div
        className={`p-5 flex flex-col flex-grow ${
          layout === "list" ? "w-full md:w-2/3 justify-between" : ""
        }`}
      >
        {/* Top Details */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {name}
              </h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="w-3 h-3 mr-1" />
                {location}
              </div>
            </div>
          </div>

          {/* Amenities List (Icon + Name) */}
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {amenities.slice(0, 3).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground border border-border"
              >
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
            {amenities.length > 3 && (
              <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                +{amenities.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Price & Button */}
        <div
          className={`mt-auto flex items-center justify-between pt-4 border-t border-border ${
            layout === "list" ? "border-t-0 md:border-t" : ""
          }`}
        >
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-semibold">
              Starting from
            </span>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-primary">${price}</span>
              <span className="text-sm text-muted-foreground mb-1">
                / night
              </span>
            </div>
          </div>

          <Link to={`/hotels/${_id}`}>
            <Button
              size="sm"
              className="rounded-xl group-hover:translate-x-1 transition-transform"
            >
              View Details <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
