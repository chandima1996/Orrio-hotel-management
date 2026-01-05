import { useState, useEffect } from "react";
import { MapPin, Star, Wifi, Droplets, Dumbbell, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // cn utility එක පාවිච්චි කරනවා classes එකතු කරන්න

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

// layout prop එක අලුතෙන් එකතු කළා ("grid" or "list")
const HotelCard = ({ hotel, layout = "grid" }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (hotel.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % hotel.images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [hotel.images.length]);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-3xl border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300",
        layout === "list"
          ? "flex flex-col md:flex-row h-auto md:h-64"
          : "h-full flex flex-col"
      )}
    >
      {/* 1. Image Section */}
      <div
        className={cn(
          "relative overflow-hidden bg-gray-900",
          layout === "list" ? "w-full md:w-1/3 h-48 md:h-full" : "h-64 w-full"
        )}
      >
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-yellow-400 font-bold text-sm z-10 border border-white/10">
          <Star className="w-3 h-3 fill-yellow-400" />
          {hotel.rating}
        </div>

        {hotel.featured && (
          <Badge className="absolute top-4 left-4 bg-primary/90 hover:bg-primary backdrop-blur-md border-none text-white z-10 shadow-lg">
            Featured
          </Badge>
        )}
      </div>

      {/* 2. Content Section */}
      <div
        className={cn(
          "flex flex-col flex-grow",
          layout === "list" ? "p-2" : ""
        )}
      >
        <CardContent className="p-5 flex-grow">
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

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {hotel.description}
          </p>

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
      </div>
    </Card>
  );
};

export default HotelCard;
