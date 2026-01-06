import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import {
  ArrowLeft,
  Wifi,
  Wind,
  Tv,
  Users,
  BedDouble,
  Maximize,
  CheckCircle2,
  Info,
  Coffee,
  Bath,
  Share2,
  Heart,
  ShieldCheck,
  CreditCard,
  Sparkles,
} from "lucide-react";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { cn } from "@/lib/utils";
import axios from "axios";

// --- Icons Helper ---
const getAmenityIcon = (name) => {
  if (!name) return <CheckCircle2 className="w-4 h-4" />;
  const lower = name.toLowerCase();
  if (lower.includes("wifi")) return <Wifi className="w-4 h-4" />;
  if (lower.includes("ac") || lower.includes("air"))
    return <Wind className="w-4 h-4" />;
  if (lower.includes("tv")) return <Tv className="w-4 h-4" />;
  if (lower.includes("bed")) return <BedDouble className="w-4 h-4" />;
  if (lower.includes("bath") || lower.includes("shower"))
    return <Bath className="w-4 h-4" />;
  if (lower.includes("breakfast") || lower.includes("coffee"))
    return <Coffee className="w-4 h-4" />;
  return <CheckCircle2 className="w-4 h-4" />;
};

const SingleRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency, convertPrice } = useCurrency();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- Real Data Fetching ---
  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(res.data);
      } catch (err) {
        console.error("Error fetching room:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 text-primary animate-pulse">
        <div className="w-12 h-12 border-4 border-current rounded-full border-t-transparent animate-spin" />
        <span className="text-lg font-medium">
          Loading Luxury Experience...
        </span>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-center">
        <h2 className="text-2xl font-bold text-destructive">Room Not Found</h2>
        <p className="text-muted-foreground">
          The room you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  // Handle Price Structure
  const normalPrice = room.price?.normal || room.price || 0;
  const discount = room.price?.discount || 0;
  const finalPrice = normalPrice - discount;

  // Handle Images
  const images =
    room.images && room.images.length > 0
      ? room.images
      : ["https://via.placeholder.com/800x600?text=No+Image+Available"];

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 z-50 px-6 py-3 border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="hidden text-lg font-semibold truncate md:block text-foreground/80">
              {room.title || room.name}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl px-4 mx-auto mt-6">
        {/* --- Hero Carousel Section (Auto-Swipe) --- */}
        <div className="relative w-full overflow-hidden shadow-2xl rounded-3xl group">
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px] md:h-[550px] w-full">
                    <img
                      src={img}
                      alt={`Room View ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute w-12 h-12 text-white transition-opacity -translate-y-1/2 border-0 opacity-0 left-4 top-1/2 group-hover:opacity-100 bg-white/20 backdrop-blur-md hover:bg-white/40" />
            <CarouselNext className="absolute w-12 h-12 text-white transition-opacity -translate-y-1/2 border-0 opacity-0 right-4 top-1/2 group-hover:opacity-100 bg-white/20 backdrop-blur-md hover:bg-white/40" />
          </Carousel>

          <div className="absolute px-3 py-1 text-xs font-medium text-white rounded-full bg-black/50 bottom-4 right-4 backdrop-blur-sm">
            {images.length} Photos
          </div>
        </div>

        {/* --- Content Layout --- */}
        <div className="grid grid-cols-1 gap-12 mt-10 lg:grid-cols-3">
          {/* LEFT COLUMN: Details */}
          <div className="space-y-8 lg:col-span-2">
            {/* Title & Stats */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-sm border-primary/40 text-primary bg-primary/5"
                >
                  {room.type || "Luxury Suite"}
                </Badge>
                {discount > 0 && (
                  <Badge
                    variant="destructive"
                    className="px-3 py-1 text-sm animate-pulse"
                  >
                    Limited Time Offer
                  </Badge>
                )}
              </div>

              <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
                {room.title || room.name}
              </h1>

              {/* Key Stats Bar */}
              <div className="grid grid-cols-2 gap-4 p-5 border shadow-sm md:grid-cols-4 bg-card rounded-2xl">
                <div className="flex flex-col items-center justify-center gap-1 text-center">
                  <Users className="w-5 h-5 mb-1 text-primary" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Capacity
                  </span>
                  <span className="font-medium">
                    {room.capacity || 2} Guests
                  </span>
                </div>

                {room.size && (
                  <div className="flex flex-col items-center justify-center gap-1 text-center border-l">
                    <Maximize className="w-5 h-5 mb-1 text-primary" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Size
                    </span>
                    <span className="font-medium">{room.size} m²</span>
                  </div>
                )}

                {room.bedType && (
                  <div className="flex flex-col items-center justify-center gap-1 text-center border-l">
                    <BedDouble className="w-5 h-5 mb-1 text-primary" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Bed Type
                    </span>
                    <span className="font-medium">{room.bedType}</span>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center gap-1 text-center border-l">
                  <Wifi className="w-5 h-5 mb-1 text-primary" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Internet
                  </span>
                  <span className="font-medium">Free WiFi</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">About this Space</h2>
              <p className="text-lg leading-7 text-justify text-muted-foreground">
                {room.description ||
                  "Experience the epitome of comfort and style. This room is designed to provide you with a relaxing atmosphere, complete with modern amenities and breathtaking views."}
              </p>
            </div>

            <Separator />

            {/* Amenities Grid */}
            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold">
                  What this room offers
                </h2>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 md:grid-cols-3">
                  {room.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 group">
                      <div className="p-2 transition-colors rounded-lg bg-secondary text-foreground group-hover:bg-primary/20 group-hover:text-primary">
                        {getAmenityIcon(item)}
                      </div>
                      <span className="text-base transition-colors text-muted-foreground group-hover:text-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policies */}
            <div className="p-6 border bg-muted/20 rounded-2xl border-border/60">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-foreground">
                <Info className="w-5 h-5 text-primary" /> House Rules
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {(room.policies && room.policies.length > 0
                  ? room.policies
                  : [
                      "Check-in: 2:00 PM",
                      "Check-out: 11:00 AM",
                      "No smoking inside the room",
                      "Pets are not allowed",
                    ]
                ).map((policy, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {policy}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Information Card (Updated) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative overflow-hidden bg-white border shadow-xl dark:bg-card rounded-3xl border-primary/5">
                {/* Decorative Header Gradient */}
                <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/30" />

                {/* Price Section */}
                <div className="p-6 pb-2">
                  <h3 className="mb-4 text-sm font-bold tracking-widest uppercase text-muted-foreground">
                    Price Details
                  </h3>

                  <div className="p-4 border rounded-2xl bg-secondary/30 border-secondary">
                    <div className="flex flex-col gap-1">
                      {discount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm line-through text-muted-foreground decoration-red-500/50">
                            {currency} {convertPrice(normalPrice)}
                          </span>
                          <Badge
                            variant="destructive"
                            className="text-[10px] uppercase tracking-wide px-1.5 h-5"
                          >
                            Save {currency} {convertPrice(discount)}
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-foreground">
                          {currency} {convertPrice(finalPrice)}
                        </span>
                        <span className="font-medium text-muted-foreground">
                          / night
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Includes taxes & fees
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefits List (Replacing the Button) */}
                <div className="p-6 pt-2 space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Free Cancellation
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Cancel up to 24 hours before check-in for a full
                          refund.
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    <div className="flex items-start gap-3">
                      <div className="p-2 text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          No Prepayment Needed
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Pay at the property upon arrival.
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Best Price Guaranteed
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          You are getting the best rate available.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <p className="text-xs italic text-muted-foreground">
                      *Contact property for long-term stay discounts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRoom;
