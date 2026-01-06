import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays } from "date-fns";
import { useNavigate } from "react-router-dom"; // 1. Added useNavigate
import {
  Calendar as CalendarIcon,
  Users,
  Search, // Note: Not used as icon component in your code below (Sparkles used), but kept import
  Sparkles,
  Minus,
  Plus,
} from "lucide-react";

// Shadcn & UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const heroImages = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // 2. Navigation Hook
  const navigate = useNavigate();

  // Search States
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [location, setLocation] = useState("");

  // Auto Change Background
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const updateGuests = (type, operation) => {
    setGuests((prev) => ({
      ...prev,
      [type]:
        operation === "inc" ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }));
  };

  // 3. Handle Search Function (New Logic)
  const handleSearch = () => {
    // Navigate to find-hotels page with the search query
    // Even if location is empty, we can go to the page to show all hotels
    navigate(`/find-hotels?search=${encodeURIComponent(location)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden">
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

        {/* --- The Crystal Search Bar --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center w-full max-w-5xl gap-4 p-4 border shadow-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border-white/20 rounded-3xl md:flex-row"
        >
          {/* A. Location / AI Input */}
          <div className="relative flex-1 w-full group">
            <div className="absolute text-gray-300 transition-colors -translate-y-1/2 left-4 top-1/2 group-focus-within:text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Where to? Or describe your vibe (e.g. 'Peaceful beach')..."
              className="w-full pl-12 pr-4 text-white transition-all border h-14 bg-white/5 border-white/10 rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyPress} // 4. Added Enter Key Support
            />
          </div>

          {/* B. Date Range Picker */}
          <div className="w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full md:w-[280px] h-14 justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="w-4 h-4 mr-2 text-blue-300" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd")} -{" "}
                        {format(date.to, "LLL dd")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Check-in / Check-out</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* C. Guest Selector */}
          <div className="w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-[200px] h-14 justify-start bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                >
                  <Users className="w-4 h-4 mr-2 text-blue-300" />
                  {guests.adults} Adults, {guests.children} Children
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-4 w-80">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none text-muted-foreground">
                    Guests
                  </h4>
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Adults</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => updateGuests("adults", "dec")}
                        disabled={guests.adults <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-4 text-center">{guests.adults}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => updateGuests("adults", "inc")}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Children</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => updateGuests("children", "dec")}
                        disabled={guests.children <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-4 text-center">{guests.children}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => updateGuests("children", "inc")}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* D. Search Button */}
          <Button
            onClick={handleSearch} // 5. Added onClick handler
            className="w-full px-8 text-lg font-semibold transition-all shadow-lg md:w-auto h-14 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary hover:shadow-primary/50"
          >
            Search
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
