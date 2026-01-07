import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react"; // Clerk Hook
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
} from "@/components/ui/select"; // Select component එක import කළා

// Sonner Toast
import { toast } from "sonner";

const MyDashboard = () => {
  const { user: clerkUser, isLoaded } = useUser(); // signOut function එක අවශ්‍ය නැති නිසා ඉවත් කළා
  const { currency, convertPrice } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- Filtering States (අලුතින් එකතු කළ කොටස) ---
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Profile Form Data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    country: "",
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  // Bookings Data State
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });

  // --- 1. Fetch Data from Backend ---
  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && clerkUser) {
        try {
          setLoading(true);
          // Backend call to get user details
          const res = await axios.get(
            `http://localhost:5000/api/users/${clerkUser.id}`
          );

          if (res.data.success) {
            setDbUser(res.data.data);
            setFormData({
              firstName: res.data.data.firstName || "",
              lastName: res.data.data.lastName || "",
              phone: res.data.data.phone || "",
              address: res.data.data.address || "",
              country: res.data.data.country || "",
            });
          }

          // --- Mock Bookings Data ---
          // Status: 'confirmed', 'completed', 'pending', 'cancelled'
          const mockBookings = [
            {
              id: 101,
              roomName: "Ocean View Suite",
              image:
                "https://images.unsplash.com/photo-1566073771259-6a8506099945",
              checkIn: "2024-12-20",
              checkOut: "2024-12-25",
              status: "confirmed",
              totalPrice: 25000,
            },
            {
              id: 102,
              roomName: "Garden Room",
              image:
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
              checkIn: "2023-11-10",
              checkOut: "2023-11-12",
              status: "completed",
              totalPrice: 15000,
            },
            {
              id: 103,
              roomName: "Deluxe Villa",
              image:
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
              checkIn: "2024-12-28",
              checkOut: "2024-12-30",
              status: "pending",
              totalPrice: 45000,
            },
            {
              id: 104,
              roomName: "Standard Room",
              image:
                "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
              checkIn: "2023-10-05",
              checkOut: "2023-10-08",
              status: "cancelled",
              totalPrice: 10000,
            },
          ];
          const today = new Date();
          const upcoming = mockBookings.filter(
            (b) =>
              new Date(b.checkIn) >= today ||
              b.status === "confirmed" ||
              b.status === "pending"
          );
          const past = mockBookings.filter(
            (b) =>
              new Date(b.checkIn) < today &&
              (b.status === "completed" || b.status === "cancelled")
          );
          setBookings({ upcoming, past });
          // --- End Mock ---
        } catch (err) {
          console.error("Error fetching user data", err);
          toast.error("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isLoaded, clerkUser]);

  // --- Filtering Logic ---
  const applyFilters = (bookingList) => {
    return bookingList.filter((booking) => {
      // 1. Filter by Status
      const statusMatch =
        filterStatus === "all" ? true : booking.status === filterStatus;

      // 2. Filter by Date (Check-in Date match)
      const dateMatch =
        filterDate === "" ? true : booking.checkIn === filterDate;

      return statusMatch && dateMatch;
    });
  };

  const filteredUpcoming = applyFilters(bookings.upcoming);
  const filteredPast = applyFilters(bookings.past);

  const clearFilters = () => {
    setFilterDate("");
    setFilterStatus("all");
  };

  // --- Handle Profile Update ---
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

      toast.success("Profile Updated!", {
        description: "Your details have been saved successfully.",
      });
    } catch (err) {
      toast.error("Update Failed", {
        description: "Could not update profile. Please try again.",
      });
    }
  };

  // --- Handle Password Change ---
  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Error", { description: "All fields are required." });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Error", { description: "New passwords do not match." });
      return;
    }

    try {
      setPasswordLoading(true);
      await clerkUser.updatePassword({
        newPassword: newPassword,
        currentPassword: currentPassword,
      });

      toast.success("Success!", {
        description: "Password changed successfully.",
      });

      setPasswordOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      let errorMessage = "Something went wrong.";
      if (err.errors && err.errors[0]?.message) {
        errorMessage = err.errors[0].message;
      }
      if (err.errors && err.errors[0]?.code === "form_password_incorrect") {
        errorMessage = "Current password is incorrect.";
      }

      toast.error("Password Update Failed", {
        description: errorMessage,
      });
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
      {/* --- Header --- */}
      <div className="px-6 pt-10 pb-16 border-b bg-background">
        <div className="container flex flex-col items-center justify-between max-w-5xl gap-6 mx-auto md:flex-row">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 shadow-lg border-muted">
              <AvatarImage src={clerkUser?.imageUrl} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {dbUser?.firstName?.[0]}
                {dbUser?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground">
                Hello, {dbUser?.firstName || clerkUser?.firstName || "Guest"}!
              </h1>
              <p className="mt-1 text-muted-foreground">
                Welcome to your personal dashboard.
              </p>
            </div>
          </div>

          {/* REMOVED: Sign Out Button */}
        </div>
      </div>

      {/* --- Main Content --- */}
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
            {/* --- Filter Section --- */}
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
                    <CalendarIcon className="w-3 h-3" /> Filter by Date
                    (Check-in)
                  </Label>
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                {(filterStatus !== "all" || filterDate !== "") && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
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

                {/* Upcoming List */}
                <TabsContent value="upcoming" className="pt-4 space-y-4">
                  {filteredUpcoming.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      currency={currency}
                      convertPrice={convertPrice}
                      type="upcoming"
                    />
                  ))}
                  {filteredUpcoming.length === 0 && (
                    <EmptyState message="No upcoming bookings found matching your filters." />
                  )}
                </TabsContent>

                {/* History List */}
                <TabsContent value="past" className="pt-4 space-y-4">
                  {filteredPast.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      currency={currency}
                      convertPrice={convertPrice}
                      type="past"
                    />
                  ))}
                  {filteredPast.length === 0 && (
                    <EmptyState message="No past bookings found matching your filters." />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* PERSONAL DETAILS TAB */}
          <TabsContent value="profile" className="animate-in fade-in-50">
            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 border-b">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your details and security.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    if (isEditing) handleSaveProfile();
                    else setIsEditing(true);
                  }}
                  variant={isEditing ? "default" : "outline"}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" /> Edit Details
                    </>
                  )}
                </Button>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Email (Read Only) */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" /> Email Address
                    </Label>
                    <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50 text-muted-foreground">
                      {clerkUser?.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>

                  {/* Password Change Dialog */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Password
                    </Label>
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
                          <Button
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            Change Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                              Enter your current password to set a new one.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Current Password</Label>
                              <Input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>New Password</Label>
                              <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    newPassword: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Re-enter New Password</Label>
                              <Input
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
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handlePasswordChange}
                              disabled={passwordLoading}
                            >
                              {passwordLoading && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              )}
                              Update Password
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={
                        !isEditing ? "bg-muted/30 border-transparent" : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={
                        !isEditing ? "bg-muted/30 border-transparent" : ""
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+94 77..."
                      className={
                        !isEditing ? "bg-muted/30 border-transparent" : ""
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={
                        !isEditing ? "bg-muted/30 border-transparent" : ""
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Country</Label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={
                        !isEditing ? "bg-muted/30 border-transparent" : ""
                      }
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-4 mt-8">
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// --- Sub Components ---

// Booking Card Component (Internal)
const BookingCard = ({ booking, currency, convertPrice, type }) => {
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

  return (
    <Card className="overflow-hidden border group hover:border-primary/50">
      <div className="flex flex-col md:flex-row">
        <img
          src={booking.image}
          alt={booking.roomName}
          className="object-cover w-full h-48 md:w-48"
        />
        <div className="flex-1 p-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-bold">{booking.roomName}</h3>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Check-in: {booking.checkIn} | Check-out: {booking.checkOut}
          </p>
          <div className="mt-4">
            <p className="text-lg font-bold text-primary">
              {currency} {convertPrice(booking.totalPrice)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const EmptyState = ({ message }) => (
  <div className="py-8 text-center border-2 border-dashed rounded-xl text-muted-foreground">
    <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
    {message}
  </div>
);

export default MyDashboard;
