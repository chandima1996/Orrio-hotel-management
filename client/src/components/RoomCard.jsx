import { Users, Square, Wifi, Wind, Coffee, Tv, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

// Amenity Icon Helper
const getAmenityIcon = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("wifi")) return <Wifi className="w-3 h-3" />;
  if (lowerName.includes("ac") || lowerName.includes("air"))
    return <Wind className="w-3 h-3" />;
  if (lowerName.includes("breakfast") || lowerName.includes("kitchen"))
    return <Coffee className="w-3 h-3" />;
  if (lowerName.includes("tv")) return <Tv className="w-3 h-3" />;
  return <Star className="w-3 h-3" />;
};

const RoomCard = ({ room, layout = "grid" }) => {
  if (!room) return null;

  // කාමරයට පින්තූර එකකට වඩා තියෙනවා කියලා උපකල්පනය කරමු.
  // නැත්නම් තනි පින්තූරයක් array එකක් කරමු.
  const images = Array.isArray(room.images)
    ? room.images
    : [room.image || "https://via.placeholder.com/400"];

  return (
    <div
      className={cn(
        "group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-500",
        layout === "list"
          ? "flex flex-col md:flex-row h-auto md:h-64"
          : "flex flex-col h-full"
      )}
    >
      {/* 1. Image Carousel Section */}
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          layout === "list" ? "w-full md:w-2/5 h-56 md:h-full" : "h-64 w-full"
        )}
      >
        <Carousel
          plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]} // Auto Swipe
          className="w-full h-full"
        >
          <CarouselContent className="h-full ml-0">
            {images.map((img, index) => (
              <CarouselItem key={index} className="pl-0 h-full">
                <img
                  src={img}
                  alt={`${room.name} - view ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Arrows show only on hover */}
          <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white border-0" />
          <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white border-0" />
        </Carousel>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-sm shadow-sm border-0">
            {room.size} m²
          </Badge>
        </div>
      </div>

      {/* 2. Content Section */}
      <div
        className={cn(
          "p-5 flex flex-col flex-grow justify-between",
          layout === "list" ? "w-full md:w-3/5" : ""
        )}
      >
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
              {room.name}
            </h3>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Users className="w-4 h-4" />
            <span>Max {room.capacity} Guests</span>
          </div>

          {/* Amenities with Icons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 text-xs font-medium bg-secondary/50 px-2 py-1 rounded-lg text-secondary-foreground border border-border/50"
              >
                {getAmenityIcon(item)}
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Price (No Button) */}
        <div
          className={cn(
            "flex items-end justify-between pt-4 border-t border-border",
            layout === "list" ? "mt-0" : "mt-auto"
          )}
        >
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Total Price
            </span>
            <span className="text-xs text-green-500 font-semibold">
              Free Cancellation
            </span>
          </div>

          <div className="text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-2xl font-bold text-primary">
                ${room.price}
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                / night
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground block">
              Includes taxes & fees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
