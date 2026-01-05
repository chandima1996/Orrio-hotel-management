import { useState, useEffect } from "react";
import { MapPin, Star, Wifi, Droplets, Dumbbell, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getAmenityIcon = (amenity) => {
  switch (amenity.toLowerCase()) {
    case "wifi":
      return <Wifi className="w-3 h-3" />;
    case "pool":
      return <Droplets className="w-3 h-3" />;
    case "gym":
      return <Dumbbell className="w-3 h-3" />;
    case "restaurant":
      return <Utensils className="w-3 h-3" />;
    default:
      return null;
  }
};

const HotelCard = ({ hotel }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // --- Auto Image Slider Logic ---
  useEffect(() => {
    // පින්තූර 1කට වඩා තියෙනවා නම් විතරක් slide වෙන්න
    if (hotel.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % hotel.images.length);
      }, 4000); // තත්පර 4කට සැරයක් මාරු වෙනවා
      return () => clearInterval(interval);
    }
  }, [hotel.images.length]);

  return (
    <Card className="h-full group relative overflow-hidden rounded-3xl border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
      {/* 1. Image Section with Cross-fade */}
      <div className="relative h-64 overflow-hidden bg-gray-900">
        {hotel.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${hotel.name} - ${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImgIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          />
        ))}

        {/* Dark Gradient Overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-yellow-400 font-bold text-sm z-10 border border-white/10">
          <Star className="w-3 h-3 fill-yellow-400" />
          {hotel.rating}
        </div>

        {/* Featured Badge */}
        {hotel.featured && (
          <Badge className="absolute top-4 left-4 bg-primary/90 hover:bg-primary backdrop-blur-md border-none text-white z-10 shadow-lg">
            Featured
          </Badge>
        )}
      </div>

      {/* 2. Content Section */}
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin className="w-3 h-3" />
              {hotel.location}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
          {hotel.description}
        </p>

        {/* Amenities Row */}
        <div className="flex gap-2 mb-4">
          {hotel.amenities.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 p-1.5 rounded-md border border-white/10"
            >
              {getAmenityIcon(item)}
              <span className="capitalize">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>

      {/* 3. Footer */}
      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-white/10 mt-auto">
        <div>
          <span className="text-xs text-muted-foreground">Start from</span>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-primary">
              ${hotel.cheapestPrice}
            </span>
            <span className="text-sm text-muted-foreground mb-1">/night</span>
          </div>
        </div>
        <Button className="rounded-xl bg-white/10 hover:bg-primary hover:text-white text-foreground border border-white/10 transition-all">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HotelCard;
