import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Search, X } from "lucide-react"; // 1. Imported 'X' icon
import { Toaster, toast } from "sonner";

// Shadcn & UI Components
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroImages = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  // Auto Change Background
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (!location.trim()) {
      return;
    }
    navigate(`/find-hotels?search=${encodeURIComponent(location)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && location.trim()) {
      // Only allow enter if text exists
      handleSearch();
    }
  };

  // 2. Clear Handler
  const handleClear = () => {
    setLocation("");
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden">
      <Toaster />

      {/* --- Animated Background Slider --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 z-10 bg-black/40" />
          <img
            src={heroImages[currentImage]}
            alt="Hero"
            className="object-cover w-full h-full"
          />
        </motion.div>
      </AnimatePresence>

      {/* --- Content Section --- */}
      <div className="container relative z-20 flex flex-col items-center gap-8 px-4 pt-20 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-lg">
            Experience the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-primary">
              Extraordinary
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg font-light text-gray-200 md:text-xl">
            Discover futuristic stays with AI-powered personalized
            recommendations. Your dream vacation starts here.
          </p>
        </motion.div>

        {/* --- Search Bar --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center w-full max-w-3xl gap-2 p-2 border shadow-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border-white/20 rounded-3xl md:flex-row md:p-3"
        >
          {/* A. Location / AI Input */}
          <div className="relative flex-1 w-full group">
            {/* Left Icon */}
            <div className="absolute text-gray-300 transition-colors -translate-y-1/2 left-4 top-1/2 group-focus-within:text-primary">
              <Sparkles className="w-5 h-5" />
            </div>

            <input
              type="text"
              placeholder="Where to? (e.g. 'Sigiriya' or 'Beach Vibe')"
              // Added pr-12 to make space for the clear button
              className="w-full pl-12 pr-12 text-white transition-all border h-14 bg-white/5 border-white/10 rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            {/* 3. Clear Button (Visible only when location has text) */}
            {location && (
              <button
                onClick={handleClear}
                className="absolute p-1 text-gray-400 transition-colors -translate-y-1/2 rounded-full right-4 top-1/2 hover:text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* D. Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!location.trim()} // 4. Disable button if empty
            className={cn(
              "w-full px-8 text-lg font-semibold transition-all shadow-lg md:w-auto h-14 rounded-2xl",
              "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary hover:shadow-primary/50",
              // Gray out style when disabled
              !location.trim() && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            <Search className="w-5 h-5 mr-2" /> Search
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
