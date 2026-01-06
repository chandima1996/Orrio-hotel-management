import React from "react";
import { useNavigate } from "react-router-dom"; // Navigation සදහා
import {
  Users,
  Wifi,
  Wind,
  Coffee,
  Tv,
  Star,
  ArrowRight,
  BedDouble,
} from "lucide-react";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";

// Helper: Get Icon based on amenity name
const getAmenityIcon = (name) => {
  if (!name) return <Star className="w-3 h-3" />;
  const lowerName = name.toLowerCase();
  if (lowerName.includes("wifi")) return <Wifi className="w-3 h-3" />;
  if (lowerName.includes("ac") || lowerName.includes("air"))
    return <Wind className="w-3 h-3" />;
  if (lowerName.includes("bed")) return <BedDouble className="w-3 h-3" />;
  if (
    lowerName.includes("breakfast") ||
    lowerName.includes("kitchen") ||
    lowerName.includes("coffee")
  )
    return <Coffee className="w-3 h-3" />;
  if (lowerName.includes("tv")) return <Tv className="w-3 h-3" />;
  return <Star className="w-3 h-3" />;
};

const RoomCard = ({ room, layout = "grid" }) => {
  const navigate = useNavigate(); // Hook to handle navigation
  const { currency, convertPrice } = useCurrency();

  // Safety check: if no room data, don't render
  if (!room) return null;

  // Image handling
  const images =
    Array.isArray(room.images) && room.images.length > 0
      ? room.images
      : ["https://via.placeholder.com/400x300?text=No+Image"];

  // Price Calculation
  const normalPrice = room.price?.normal || 0;
  const discount = room.price?.discount || 0;
  const finalPrice = normalPrice - discount;

  // Safe Amenities list
  const amenitiesList = room.amenities || [];

  // Handle View Room Click
  const handleViewRoom = () => {
    // MongoDB ID එක _id ද නැත්නම් id ද කියලා බලලා හරියටම දාන්න
    const roomId = room._id || room.id;
    navigate(`/room/${roomId}`);
  };

  return (
    <div
      className={cn(
        "group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex",
        layout === "list" ? "flex-col md:flex-row h-auto" : "flex-col h-full"
      )}
    >
      {/* --- Image Carousel Section --- */}
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          layout === "list" ? "w-full md:w-2/5 h-64 md:h-auto" : "h-64 w-full"
        )}
      >
        <Carousel
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
          className="w-full h-full"
        >
          <CarouselContent className="h-full ml-0">
            {images.map((img, index) => (
              <CarouselItem key={index} className="h-full pl-0">
                <img
                  src={img}
                  alt={room.name || "Room Image"}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controls: Only visible on hover */}
          <CarouselPrevious className="absolute text-white transition-opacity -translate-y-1/2 border-0 opacity-0 left-2 top-1/2 group-hover:opacity-100 bg-black/30 backdrop-blur-sm hover:bg-black/50" />
          <CarouselNext className="absolute text-white transition-opacity -translate-y-1/2 border-0 opacity-0 right-2 top-1/2 group-hover:opacity-100 bg-black/30 backdrop-blur-sm hover:bg-black/50" />
        </Carousel>

        {/* Discount Badge */}
        <div className="absolute flex gap-2 top-3 left-3">
          {discount > 0 && (
            <Badge className="text-white bg-red-500 border-0 shadow-sm animate-pulse">
              Save {currency} {convertPrice(discount)}
            </Badge>
          )}
        </div>
      </div>

      {/* --- Content Section --- */}
      <div
        className={cn(
          "p-5 flex flex-col justify-between flex-grow",
          layout === "list" ? "w-full md:w-3/5" : "w-full"
        )}
      >
        <div>
          {/* Title & Size */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold transition-colors group-hover:text-primary line-clamp-1">
                {room.name || room.title}
              </h3>
              {room.size && (
                <span className="text-xs text-muted-foreground">
                  {room.size} m²
                </span>
              )}
            </div>
          </div>

          {/* Key Features */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-primary" />
              <span>Max {room.capacity} Guests</span>
            </div>
            {room.bedCount && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-4 h-4 text-primary" />
                <span>{room.bedCount} Beds</span>
              </div>
            )}
          </div>

          {/* Amenities Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {amenitiesList.slice(0, 5).map((item, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="flex items-center gap-1 font-normal text-secondary-foreground/80"
              >
                {getAmenityIcon(item)} {item}
              </Badge>
            ))}
            {amenitiesList.length > 5 && (
              <span className="self-center text-xs text-muted-foreground">
                +{amenitiesList.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* --- Price & Action Footer --- */}
        <div className="pt-4 mt-auto border-t border-border/50">
          <div className="flex items-end justify-between gap-4">
            {/* Price Info */}
            <div>
              {discount > 0 && (
                <span className="block text-xs line-through text-muted-foreground">
                  {currency} {convertPrice(normalPrice)}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">
                  {currency} {convertPrice(finalPrice)}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  / night
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                Excludes taxes & fees
              </span>
            </div>

            {/* View Room Button (Navigates to Single Page) */}
            <Button
              onClick={handleViewRoom}
              className={cn(
                "font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95",
                layout === "grid" ? "w-auto" : "w-auto px-6"
              )}
            >
              View Room <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
