import { useState, useEffect } from "react";
import axios from "axios";
import HotelCard from "./HotelCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Featured = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Backend එකෙන් featured hotels විතරක් ඉල්ලනවා (limit=4)
        // අපි backend එකේ already හදලා තියෙන්නේ ?featured=true වැඩ කරන විදියට
        const res = await axios.get(
          "http://localhost:5000/api/hotels?featured=true&limit=4"
        );

        // Backend එකෙන් එන format එක { hotels: [...], totalCount: ... } නිසා res.data.hotels ගන්න ඕනේ
        setFeaturedHotels(res.data.hotels);
      } catch (err) {
        console.error("Error fetching featured hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="px-4 mx-auto max-w-7xl md:px-8">
        {/* Header Section */}
        <div className="flex flex-col items-end justify-between gap-4 mb-10 md:flex-row">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl text-foreground">
              Featured <span className="text-primary">Stays</span>
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Hand-picked selection of top-rated properties just for you.
            </p>
          </div>

          <Link
            to="/find-hotels"
            className="flex items-center gap-2 font-bold transition-colors group text-primary hover:text-primary/80"
          >
            See all properties
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Grid */}
        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[350px] bg-muted/60 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredHotels.map((hotel) => (
              // මෙතන අපි කලින් හදපු HotelCard එකම පාවිච්චි කරනවා
              // එතකොට Price, Icon, Image ඔක්කොම ලස්සනට පේනවා
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Featured;
