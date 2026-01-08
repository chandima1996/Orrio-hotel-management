import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom Sub-Components
import OverviewTab from "../components/admin/OverviewTab";
import UsersTab from "../components/admin/UsersTab";
import HotelsTab from "../components/admin/HotelsTab";
import RoomsTab from "../components/admin/RoomsTab";
import DeleteConfirmDialog from "../components/admin/DeleteConfirmDialog";

const AdminDashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  // Data States
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Dynamic Constants
  const [hotelConstants, setHotelConstants] = useState({
    types: [],
    amenities: [],
    features: [],
  });
  const [roomConstants, setRoomConstants] = useState({
    types: [],
    amenities: [],
  });

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({ type: "", id: "" });
  const [adminPasswordInput, setAdminPasswordInput] = useState("");

  // Auth Check
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) navigate("/sign-in");
      else if (user?.publicMetadata?.role !== "admin") navigate("/");
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  // Fetch Constants
  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const [hotelRes, roomRes] = await Promise.all([
          axios.get("http://localhost:5000/api/hotels/constants"),
          axios.get("http://localhost:5000/api/rooms/constants"),
        ]);
        setHotelConstants(hotelRes.data);
        setRoomConstants(roomRes.data);
      } catch (err) {
        console.error("Failed to load constants.");
      }
    };
    if (isSignedIn) fetchConstants();
  }, [isSignedIn]);

  // Fetch Data Function
  const fetchData = async (endpoint, setter) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/${endpoint}`);
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setter(data);
    } catch (err) {
      toast.error(`Failed to fetch ${endpoint}`);
      setter([]);
    }
  };

  // Fetch Data on Tab Change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (activeTab === "users") await fetchData("users", setUsers);
      if (activeTab === "hotels") await fetchData("hotels", setHotels);
      if (activeTab === "rooms") {
        await fetchData("rooms", setRooms);
        await fetchData("hotels", setHotels);
      }
      if (activeTab === "bookings") await fetchData("bookings", setBookings);
      setLoading(false);
    };
    if (isSignedIn && user?.publicMetadata?.role === "admin") {
      loadData();
    }
  }, [activeTab, isSignedIn, user]);

  // Handle Delete Click (Passed to children)
  const initiateDelete = (type, id) => {
    setDeleteData({ type, id });
    setAdminPasswordInput("");
    setDeleteDialogOpen(true);
  };

  // Confirm Delete Logic
  const confirmDelete = async () => {
    if (adminPasswordInput !== "admin123")
      return toast.error("Incorrect Admin Password!");

    try {
      let endpoint = "";
      if (deleteData.type === "hotel") endpoint = `hotels/${deleteData.id}`;
      if (deleteData.type === "room") {
        const r = rooms.find((item) => item._id === deleteData.id);
        endpoint = `rooms/${deleteData.id}/${r?.hotelId}`;
      }
      if (deleteData.type === "user") endpoint = `users/${deleteData.id}`;

      await axios.delete(`http://localhost:5000/api/${endpoint}`);
      toast.success("Deleted Successfully");
      setDeleteDialogOpen(false);

      // Refresh Data
      if (deleteData.type === "hotel") fetchData("hotels", setHotels);
      if (deleteData.type === "room") fetchData("rooms", setRooms);
      if (deleteData.type === "user") fetchData("users", setUsers);
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  if (user?.publicMetadata?.role !== "admin") return null;

  return (
    <div className="container px-4 py-10 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, hotels, and rooms.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-300">
          <ShieldAlert className="w-4 h-4" /> Admin Access
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            bookingsCount={bookings.length}
            hotelsCount={hotels.length}
            usersCount={users.length}
          />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab
            users={users}
            fetchUsers={() => fetchData("users", setUsers)}
            onDeleteClick={initiateDelete}
          />
        </TabsContent>

        <TabsContent value="hotels">
          <HotelsTab
            hotels={hotels}
            fetchHotels={() => fetchData("hotels", setHotels)}
            onDeleteClick={initiateDelete}
            constants={hotelConstants}
          />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomsTab
            rooms={rooms}
            hotels={hotels}
            fetchRooms={() => fetchData("rooms", setRooms)}
            onDeleteClick={initiateDelete}
            constants={roomConstants}
          />
        </TabsContent>
      </Tabs>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        password={adminPasswordInput}
        setPassword={setAdminPasswordInput}
      />
    </div>
  );
};

export default AdminDashboard;
