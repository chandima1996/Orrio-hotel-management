import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import HotelCard from "./HotelCard";
import { Link } from "react-router-dom";

// Mock Data
const featuredHotels = [
  {
    _id: "1",
    name: "Crystal Sands Resort",
    location: "Maldives",
    type: "Resort",
    description:
      "Experience the ultimate luxury in our overwater villas with direct ocean access.",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000",
    ],
    cheapestPrice: 450,
    rating: 4.8,
    reviews: 128,
    amenities: ["wifi", "pool", "spa", "restaurant"],
    featured: true,
  },
  {
    _id: "2",
    name: "Neon City Hotel",
    location: "Tokyo, Japan",
    type: "Hotel",
    description:
      "A futuristic stay in the heart of Tokyo with AI-controlled rooms.",
    images: [
      "https://images.unsplash.com/photo-1590447158019-883d8d5f8bc7?q=80&w=1000",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000",
    ],
    cheapestPrice: 220,
    rating: 4.5,
    reviews: 85,
    amenities: ["wifi", "gym", "bar", "ac"],
    featured: true,
  },
  {
    _id: "3",
    name: "Alpine Glass Lodge",
    location: "Swiss Alps",
    type: "Lodge",
    description:
      "Sleep under the stars in our glass-roofed igloos surrounded by mountains.",
    images: [
      "https://images.unsplash.com/photo-1519449556851-5720b33024e7?q=80&w=1000",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000",
    ],
    cheapestPrice: 680,
    rating: 4.9,
    reviews: 210,
    amenities: ["wifi", "hwater", "parking", "restaurant"],
    featured: true,
  },
  {
    _id: "4",
    name: "Desert Mirage",
    location: "Dubai, UAE",
    type: "Resort",
    description:
      "A sanctuary in the dunes featuring private pools and falconry experiences.",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000",
    ],
    cheapestPrice: 350,
    rating: 4.7,
    reviews: 96,
    amenities: ["pool", "ac", "wifi", "bar"],
    featured: true,
  },
];

const Featured = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <section className="py-20 bg-background relative z-10 overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Trending Destinations
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Swipe through our hand-picked selections for your next futuristic
              getaway.
            </p>
          </div>
          <Link to="/find-hotels">
            <Button
              variant="ghost"
              className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
            >
              View All Hotels <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Carousel Section */}
        <div className="relative px-4">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredHotels.map((hotel) => (
                <CarouselItem
                  key={hotel._id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/3 py-2"
                >
                  <div className="h-full">
                    {/* HotelCard එකට data යවද්දී දැන් ගැටළුවක් නෑ */}
                    <HotelCard hotel={hotel} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Featured;
