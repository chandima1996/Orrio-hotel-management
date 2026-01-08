import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInCalendarDays } from "date-fns";
import { useCurrency } from "@/context/CurrencyContext";
import { useUser } from "@clerk/clerk-react"; // Clerk Auth
import { Toaster, toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Custom Components
import RoomCard from "@/components/RoomCard";
import BookingWizard from "@/components/BookingWizard"; // IMPORT WIZARD

// Icons
import {
  Star,
  MapPin,
  CheckCircle2,
  Calendar as CalendarIcon,
  Users,
  ArrowLeft,
  Minus,
  Plus,
  X,
  BedDouble,
  RotateCcw,
  Share2,
  Heart,
} from "lucide-react";

const SingleHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currency, convertPrice } = useCurrency();
  const { user, isSignedIn } = useUser(); // Get Clerk User

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // --- Favorite & Share State ---
  const [isFavorite, setIsFavorite] = useState(false);

  // --- Booking States ---
  const queryParams = new URLSearchParams(location.search);
  const [date, setDate] = useState({
    from: queryParams.get("from")
      ? new Date(queryParams.get("from"))
      : undefined,
    to: queryParams.get("to") ? new Date(queryParams.get("to")) : undefined,
  });

  const [guests, setGuests] = useState({
    adults: queryParams.get("adults") ? parseInt(queryParams.get("adults")) : 1,
    children: queryParams.get("children")
      ? parseInt(queryParams.get("children"))
      : 0,
  });

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomQuantities, setRoomQuantities] = useState({});
  const [confirmedQuantities, setConfirmedQuantities] = useState({});

  // --- WIZARD STATES ---
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    idNumber: "",
  });
  const [isGuestDetailsSaved, setIsGuestDetailsSaved] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const totalGuests = guests.adults + guests.children;
  const isDateSelected = date?.from && date?.to;

  // --- Handlers ---
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!", {
      description: "You can now share this hotel with your friends.",
      position: "top-center",
      duration: 3000,
    });
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
      toast("Removed from Favorites", {
        description: "This hotel has been removed from your wishlist.",
        position: "top-center",
        icon: <Heart className="w-4 h-4 text-gray-500" />,
      });
    } else {
      setIsFavorite(true);
      toast.success("Added to Favorites", {
        description: "Saved to your wishlist successfully!",
        position: "top-center",
        icon: <Heart className="w-4 h-4 text-red-500 fill-red-500" />,
      });
    }
  };

  const handleClearData = () => {
    setDate({ from: undefined, to: undefined });
    setGuests({ adults: 1, children: 0 });
    setConfirmedQuantities({});
    setRoomQuantities({});
  };

  // --- API Calls ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const hotelRes = await axios.get(
          `http://localhost:5000/api/hotels/find/${id}`
        );
        setHotel(hotelRes.data);
        const roomsRes = await axios.get(
          `http://localhost:5000/api/rooms/hotel/${id}`
        );
        setRooms(roomsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (hotel?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % hotel.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [hotel]);

  // --- Calculation Logic ---
  const daysDifference =
    date?.from && date?.to ? differenceInCalendarDays(date.to, date.from) : 0;
  const nights = daysDifference > 0 ? daysDifference : 1;

  const updateGuests = (type, operation) => {
    setGuests((prev) => ({
      ...prev,
      [type]:
        operation === "inc" ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }));
  };

  const handleQuantityChange = (roomId, delta) => {
    setRoomQuantities((prev) => {
      const currentQty = prev[roomId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const updated = { ...prev, [roomId]: newQty };
      if (newQty === 0) delete updated[roomId];
      return updated;
    });
  };

  const calculateCapacityStats = (quantities) => {
    let totalCapacity = 0;
    let totalRooms = 0;
    Object.entries(quantities).forEach(([roomId, qty]) => {
      const room = rooms.find((r) => r._id === roomId);
      if (room) {
        totalCapacity += room.capacity * qty;
        totalRooms += qty;
      }
    });
    return { totalCapacity, totalRooms };
  };

  const { totalCapacity: modalCapacity } =
    calculateCapacityStats(roomQuantities);
  const isCapacityMet = modalCapacity >= totalGuests;

  const handleSaveSelection = () => {
    setConfirmedQuantities(roomQuantities);
    setIsRoomModalOpen(false);
  };

  const bookingSummary = useMemo(() => {
    let subTotal = 0;
    const items = [];
    Object.entries(confirmedQuantities).forEach(([roomId, qty]) => {
      const room = rooms.find((r) => r._id === roomId);
      if (room) {
        const nightlyPrice = room.price.normal - room.price.discount;
        const roomTotal = nightlyPrice * qty * nights;
        subTotal += roomTotal;
        items.push({
          name: room.title,
          qty,
          nightlyPrice,
          total: roomTotal,
        });
      }
    });
    const serviceFee = 25;
    const tax = subTotal * 0.05;
    const finalTotal = subTotal + serviceFee + tax;
    return { items, subTotal, serviceFee, tax, finalTotal };
  }, [confirmedQuantities, rooms, nights]);

  // --- HELPER: Save Bookings to DB ---
  const saveBookingsToDB = async (method) => {
    if (!isSignedIn || !user) {
      toast.error("Please sign in to complete booking.");
      return false;
    }

    try {
      // 1. Get MongoDB User ID using Clerk ID
      const userRes = await axios.get(
        `http://localhost:5000/api/users/${user.id}`
      );

      if (!userRes.data.success) {
        throw new Error("User not found in database");
      }

      const mongoUserId = userRes.data.data._id;

      // 2. Loop through selected rooms and create bookings
      const entries = Object.entries(confirmedQuantities);

      for (const [roomId, qty] of entries) {
        const room = rooms.find((r) => r._id === roomId);
        if (!room) continue;

        // Price for ONE room for the total nights
        const pricePerRoom = (room.price.normal - room.price.discount) * nights;

        // If user selected 2 rooms, create 2 separate bookings
        for (let i = 0; i < qty; i++) {
          const bookingData = {
            userId: mongoUserId,
            hotelId: hotel._id,
            roomId: roomId,
            checkIn: date.from,
            checkOut: date.to,
            totalPrice: pricePerRoom, // Price per specific booking instance
            paymentMethod: method === "payNow" ? "payNow" : "payLater",
          };

          await axios.post("http://localhost:5000/api/bookings", bookingData);
        }
      }
      return true;
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("Failed to save booking. Please try again.");
      return false;
    }
  };

  // --- WIZARD HANDLERS ---
  const handleGuestInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateGuestDetails = () => {
    return Object.values(guestDetails).every((val) => val.trim() !== "");
  };

  const handleSaveGuestDetails = () => {
    if (validateGuestDetails()) {
      setIsGuestDetailsSaved(true);
      setWizardStep(2); // Move to Payment Step
    } else {
      toast.error("Missing Information", {
        description: "Please fill in all guest details to continue.",
        position: "top-center",
      });
    }
  };

  const handleEditGuestDetails = () => {
    setIsGuestDetailsSaved(false);
    setWizardStep(1);
  };

  // --- Handle Pay Later ---
  const handlePayLater = async () => {
    const toastId = toast.loading("Processing your booking...");
    const success = await saveBookingsToDB("payLater");

    if (success) {
      toast.dismiss(toastId);
      toast.success("Booking Confirmed!", {
        description: "You can view this in your dashboard.",
        position: "top-center",
      });
      setPaymentMethod("later");
      setWizardStep(3); // Show Success Screen
    } else {
      toast.dismiss(toastId);
    }
  };

  // --- Handle Pay Now (Stripe Success) ---
  const handlePaymentSuccess = async (details) => {
    const toastId = toast.loading("Finalizing booking...");
    const success = await saveBookingsToDB("payNow");

    if (success) {
      toast.dismiss(toastId);
      toast.success("Payment Successful!", {
        description: "Your room has been reserved.",
        position: "top-center",
      });
      setPaymentMethod("card"); // For display in receipt
      setWizardStep(3); // Show Success Screen
    } else {
      toast.dismiss(toastId);
    }
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
    setWizardStep(1);
    setIsGuestDetailsSaved(false);
    setPaymentMethod(null);
    setGuestDetails({
      name: "",
      phone: "",
      address: "",
      email: "",
      idNumber: "",
    });
  };

  const handleFinishBooking = () => {
    setIsWizardOpen(false);
    navigate("/"); // Redirect to Home
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (!hotel) return <div className="py-20 text-center">Hotel not found!</div>;

  return (
    <div className="relative min-h-screen pt-24 pb-10 bg-background">
      <Toaster />

      <div className="px-4 mx-auto max-w-7xl md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" /> {hotel.address}, {hotel.location}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFavorite}
              className={cn(
                isFavorite ? "border-red-200 bg-red-50 hover:bg-red-100" : ""
              )}
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </Button>
          </div>
        </div>

        {/* Image Slider */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10 bg-black">
          <motion.img
            key={currentImgIndex}
            src={hotel.images[currentImgIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-10 lg:col-span-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">About this place</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {hotel.description}
              </p>
            </div>
            <hr className="border-border" />
            <div className="grid grid-cols-2 gap-4">
              {hotel.amenities?.map((am, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> {am}
                </div>
              ))}
            </div>
            <hr className="border-border" />
            <div>
              <h2 className="mb-6 text-2xl font-bold">Available Rooms</h2>
              <div className="grid gap-6">
                {rooms.map((room) => (
                  <RoomCard key={room._id} room={room} layout="list" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="relative">
            <div className="sticky p-6 border shadow-xl top-28 bg-card border-border rounded-2xl">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Prices starting from
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">
                      {currency} {convertPrice(hotel.price.normal)}
                    </span>
                    <span className="text-muted-foreground">/ night</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-secondary">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{hotel.rating}</span>
                </div>
              </div>

              {isDateSelected && (
                <div className="flex justify-end mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearData}
                    className="h-6 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" /> Clear Data
                  </Button>
                </div>
              )}

              {/* Date Picker */}
              <div className="mb-4">
                <Popover>
                  <PopoverTrigger asChild disabled={isDateSelected}>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start w-full text-left h-12",
                        isDateSelected && "opacity-80 bg-muted"
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {date?.from
                        ? date.to
                          ? `${format(date.from, "LLL dd")} - ${format(
                              date.to,
                              "LLL dd"
                            )}`
                          : format(date.from, "LLL dd, y")
                        : "Check-in - Check-out"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guest Picker */}
              <div className="mb-4">
                <Popover>
                  <PopoverTrigger asChild disabled={!isDateSelected}>
                    <Button
                      variant="outline"
                      className="justify-between w-full h-12"
                    >
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" /> {guests.adults}{" "}
                        Adults, {guests.children} Children
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-4 w-80">
                    <div className="flex items-center justify-between mb-4">
                      <span>Adults</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8"
                          onClick={() => updateGuests("adults", "dec")}
                          disabled={guests.adults <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span>{guests.adults}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8"
                          onClick={() => updateGuests("adults", "inc")}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Children</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8"
                          onClick={() => updateGuests("children", "dec")}
                          disabled={guests.children <= 0}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span>{guests.children}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8"
                          onClick={() => updateGuests("children", "inc")}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Room Selection & Summary */}
              {Object.keys(confirmedQuantities).length === 0 ? (
                <Button
                  className="w-full h-12 text-lg font-bold"
                  disabled={!isDateSelected}
                  onClick={() => {
                    setRoomQuantities({});
                    setIsRoomModalOpen(true);
                  }}
                >
                  Select Rooms
                </Button>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in">
                  <div className="p-4 border rounded-xl bg-secondary/10 border-border">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-dashed border-border">
                      <h3 className="font-semibold text-foreground">
                        Booking Summary
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-primary"
                        onClick={() => setIsRoomModalOpen(true)}
                      >
                        Edit Rooms
                      </Button>
                    </div>
                    <div className="space-y-3 text-sm">
                      {bookingSummary.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex justify-between font-medium">
                            <span className="font-bold">
                              {item.name}{" "}
                              <span className="font-normal text-muted-foreground">
                                x {item.qty}
                              </span>
                            </span>
                            <span>
                              {currency} {convertPrice(item.total)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.qty} room(s) x {nights} night(s) @ {currency}
                            {convertPrice(item.nightlyPrice)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 mt-3 space-y-2 border-t border-border">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Service Fee</span>
                        <span>
                          {currency} {convertPrice(bookingSummary.serviceFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Taxes (5%)</span>
                        <span>
                          {currency} {convertPrice(bookingSummary.tax)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 mt-2 text-lg font-bold border-t border-border text-primary">
                        <span>Total Price</span>
                        <span>
                          {currency} {convertPrice(bookingSummary.finalTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsWizardOpen(true)}
                    className="w-full h-12 text-lg font-bold bg-green-600 shadow-lg hover:bg-green-700"
                  >
                    Reserve Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ROOM SELECTION MODAL */}
      <AnimatePresence>
        {isRoomModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 md:items-center backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-4xl bg-background rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 border-b bg-secondary/10">
                <div>
                  <h3 className="text-xl font-bold">Select Rooms</h3>
                  <p className="text-sm text-muted-foreground">
                    Target Capacity:{" "}
                    <span className="font-bold">{totalGuests} Guests</span>
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsRoomModalOpen(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                {rooms.map((room) => {
                  const selectedQty = roomQuantities[room._id] || 0;
                  return (
                    <div
                      key={room._id}
                      className={cn(
                        "flex flex-col md:flex-row border rounded-xl overflow-hidden transition-all",
                        selectedQty > 0
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <div className="w-full h-32 bg-gray-200 md:w-48 shrink-0">
                        <img
                          src={room.images?.[0] || hotel.images[0]}
                          alt={room.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1 p-4">
                        <div>
                          <div className="flex justify-between">
                            <h4 className="font-bold text-md">{room.title}</h4>
                            <span className="font-bold text-primary">
                              {currency}{" "}
                              {convertPrice(
                                room.price.normal - room.price.discount
                              )}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                            {room.desc}
                          </p>
                          <div className="flex gap-3 mt-2 text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> Max {room.capacity}
                            </span>
                            <span className="flex items-center gap-1">
                              <BedDouble className="w-3 h-3" /> {room.size} sqft
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-3">
                          {selectedQty > 0 && (
                            <span className="text-sm font-semibold text-primary">
                              {selectedQty} Selected
                            </span>
                          )}
                          <div className="flex items-center border rounded-lg bg-background">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 rounded-none"
                              onClick={() => handleQuantityChange(room._id, -1)}
                              disabled={selectedQty === 0}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-sm font-bold text-center">
                              {selectedQty}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 rounded-none"
                              onClick={() => handleQuantityChange(room._id, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t bg-secondary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className={cn(
                        "text-lg font-bold",
                        isCapacityMet ? "text-green-600" : "text-orange-600"
                      )}
                    >
                      Selected Capacity: {modalCapacity} / {totalGuests}
                    </div>
                    {!isCapacityMet && (
                      <span className="text-xs text-muted-foreground">
                        Please select more rooms to fit all guests.
                      </span>
                    )}
                  </div>
                  <Button
                    size="lg"
                    onClick={handleSaveSelection}
                    disabled={
                      !isCapacityMet || Object.keys(roomQuantities).length === 0
                    }
                    className={cn(
                      isCapacityMet
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-muted-foreground"
                    )}
                  >
                    Confirm Selection
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOOKING WIZARD MODAL --- */}
      <BookingWizard
        isWizardOpen={isWizardOpen}
        closeWizard={closeWizard}
        hotel={hotel}
        wizardStep={wizardStep}
        bookingSummary={bookingSummary}
        guestDetails={guestDetails}
        handleGuestInputChange={handleGuestInputChange}
        handleSaveGuestDetails={handleSaveGuestDetails}
        handleEditGuestDetails={handleEditGuestDetails}
        isGuestDetailsSaved={isGuestDetailsSaved}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        // --- Pass the new handlers that call the backend ---
        handlePayLater={handlePayLater}
        handlePaymentSuccess={handlePaymentSuccess}
        handleFinishBooking={handleFinishBooking}
        currency={currency}
        convertPrice={convertPrice}
        date={date}
        nights={nights}
        totalGuests={totalGuests}
      />
    </div>
  );
};

export default SingleHotel;
