import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Wifi,
  Droplets,
  Dumbbell,
  Utensils,
  CheckCircle,
  Phone,
  Mail,
  ArrowLeft,
  LayoutGrid,
  List,
  Share2,
  Heart,
} from "lucide-react";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Other Imports
import Autoplay from "embla-carousel-autoplay";
import RoomCard from "@/components/RoomCard"; // Ensure this path is correct

// --- MOCK DATA ---
const hotelData = {
  _id: "1",
  name: "Crystal Sands Resort",
  location: "Maldives, South Atoll",
  address: "No 12, Paradise Island, North Male Atoll, Maldives",
  contact: "+960 123 4567",
  email: "reservations@crystalsands.com",
  description:
    "Experience the ultimate luxury at Crystal Sands Resort. Nestled in the heart of the Maldives, our overwater villas offer breathtaking views of the turquoise ocean. Enjoy world-class dining, a rejuvenating spa, and endless water sports adventures.",
  price: 450,
  rating: 4.8,
  reviews: 128,
  type: "Luxury Resort",
  images: [
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000",
    "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=1000",
  ],
  amenities: [
    { name: "High-Speed Wifi", icon: <Wifi className="w-4 h-4" /> },
    { name: "Infinity Pool", icon: <Droplets className="w-4 h-4" /> },
    { name: "Luxury Gym", icon: <Dumbbell className="w-4 h-4" /> },
    { name: "Fine Dining", icon: <Utensils className="w-4 h-4" /> },
  ],
  features: [
    "Private Beach Access",
    "24/7 Room Service",
    "Airport Shuttle",
    "Kids Club",
    "Water Sports Center",
  ],

  // Room Data
  rooms: [
    {
      id: 101,
      name: "Ocean View Suite",
      price: 450,
      capacity: 2,
      size: 45,
      amenities: ["King Bed", "AC", "Wifi", "Ocean Balcony", "Minibar"],
      images: [
        "https://images.unsplash.com/photo-1590490360182-c87299619653?q=80&w=1000",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000",
      ],
    },
    {
      id: 102,
      name: "Family Beach Villa",
      price: 750,
      capacity: 4,
      size: 80,
      amenities: ["2 Queen Beds", "Kitchen", "Pool", "TV", "Terrace"],
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000",
        "https://images.unsplash.com/photo-1616594039964-40891a904a0f?q=80&w=1000",
      ],
    },
    {
      id: 103,
      name: "Garden Deluxe Room",
      price: 200,
      capacity: 2,
      size: 35,
      amenities: ["Double Bed", "Wifi", "Garden View", "Work Desk"],
      images: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1000",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1000",
      ],
    },
    {
      id: 104,
      name: "Presidential Penthouse",
      price: 1200,
      capacity: 6,
      size: 150,
      amenities: [
        "3 King Beds",
        "Private Jacuzzi",
        "Butler Service",
        "Cinema Room",
      ],
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1000",
      ],
    },
  ],
};

