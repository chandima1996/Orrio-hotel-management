import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays } from "date-fns";
import {
  Calendar as CalendarIcon,
  Users,
  Search,
  Sparkles,
  MapPin,
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
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop", // Luxury Pool
  "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=2070&auto=format&fit=crop", // Bedroom
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop", // Resort View
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop", // Modern Interior
];

const Hero = () => {
  // 1. Background Slider State
  const [currentImage, setCurrentImage] = useState(0);

  // 2. Search States
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [location, setLocation] = useState("");

  // Auto Change Background (Every 5 Seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Guest Handler
  const updateGuests = (type, operation) => {
    setGuests((prev) => ({
      ...prev,
      [type]:
        operation === "inc" ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }));
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* --- 1. Animated Background Slider --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />{" "}
          {/* Dark Overlay */}
          <img
            src={heroImages[currentImage]}
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* --- 2. Content Section --- */}
      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center gap-8 text-center pt-20">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            Experience the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-primary">
              Extraordinary
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light">
            Discover futuristic stays with AI-powered personalized
            recommendations. Your dream vacation starts here.
          </p>
        </motion.div>

        {/* --- 3. The Crystal Search Bar --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-4"
        >
          {/* A. Location / AI Input */}
          <div className="flex-1 w-full relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Where to? Or describe your vibe (e.g. 'Peaceful beach')..."
              className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* B. Date Range Picker (Calendar) */}
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
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-300" />
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
                  <Users className="mr-2 h-4 w-4 text-blue-300" />
                  {guests.adults} Adults, {guests.children} Children
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
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
                        className="h-8 w-8"
                        onClick={() => updateGuests("adults", "dec")}
                        disabled={guests.adults <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-4 text-center">{guests.adults}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests("adults", "inc")}
                      >
                        <Plus className="h-4 w-4" />
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
                        className="h-8 w-8"
                        onClick={() => updateGuests("children", "dec")}
                        disabled={guests.children <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-4 text-center">{guests.children}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGuests("children", "inc")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* D. Search Button */}
          <Button className="w-full md:w-auto h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all shadow-lg hover:shadow-primary/50 text-lg font-semibold">
            Search
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
