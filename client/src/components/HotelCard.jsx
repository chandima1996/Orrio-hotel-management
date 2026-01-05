import {
  MapPin,
  Star,
  Heart,
  ArrowRight,
  Wifi,
  Waves,
  Utensils,
  Dumbbell,
  Martini,
  Car,
  Snowflake,
} from "lucide-react";
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
import { useCurrency } from "@/context/CurrencyContext";

// 1. Amenities සහ Icons මැප් කරන Object එක
const amenityIcons = {
  wifi: { icon: Wifi, label: "Free Wifi" },
  pool: { icon: Waves, label: "Pool" },
  restaurant: { icon: Utensils, label: "Restaurant" },
  gym: { icon: Dumbbell, label: "Gym" },
  bar: { icon: Martini, label: "Bar" },
  parking: { icon: Car, label: "Parking" },
  spa: { icon: Snowflake, label: "Spa" },
  ac: { icon: Snowflake, label: "A/C" },
  hwater: { icon: Waves, label: "Hot Water" },
};

const HotelCard = ({ hotel }) => {
  const { formatPrice } = useCurrency();

  // 2. Images නැති විට Placeholder එකක් පෙන්වීම
  const images =
    hotel.images && hotel.images.length > 0
      ? hotel.images
      : [hotel.image || "https://via.placeholder.com/400"];

  // 3. Price Error Fix: Featured වල 'cheapestPrice' එන්නේ, අනිත් ඒවායේ 'price' වෙන්න පුළුවන්
  const finalPrice = hotel.cheapestPrice || hotel.price || 0;

  return (
    <Card className="group overflow-hidden rounded-3xl border-border/50 bg-card hover:shadow-2xl hover:border-primary/20 transition-all duration-500 h-full flex flex-col">
      {/* Image Carousel */}
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        <Carousel
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
          className="w-full h-full"
        >
          <CarouselContent className="h-full ml-0">
            {images.map((img, index) => (
              <CarouselItem key={index} className="pl-0 h-full">
                <img
                  src={img}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white border-0 h-8 w-8" />
          <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white border-0 h-8 w-8" />
        </Carousel>

        <div className="absolute top-4 left-4 z-10">
          {/* 4. Fix: Hotel Type එක හැමවෙලේම කළු පාටින් පෙන්වන්න (text-black) */}
          <Badge className="bg-white/90 text-black hover:bg-white font-bold shadow-sm backdrop-blur-md border-0 px-3 py-1">
            {hotel.type || "Resort"}
          </Badge>
        </div>
        <button className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-white hover:text-red-500 transition-all backdrop-blur-sm z-10">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
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
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="text-xs font-bold text-primary">
                {hotel.rating}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">
              {hotel.reviews || 0} reviews
            </span>
          </div>
        </div>

        {/* 5. Amenities Section (New) */}
        <div className="flex items-center gap-3 my-3 overflow-hidden">
          {hotel.amenities?.slice(0, 3).map((item, index) => {
            const Amenity = amenityIcons[item];
            if (!Amenity) return null;
            return (
              <div
                key={index}
                className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full"
              >
                <Amenity.icon className="w-3 h-3" />
                <span>{Amenity.label}</span>
              </div>
            );
          })}
          {hotel.amenities?.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mt-1 mb-4">
          {hotel.description}
        </p>

        {/* Price Section with Currency */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-medium">
              Starts from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary">
                {/* 6. NaN fix using finalPrice variable */}
                {formatPrice(finalPrice)}
              </span>
              <span className="text-sm text-muted-foreground">/ night</span>
            </div>
          </div>
          <Link to={`/hotels/${hotel._id}`}>
            <Button className="rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              View{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default HotelCard;