const SingleHotel = () => {
  const { id } = useParams();
  const hotel = hotelData;

  // --- STATE ---
  const [roomViewMode, setRoomViewMode] = useState("grid"); // 'grid' or 'list'
  const [roomSort, setRoomSort] = useState("recommended");

  // --- SORTING LOGIC ---
  const sortedRooms = useMemo(() => {
    if (!hotel.rooms) return [];
    const roomsCopy = [...hotel.rooms];

    if (roomSort === "price-low") {
      return roomsCopy.sort((a, b) => a.price - b.price);
    } else if (roomSort === "price-high") {
      return roomsCopy.sort((a, b) => b.price - a.price);
    }
    return roomsCopy;
  }, [hotel.rooms, roomSort]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background animate-in fade-in duration-500">
      <div className="container mx-auto px-4">
        {/* 1. TOP BAR (BACK & ACTIONS) */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/find-hotels"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:translate-x-[-4px] duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hotels
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-muted"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-muted"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 2. HOTEL HEADER (UPDATED WITH ATTRACTIVE PRICE) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          {/* Left: Name & Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="outline"
                className="border-primary/20 text-primary bg-primary/5 px-3 py-1 text-xs uppercase tracking-wider"
              >
                {hotel.type}
              </Badge>
              <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-md border border-yellow-400/20">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                <span className="text-xs font-bold text-yellow-700">
                  {hotel.rating}
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight text-foreground">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm md:text-base">
              <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer group">
                <MapPin className="w-4 h-4 text-primary group-hover:animate-bounce" />
                <span className="underline decoration-dotted underline-offset-4">
                  {hotel.location}
                </span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-border rounded-full"></div>
              <div>
                <b>{hotel.reviews}</b> verified reviews
              </div>
            </div>
          </div>

          {/* Right: ATTRACTIVE PRICE CARD (OPTION 1) */}
          <div className="flex flex-col items-end bg-card border border-border/50 p-5 rounded-2xl shadow-xl shadow-primary/5 min-w-[220px] relative overflow-hidden group">
            {/* Background Gradient Effect */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-primary/20 transition-all duration-700"></div>

            {/* Discount Badge */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground line-through decoration-red-500/50">
                ${hotel.price + 150}
              </span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                Save 25%
              </Badge>
            </div>

            {/* Main Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-muted-foreground mb-1">
                from
              </span>
              <span className="text-4xl font-black text-primary tracking-tight">
                ${hotel.price}
              </span>
            </div>

            {/* Subtext */}
            <div className="flex flex-col items-end mt-1">
              <span className="text-xs font-semibold text-foreground/80">
                + $35 taxes & fees
              </span>
              <span className="text-[10px] text-muted-foreground">
                per night for 1 room
              </span>
            </div>
          </div>
        </div>

        {/* 3. MAIN IMAGE CAROUSEL */}
        <div className="mb-12 relative group">
          <Carousel
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
            className="w-full rounded-3xl overflow-hidden shadow-2xl"
          >
            <CarouselContent>
              {hotel.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="h-[400px] md:h-[600px] w-full bg-muted relative">
                    <img
                      src={img}
                      alt="Hotel View"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-0 text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-0 text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Carousel>
        </div>

        {/* 4. CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- LEFT COLUMN (DETAILS & ROOMS) --- */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About this stay</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {hotel.description}
              </p>
            </div>

            {/* Popular Amenities */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Popular Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hotel.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all cursor-default"
                  >
                    <div className="p-3 bg-primary/10 rounded-full mb-3 text-primary">
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What this place offers */}
            <div className="bg-muted/30 rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-foreground/80"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* --- ROOMS SECTION --- */}
            <div id="rooms-section" className="pt-8 border-t border-border">
              {/* Controls Header */}
              <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Available Rooms</h2>
                  <p className="text-muted-foreground mt-1">
                    Select your perfect room
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <Select value={roomSort} onValueChange={setRoomSort}>
                    <SelectTrigger className="w-[180px] h-10 rounded-xl border-border bg-card">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Layout Toggle */}
                  <div className="bg-muted p-1 rounded-xl flex border border-border items-center h-10">
                    <button
                      onClick={() => setRoomViewMode("grid")}
                      className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${
                        roomViewMode === "grid"
                          ? "bg-background shadow-sm text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRoomViewMode("list")}
                      className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${
                        roomViewMode === "list"
                          ? "bg-background shadow-sm text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Room Cards List */}
              {sortedRooms.length > 0 ? (
                <div
                  className={
                    roomViewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {sortedRooms.map((room) => (
                    <RoomCard key={room.id} room={room} layout={roomViewMode} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/20 rounded-3xl border border-dashed">
                  <p className="text-muted-foreground">
                    No rooms available matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT SIDEBAR (STICKY) --- */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-28 border-primary/20 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Location & Contact</h3>

                {/* Map View Placeholder */}
                <div className="w-full h-56 bg-muted rounded-2xl mb-6 overflow-hidden relative group cursor-pointer border border-border">
                  <img
                    src="https://assets.website-files.com/5e832e12eb7ca02ee9064d42/5f915422ccb288543f5a9f34_Location_Map.png"
                    alt="Map Location"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Badge className="bg-white text-black shadow-lg hover:bg-white text-xs px-3 py-1 pointer-events-auto">
                      <MapPin className="w-3 h-3 mr-1 text-primary" /> Show on
                      Map
                    </Badge>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-snug">
                      {hotel.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">
                      {hotel.contact}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">
                      {hotel.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reserve Button */}
              <div className="pt-6 border-t border-border">
                <Button className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all rounded-xl">
                  Reserve Now
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" /> Instant
                  Confirmation
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleHotel;
