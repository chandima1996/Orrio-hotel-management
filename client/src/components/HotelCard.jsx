import { MapPin, Star, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";

const HotelCard = ({ hotel }) => {
  // පින්තූර Array එකක් තිබේ නම් එය ගන්න, නැත්නම් තනි පින්තූරය Array එකක් ලෙස ගන්න
  const images =
    hotel.images && hotel.images.length > 0
      ? hotel.images
      : [hotel.image || "https://via.placeholder.com/400"];

  return (
    <Card className="group overflow-hidden rounded-3xl border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-500 h-full flex flex-col">
      {/* --- IMAGE CAROUSEL SECTION --- */}
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        <Carousel
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]} // Auto Swipe
          className="w-full h-full"
        >
          <CarouselContent className="h-full ml-0">
            {images.map((img, index) => (
              <CarouselItem key={index} className="pl-0 h-full">
                <img
                  src={img}
                  alt={`${hotel.name} - view ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows (Only visible on hover) */}
          <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white border-0 h-8 w-8" />
          <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white border-0 h-8 w-8" />
        </Carousel>

        {/* Top Badges (Overlaid on Image) */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <Badge className="bg-white/90 text-foreground hover:bg-white font-semibold shadow-sm backdrop-blur-md border-0">
            {hotel.type || "Resort"}
          </Badge>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-white hover:text-red-500 transition-all backdrop-blur-sm z-10">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{hotel.location}</span>
            </div>
          </div>

          {/* Rating Box */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="text-xs font-bold text-primary">
                {hotel.rating}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">
              {hotel.reviews} reviews
            </span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mt-2 mb-4">
          {hotel.description}
        </p>

        {/* Price & Action */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-medium">
              Starts from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                ${hotel.price}
              </span>
              <span className="text-sm text-muted-foreground">/ night</span>
            </div>
          </div>

          <Link to={`/hotels/${hotel._id}`}>
            <Button className="rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              View Details{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default HotelCard;
