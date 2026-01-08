import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useCurrency } from "../context/CurrencyContext";
import axios from "axios";
import { format, differenceInCalendarDays } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import {
  Loader2,
  CalendarIcon,
  CreditCard,
  History,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  X,
  Eye, // Aluth Icon eka
  MapPin,
  BedDouble,
  Calendar as CalendarIconLucide,
  Receipt,
  Hotel,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Import your Stripe Form
import StripePaymentForm from "@/components/StripePaymentForm";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const MyDashboard = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { currency, convertPrice } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [dbUser, setDbUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filters
  const [filterDate, setFilterDate] = useState(undefined);
  const [filterStatus, setFilterStatus] = useState("all");

  // User Profile Form
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    country: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && clerkUser) {
        try {
          setLoading(true);

          // 1. Get User Details
          const userRes = await axios.get(
            `http://localhost:5000/api/users/${clerkUser.id}`
          );

          if (userRes.data.success) {
            const userData = userRes.data.data;
            setDbUser(userData);
            setFormData({
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              phone: userData.phone || "",
              address: userData.address || "",
              country: userData.country || "",
            });

            // 2. Get Bookings using MongoDB _id
            const userId = userData._id;
            const bookingRes = await axios.get(
              `http://localhost:5000/api/bookings/user/${userId}`
            );

            const allBookings = bookingRes.data;

            // 3. Separate Upcoming vs Past
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcoming = [];
            const past = [];

            allBookings.forEach((b) => {
              const checkInDate = new Date(b.checkIn);
              if (checkInDate >= today) {
                upcoming.push(b);
              } else {
                past.push(b);
              }
            });

            // Sort: Newest bookings first
            upcoming.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            past.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));

            setBookings({ upcoming, past });
          }
        } catch (err) {
          console.error("Error fetching data", err);
          toast.error("Failed to load dashboard data.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isLoaded, clerkUser, refreshKey]);

  // --- Payment Handler ---
  const handlePaymentConfirm = async (bookingId, paymentIntent) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/bookings/pay/${bookingId}`
      );

      if (res.status === 200) {
        toast.success("Payment Successful!", {
          description: `Booking confirmed. Room ${res.data.assignedRoomNumber} assigned.`,
        });
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking status via server.");
    }
  };

  // --- Filtering Logic ---
  const applyFilters = (bookingList) => {
    return bookingList.filter((booking) => {
      const statusMatch =
        filterStatus === "all" ? true : booking.status === filterStatus;

      let dateMatch = true;
      if (filterDate) {
        const bookingDate = new Date(booking.checkIn).setHours(0, 0, 0, 0);
        const selectedDate = new Date(filterDate).setHours(0, 0, 0, 0);
        dateMatch = bookingDate === selectedDate;
      }

      return statusMatch && dateMatch;
    });
  };

  const filteredUpcoming = applyFilters(bookings.upcoming);
  const filteredPast = applyFilters(bookings.past);

  const clearFilters = () => {
    setFilterDate(undefined);
    setFilterStatus("all");
  };

  // --- Profile Update ---
  const handleSaveProfile = async () => {
    try {
      await axios.put("http://localhost:5000/api/users/update-profile", {
        clerkId: clerkUser.id,
        ...formData,
      });
      setDbUser({ ...dbUser, ...formData });
      setIsEditing(false);
      toast.success("Profile Updated!");
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-muted/20">
      {/* Header */}
      <div className="px-6 pt-10 pb-16 border-b bg-background">
        <div className="container flex flex-col items-center justify-between max-w-5xl gap-6 mx-auto md:flex-row">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 shadow-lg border-muted">
              <AvatarImage src={clerkUser?.imageUrl} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {dbUser?.firstName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground">
                Hello, {dbUser?.firstName || "Guest"}!
              </h1>
              <p className="mt-1 text-muted-foreground">
                Welcome to your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl px-4 mx-auto -mt-8">
        <Tabs defaultValue="bookings" className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-2 p-1 border shadow-sm bg-background/80 backdrop-blur-sm rounded-xl h-14">
            <TabsTrigger
              value="bookings"
              className="h-12 text-base font-medium"
            >
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="profile" className="h-12 text-base font-medium">
              Personal Details
            </TabsTrigger>
          </TabsList>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings" className="space-y-6">
            {/* Filter Section */}
            <Card className="border-none shadow-sm bg-background/60 backdrop-blur">
              <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-end">
                <div className="flex-1 space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                    <Filter className="w-3 h-3" /> Filter by Status
                  </Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* CALENDAR FILTER */}
                <div className="flex-1 space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                    <CalendarIcon className="w-3 h-3" /> Filter by Check-in
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !filterDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {filterDate ? (
                          format(filterDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filterDate}
                        onSelect={setFilterDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {(filterStatus !== "all" || filterDate) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" /> Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="bg-muted">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">History</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="pt-4 space-y-4">
                  {filteredUpcoming.map((b) => (
                    <BookingCard
                      key={b._id}
                      booking={b}
                      currency={currency}
                      convertPrice={convertPrice}
                      onPayConfirm={handlePaymentConfirm}
                      isUpcoming={true}
                    />
                  ))}
                  {filteredUpcoming.length === 0 && (
                    <EmptyState message="No upcoming bookings found." />
                  )}
                </TabsContent>

                <TabsContent value="past" className="pt-4 space-y-4">
                  {filteredPast.map((b) => (
                    <BookingCard
                      key={b._id}
                      booking={b}
                      currency={currency}
                      convertPrice={convertPrice}
                      isUpcoming={false}
                    />
                  ))}
                  {filteredPast.length === 0 && (
                    <EmptyState message="No past bookings found." />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <Button
                  onClick={() =>
                    isEditing ? handleSaveProfile() : setIsEditing(true)
                  }
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// --- Updated Booking Card with Detailed View ---
const BookingCard = ({
  booking,
  currency,
  convertPrice,
  onPayConfirm,
  isUpcoming,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-600";
      case "completed":
        return "bg-blue-600";
      case "pending":
        return "bg-yellow-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "pending":
        return <Clock className="w-4 h-4 mr-1" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = differenceInCalendarDays(checkOut, checkIn);
  const formattedCheckIn = format(checkIn, "MMM dd, yyyy");
  const formattedCheckOut = format(checkOut, "MMM dd, yyyy");

  return (
    <Card className="overflow-hidden transition-all border group hover:border-primary/50">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail Image */}
        <img
          src={
            booking.roomId?.images?.[0] ||
            booking.hotelId?.images?.[0] ||
            "https://placehold.co/600x400"
          }
          alt={booking.roomId?.name}
          className="object-cover w-full h-48 md:w-56"
        />
        <div className="flex flex-col justify-between flex-1 p-5">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {booking.roomId?.name || "Room Name Unavailable"}
                </h3>
                <div className="flex items-center mt-1 text-sm font-medium text-muted-foreground">
                  <Hotel className="w-4 h-4 mr-1" />
                  {booking.hotelId?.name}
                </div>
              </div>
              <Badge
                className={`${getStatusColor(
                  booking.status
                )} capitalize flex items-center`}
              >
                {getStatusIcon(booking.status)}
                {booking.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 mt-3 text-sm gap-y-1 text-muted-foreground">
              <div className="flex items-center">
                <CalendarIconLucide className="w-4 h-4 mr-2 opacity-70" />
                {formattedCheckIn} - {formattedCheckOut}
              </div>
              <div className="flex items-center">
                <Receipt className="w-4 h-4 mr-2 opacity-70" />
                {currency} {convertPrice(booking.totalPrice)}
              </div>

              {(booking.status === "confirmed" ||
                booking.status === "completed") &&
                booking.assignedRoomNumber && (
                  <p className="col-span-2 p-1 px-2 mt-2 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 rounded w-fit">
                    🏡 Room No: {booking.assignedRoomNumber}
                  </p>
                )}
            </div>
          </div>

          <div className="flex items-end justify-end gap-3 mt-4">
            {/* VIEW DETAILS DIALOG */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-300">
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                    {booking.hotelId?.name}
                    <Badge
                      className={`${getStatusColor(
                        booking.status
                      )} ml-2 text-xs font-normal`}
                    >
                      {booking.status}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    Booking ID:{" "}
                    <span className="font-mono text-xs">{booking._id}</span>
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-4">
                  <div className="grid gap-6">
                    {/* Hotel & Room Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <img
                        src={
                          booking.roomId?.images?.[0] ||
                          "https://placehold.co/600x400"
                        }
                        className="object-cover w-full h-48 rounded-lg"
                        alt="Room"
                      />
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Room Details
                          </h4>
                          <p className="text-sm text-gray-600">
                            {booking.roomId?.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {booking.roomId?.desc}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Location
                          </h4>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5" />
                            {booking.hotelId?.address || "Address unavailable"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stay Dates */}
                    <div className="grid grid-cols-2 gap-4 p-4 text-center rounded-lg bg-muted/30">
                      <div>
                        <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                          Check-In
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {formattedCheckIn}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                          Check-Out
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {formattedCheckOut}
                        </p>
                      </div>
                      <div className="col-span-2 pt-2 mt-1 text-sm border-t text-muted-foreground">
                        Total Stay:{" "}
                        <b>
                          {nights} Night{nights > 1 ? "s" : ""}
                        </b>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-2">
                      <h4 className="flex items-center font-semibold text-gray-900">
                        <CreditCard className="w-4 h-4 mr-2" /> Payment Details
                      </h4>
                      <div className="p-4 space-y-2 rounded-lg bg-gray-50">
                        <div className="flex justify-between text-sm">
                          <span>Total Price:</span>
                          <span className="text-lg font-bold">
                            {currency} {convertPrice(booking.totalPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Payment Method:</span>
                          <span className="capitalize">
                            {booking.paymentMethod === "payLater"
                              ? "Pay at Property"
                              : "Paid Online"}
                          </span>
                        </div>
                        {booking.status === "confirmed" && (
                          <div className="flex justify-between text-sm font-medium text-green-600">
                            <span>Payment Status:</span>
                            <span>Paid / Confirmed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <DialogFooter className="gap-2 mt-4 sm:gap-0">
                  {/* Only show PAY NOW if pending and upcoming */}
                  {isUpcoming && booking.status === "pending" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full text-white bg-blue-600 sm:w-auto hover:bg-blue-700">
                          <CreditCard className="w-4 h-4 mr-2" /> Pay Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Complete Payment</DialogTitle>
                          <DialogDescription>
                            Secure payment via Stripe for{" "}
                            <b>
                              {currency} {convertPrice(booking.totalPrice)}
                            </b>
                            .
                          </DialogDescription>
                        </DialogHeader>
                        <Elements stripe={stripePromise}>
                          <StripePaymentForm
                            amount={convertPrice(booking.totalPrice)}
                            currency={currency}
                            onSuccess={(paymentIntent) =>
                              onPayConfirm(booking._id, paymentIntent)
                            }
                          />
                        </Elements>
                      </DialogContent>
                    </Dialog>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* MAIN PAY BUTTON (Quick Access) */}
            {isUpcoming && booking.status === "pending" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="text-white bg-blue-600 hover:bg-blue-700">
                    <CreditCard className="w-4 h-4 mr-2" /> Pay Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                    <DialogDescription>
                      Secure payment via Stripe for{" "}
                      <b>
                        {currency} {convertPrice(booking.totalPrice)}
                      </b>
                      .
                    </DialogDescription>
                  </DialogHeader>
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm
                      amount={convertPrice(booking.totalPrice)}
                      currency={currency}
                      onSuccess={(paymentIntent) =>
                        onPayConfirm(booking._id, paymentIntent)
                      }
                    />
                  </Elements>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const EmptyState = ({ message }) => (
  <div className="py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground bg-muted/10">
    <History className="w-10 h-10 mx-auto mb-3 opacity-20" />
    <p>{message}</p>
  </div>
);

export default MyDashboard;
