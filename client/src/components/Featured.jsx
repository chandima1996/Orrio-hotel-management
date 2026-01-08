import { useState, useEffect } from "react";
import axios from "axios";
import HotelCard from "./HotelCard";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Featured = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/hotels?featured=true&limit=4"
        );

        // --- FIX: Data Handle Logic ---
        // Backend එකෙන් කෙලින්ම Array එකක් එනවා නම් res.data ගන්නවා.
        // නැත්නම් res.data.hotels ගන්නවා.
        const data = Array.isArray(res.data) ? res.data : res.data.hotels || [];
        setFeaturedHotels(data);
      } catch (err) {
        console.error("Error fetching featured hotels:", err);
        setFeaturedHotels([]); // Error ආවොත් හිස් array එකක් දානවා crash නොවෙන්න
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
        <div className="flex flex-col gap-4 mb-12 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
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
              >
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/50" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* --- FIX: Safety Check --- */}
            {Array.isArray(featuredHotels) && featuredHotels.length > 0 ? (
              featuredHotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))
            ) : (
              // Data නැතිනම් පෙන්වන පණිවිඩය
              <div className="py-10 text-center col-span-full bg-muted/20 rounded-xl">
                <p className="text-muted-foreground">
                  No featured properties found at the moment.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Featured;
