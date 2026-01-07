import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInCalendarDays } from "date-fns";
import { useCurrency } from "@/context/CurrencyContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Toaster, toast } from "sonner"; // IMPORT TOASTER & TOAST

// UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Custom Components
import RoomCard from "@/components/RoomCard";

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
  CreditCard,
  Wallet,
  Pencil,
  Share2,
  Heart,
} from "lucide-react";

// --- STRIPE SETUP ---
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

// --- STRIPE FORM COMPONENT ---
const StripePaymentForm = ({ amount, currency, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      setTimeout(() => {
        setProcessing(false);
        onSuccess(paymentMethod);
      }, 1500);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 mt-4 bg-white border rounded-lg"
    >
      <h4 className="mb-4 text-sm font-semibold text-gray-700 uppercase">
        Enter Card Details
      </h4>
      <div className="p-3 mb-4 border rounded-md bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#000000",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>
      {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {processing ? "Processing..." : `Pay ${currency} ${amount}`}
      </Button>
    </form>
  );
};

const SingleHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currency, convertPrice } = useCurrency();

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

  // --- Handlers for Share & Favorite (UPDATED WITH TOAST) ---
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
          name: room.title, // Room Type (Title)
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

  const handlePayLater = () => {
    toast.info("Payment Information", {
      description: "You must complete payment within 24 hours to confirm.",
      duration: 5000,
      position: "top-center",
    });
    setPaymentMethod("later");
    setWizardStep(3);
  };

  const handlePaymentSuccess = (details) => {
    setPaymentMethod("card");
    setWizardStep(3);
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
      {/* Toast Provider */}
      <Toaster />

      <div className="px-4 mx-auto max-w-7xl md:px-8">
        {/* Navigation Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        {/* --- HEADER SECTION WITH SHARE & FAVORITE --- */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" /> {hotel.address}, {hotel.location}
            </div>
          </div>
          {/* Share and Favorite Buttons */}
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
      <AnimatePresence>
        {isWizardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl overflow-hidden bg-white shadow-2xl rounded-2xl max-h-[90vh] flex flex-col md:flex-row"
            >
              {/* --- Wizard Sidebar / Summary --- */}
              {wizardStep !== 3 && (
                <div className="flex flex-col justify-between p-6 overflow-y-auto border-r bg-slate-50 md:w-1/3">
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-gray-800">
                      Complete your Booking
                    </h2>
                    <div className="space-y-4">
                      <div className="p-3 bg-white border rounded-lg shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase">
                          Hotel
                        </h4>
                        <p className="font-bold text-gray-800">{hotel.name}</p>
                        <p className="text-xs text-gray-500">{hotel.address}</p>
                      </div>

                      {/* ROOM DETAILS IN SIDEBAR SUMMARY */}
                      <div className="p-3 bg-white border rounded-lg shadow-sm">
                        <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
                          Room Details
                        </h4>
                        <div className="space-y-3">
                          {bookingSummary.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between pb-2 text-sm border-b border-gray-100 border-dashed last:border-0 last:pb-0"
                            >
                              <div className="flex flex-col">
                                {/* Room Type display */}
                                <span className="font-bold text-gray-800">
                                  {item.name}
                                </span>
                                <span className="text-xs font-semibold text-primary">
                                  x {item.qty} Room(s)
                                </span>
                              </div>
                              <span className="font-medium text-gray-900">
                                {currency} {convertPrice(item.total)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-white border rounded-lg shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase">
                          Total Cost
                        </h4>
                        <p className="text-2xl font-extrabold text-primary">
                          {currency} {convertPrice(bookingSummary.finalTotal)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Includes taxes & fees
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      onClick={closeWizard}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </div>
              )}

              {/* --- Wizard Main Content --- */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto p-6 md:p-8",
                  wizardStep === 3 && "w-full bg-slate-50"
                )}
              >
                {/* STEP 3: SUCCESS SUMMARY */}
                {wizardStep === 3 ? (
                  <div className="max-w-3xl mx-auto space-y-8 duration-300 animate-in zoom-in">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h2 className="text-3xl font-extrabold text-gray-900">
                        Booking Confirmed!
                      </h2>
                      <p className="text-lg text-gray-500">
                        Thank you for your reservation,{" "}
                        {guestDetails.name.split(" ")[0]}.
                      </p>
                    </div>

                    <div className="overflow-hidden bg-white border shadow-lg rounded-2xl">
                      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                        <h3 className="font-bold text-gray-700">
                          Reservation Receipt
                        </h3>
                        <span className="px-3 py-1 text-xs font-bold text-green-700 uppercase bg-green-100 rounded-full">
                          {paymentMethod === "later"
                            ? "Pay at Hotel"
                            : "Paid Online"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                        <div>
                          <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                            Guest Details
                          </h4>
                          <p className="text-lg font-bold text-gray-800">
                            {guestDetails.name}
                          </p>
                          <p className="text-gray-600">{guestDetails.email}</p>
                          <p className="text-gray-600">{guestDetails.phone}</p>
                          <p className="mt-1 text-sm text-gray-600">
                            {guestDetails.address}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                            Stay Info
                          </h4>
                          <p className="text-lg font-bold text-gray-800">
                            {nights} Night(s)
                          </p>
                          <p className="text-gray-600">
                            {format(date.from, "MMM dd")} -{" "}
                            {format(date.to, "MMM dd, yyyy")}
                          </p>
                          <p className="text-gray-600">
                            {totalGuests} Guest(s)
                          </p>
                        </div>
                      </div>
                      {/* Room Details in Receipt */}
                      <div className="px-6 py-4 border-t border-b bg-gray-50/50">
                        <h4 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                          Room Breakdown
                        </h4>
                        <div className="space-y-3">
                          {bookingSummary.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex flex-col">
                                {/* Specific Room Title Display */}
                                <span className="text-base font-bold text-gray-800">
                                  {item.name}
                                </span>
                                <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                  Qty: {item.qty}
                                </span>
                              </div>
                              <span className="font-bold text-gray-900">
                                {currency} {convertPrice(item.total)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-6 py-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-600">
                            Total Amount
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {currency} {convertPrice(bookingSummary.finalTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      {/* FINISH BUTTON WITH HOME NAVIGATION */}
                      <Button
                        onClick={handleFinishBooking}
                        size="lg"
                        className="w-full text-white bg-gray-900 md:w-auto hover:bg-black"
                      >
                        Finish & Go Home
                      </Button>
                    </div>
                  </div>
                ) : (
                  // STEPS 1 & 2
                  <div className="space-y-8">
                    {/* SECTION 1: GUEST DETAILS */}
                    <div
                      className={cn(
                        "transition-all duration-300",
                        wizardStep === 2 &&
                          "opacity-60 grayscale pointer-events-none"
                      )}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center text-xl font-bold text-black">
                          <span className="flex items-center justify-center w-8 h-8 mr-3 text-sm text-white rounded-full bg-primary">
                            1
                          </span>
                          Guest Details
                        </h3>
                        {isGuestDetailsSaved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditGuestDetails}
                          >
                            <Pencil className="w-3 h-3 mr-2" /> Edit
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-gray-700">Full Name</Label>
                          <Input
                            className="font-medium text-black"
                            name="name"
                            value={guestDetails.name}
                            onChange={handleGuestInputChange}
                            disabled={isGuestDetailsSaved}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">Phone Number</Label>
                          <Input
                            className="font-medium text-black"
                            name="phone"
                            value={guestDetails.phone}
                            onChange={handleGuestInputChange}
                            disabled={isGuestDetailsSaved}
                            placeholder="+94 77 ..."
                          />
                        </div>
                        <div className="col-span-1 space-y-2 md:col-span-2">
                          <Label className="text-gray-700">Address</Label>
                          <Input
                            className="font-medium text-black"
                            name="address"
                            value={guestDetails.address}
                            onChange={handleGuestInputChange}
                            disabled={isGuestDetailsSaved}
                            placeholder="123 Main St..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">Email</Label>
                          <Input
                            className="font-medium text-black"
                            name="email"
                            value={guestDetails.email}
                            onChange={handleGuestInputChange}
                            disabled={isGuestDetailsSaved}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">
                            ID / Passport Number
                          </Label>
                          <Input
                            className="font-medium text-black"
                            name="idNumber"
                            value={guestDetails.idNumber}
                            onChange={handleGuestInputChange}
                            disabled={isGuestDetailsSaved}
                            placeholder="NIC or Passport"
                          />
                        </div>
                      </div>

                      {!isGuestDetailsSaved && (
                        <div className="flex justify-end mt-4">
                          <Button
                            onClick={handleSaveGuestDetails}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Save & Continue
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* SECTION 2: PAYMENT */}
                    <div
                      className={cn(
                        "transition-all duration-300 pt-6 border-t",
                        !isGuestDetailsSaved &&
                          "opacity-40 blur-sm pointer-events-none"
                      )}
                    >
                      <div className="flex items-center mb-4">
                        <span className="flex items-center justify-center w-8 h-8 mr-3 text-sm text-white rounded-full bg-primary">
                          2
                        </span>
                        <h3 className="text-xl font-bold text-black">
                          Payment Method
                        </h3>
                      </div>

                      {isGuestDetailsSaved && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-5">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div
                              className={cn(
                                "border-2 rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex flex-col items-center justify-center gap-3 text-center",
                                paymentMethod === "later"
                                  ? "border-primary bg-primary/5"
                                  : "border-muted"
                              )}
                              onClick={handlePayLater}
                            >
                              <Wallet className="w-8 h-8 text-gray-600" />
                              <div>
                                <h4 className="font-bold text-black">
                                  Pay Later
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Reserve now, pay at hotel.
                                </p>
                              </div>
                            </div>

                            <div
                              className={cn(
                                "border-2 rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex flex-col items-center justify-center gap-3 text-center",
                                paymentMethod === "now"
                                  ? "border-primary bg-primary/5"
                                  : "border-muted"
                              )}
                              onClick={() => setPaymentMethod("now")}
                            >
                              <CreditCard className="w-8 h-8 text-gray-600" />
                              <div>
                                <h4 className="font-bold text-black">
                                  Pay Now
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Secure payment via Stripe.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* STRIPE FORM AREA */}
                          <AnimatePresence>
                            {paymentMethod === "now" && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                              >
                                <Elements stripe={stripePromise}>
                                  <StripePaymentForm
                                    amount={convertPrice(
                                      bookingSummary.finalTotal
                                    )}
                                    currency={currency}
                                    onSuccess={handlePaymentSuccess}
                                  />
                                </Elements>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SingleHotel;
