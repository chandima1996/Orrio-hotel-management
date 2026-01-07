import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useCurrency } from "../context/CurrencyContext";
import axios from "axios";
import {
  Mail,
  Edit2,
  Save,
  Lock,
  History,
  Loader2,
  Filter,
  X,
  CalendarIcon,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const MyDashboard = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { currency, convertPrice } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Filtering States
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Booking Data
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  // To trigger re-fetch after payment
  const [refreshKey, setRefreshKey] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    country: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  // --- Fetch Data ---
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
            setDbUser(userRes.data.data);
            setFormData({
              firstName: userRes.data.data.firstName || "",
              lastName: userRes.data.data.lastName || "",
              phone: userRes.data.data.phone || "",
              address: userRes.data.data.address || "",
              country: userRes.data.data.country || "",
            });

            // 2. Get Bookings (Real API Call)
            // Note: We need the MongoDB _id of the user for bookings, not Clerk ID
            // Assuming userRes.data.data._id exists
            const userId = userRes.data.data._id;

            const bookingRes = await axios.get(
              `http://localhost:5000/api/bookings/user/${userId}`
            );

            const allBookings = bookingRes.data;
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison

            const upcoming = [];
            const past = [];

            allBookings.forEach((b) => {
              const checkInDate = new Date(b.checkIn);

              // Logic:
              // If check-in is in future OR today -> Upcoming
              // If check-in is passed -> History
              if (checkInDate >= today) {
                upcoming.push(b);
              } else {
                past.push(b);
              }
            });

            // Sort by Date (Newest first)
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
  }, [isLoaded, clerkUser, refreshKey]); // Refresh when refreshKey changes

  // --- Payment Handler ---
  const handlePaymentConfirm = async (bookingId) => {
    try {
      const promise = axios.put(
        `http://localhost:5000/api/bookings/pay/${bookingId}`
      );

      toast.promise(promise, {
        loading: "Processing payment and assigning room...",
        success: (data) => {
          setRefreshKey((prev) => prev + 1); // Refresh data
          return `Payment successful! Room ${data.data.assignedRoomNumber} assigned.`;
        },
        error: "Failed to process payment. Please try again.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // --- Filtering Logic ---
  const applyFilters = (bookingList) => {
    return bookingList.filter((booking) => {
      const statusMatch =
        filterStatus === "all" ? true : booking.status === filterStatus;

      // Formatting date to match input 'YYYY-MM-DD'
      const bookingDate = new Date(booking.checkIn).toISOString().split("T")[0];
      const dateMatch = filterDate === "" ? true : bookingDate === filterDate;

      return statusMatch && dateMatch;
    });
  };

  const filteredUpcoming = applyFilters(bookings.upcoming);
  const filteredPast = applyFilters(bookings.past);

  const clearFilters = () => {
    setFilterDate("");
    setFilterStatus("all");
  };

  // --- Profile Update Handlers ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  // --- Password Change (Clerk) ---
  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      setPasswordLoading(true);
      await clerkUser.updatePassword({
        newPassword: newPassword,
        currentPassword: currentPassword,
      });
      toast.success("Password changed successfully.");
      setPasswordOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.errors?.[0]?.message || "Password Update Failed");
    } finally {
      setPasswordLoading(false);
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

                <div className="flex-1 space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                    <CalendarIcon className="w-3 h-3" /> Filter by Check-in
                  </Label>
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                {(filterStatus !== "all" || filterDate !== "") && (
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
                      type="upcoming"
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
                      type="past"
                    />
                  ))}
                  {filteredPast.length === 0 && (
                    <EmptyState message="No past bookings found." />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* PROFILE TAB (Existing Code - Shortened for brevity as it was working) */}
          <TabsContent value="profile" className="animate-in fade-in-50">
            {/* ... (Keep your existing Profile Tab code here) ... */}
            {/* Since the request focused on booking logic, I'm keeping the profile structure same as your provided code */}
            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 border-b">
                <CardTitle>Personal Information</CardTitle>
                <Button
                  onClick={() =>
                    isEditing ? handleSaveProfile() : setIsEditing(true)
                  }
                  variant={isEditing ? "default" : "outline"}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50 text-muted-foreground">
                      {clerkUser?.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                  {/* Password Dialog */}
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="password"
                        value="********"
                        disabled
                        className="bg-muted/30"
                      />
                      <Dialog
                        open={passwordOpen}
                        onOpenChange={setPasswordOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline">Change Password</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Input
                              placeholder="Current Password"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  currentPassword: e.target.value,
                                })
                              }
                            />
                            <Input
                              placeholder="New Password"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                            />
                            <Input
                              placeholder="Confirm Password"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirmPassword: e.target.value,
                                })
                              }
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handlePasswordChange}
                              disabled={passwordLoading}
                            >
                              Update
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  {/* Form Fields */}
                  {["firstName", "lastName", "phone", "address", "country"].map(
                    (field) => (
                      <div className="space-y-2" key={field}>
                        <Label className="capitalize">
                          {field.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <Input
                          name={field}
                          value={formData[field]}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted/30" : ""}
                        />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// --- Sub Component: Booking Card ---
const BookingCard = ({
  booking,
  currency,
  convertPrice,
  onPayConfirm,
  type,
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

  // CheckIn Date Formatting
  const formattedCheckIn = new Date(booking.checkIn).toLocaleDateString();
  const formattedCheckOut = new Date(booking.checkOut).toLocaleDateString();

  return (
    <Card className="overflow-hidden transition-all border group hover:border-primary/50">
      <div className="flex flex-col md:flex-row">
        {/* Image Handling - getting first image from Room or Hotel */}
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
                <p className="text-sm font-medium text-muted-foreground">
                  {booking.hotelId?.name}
                </p>
              </div>
              <Badge className={`${getStatusColor(booking.status)} capitalize`}>
                {booking.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 mt-3 text-sm gap-y-1 text-muted-foreground">
              <p>
                Check-in:{" "}
                <span className="font-medium text-foreground">
                  {formattedCheckIn}
                </span>
              </p>
              <p>
                Check-out:{" "}
                <span className="font-medium text-foreground">
                  {formattedCheckOut}
                </span>
              </p>

              {/* Display Assigned Room Number if Confirmed/Completed */}
              {(booking.status === "confirmed" ||
                booking.status === "completed") &&
                booking.assignedRoomNumber && (
                  <p className="col-span-2 p-1 px-2 mt-2 font-semibold text-green-700 bg-green-100 border border-green-200 rounded dark:bg-green-900/20 dark:text-green-300 w-fit dark:border-green-800">
                    🏡 Room No: {booking.assignedRoomNumber}
                  </p>
                )}
            </div>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-xl font-bold text-primary">
                {currency} {convertPrice(booking.totalPrice)}
              </p>
            </div>

            {/* Edit / Pay Now Button - Only for Pending Bookings in Upcoming Tab */}
            {type === "upcoming" && booking.status === "pending" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="text-white bg-blue-600 hover:bg-blue-700">
                    <CreditCard className="w-4 h-4 mr-2" /> Pay Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                    <DialogDescription>
                      Confirm payment of{" "}
                      <b>
                        {currency} {convertPrice(booking.totalPrice)}
                      </b>{" "}
                      to secure your booking.
                      <br />A room number will be assigned automatically.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => onPayConfirm(booking._id)}>
                      Confirm Payment
                    </Button>
                  </DialogFooter>
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
