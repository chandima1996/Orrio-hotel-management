import React, { useState } from "react";
import axios from "axios";
import { Plus, Trash2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Currency Hook import
import { useCurrency } from "@/context/CurrencyContext";

const RoomsTab = ({ rooms, hotels, fetchRooms, onDeleteClick, constants }) => {
  const { currency } = useCurrency(); // Hook Call
  const exchangeRate = 300;

  const formatPrice = (amount) => {
    if (!amount) return "0";
    if (currency === "LKR")
      return `Rs. ${(amount * exchangeRate).toLocaleString()}`;
    return `$${amount.toLocaleString()}`;
  };

  // ... (State and Handlers same as before) ...
  const initialRoomState = {
    hotelId: "",
    name: "",
    type: "",
    description: "",
    price: { normal: "", discount: "" },
    capacity: 2,
    size: "",
    amenities: [],
    images: [],
    roomNumbers: "",
  };
  const [roomForm, setRoomForm] = useState(initialRoomState);
  const [roomImgInput, setRoomImgInput] = useState("");

  const toggleSelection = (item, currentList, setter, fieldName) => {
    const newList = currentList.includes(item)
      ? currentList.filter((i) => i !== item)
      : [...currentList, item];
    setter((prev) => ({ ...prev, [fieldName]: newList }));
  };

  const handleAddRoomImages = () => {
    if (!roomImgInput) return;
    const newImages = roomImgInput
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url !== "");
    setRoomForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    setRoomImgInput("");
  };

  const handleCreateRoom = async () => {
    if (!roomForm.hotelId) return toast.error("Select a hotel first!");
    try {
      const roomNumbersArray = roomForm.roomNumbers.split(",").map((num) => ({
        number: parseInt(num.trim()),
      }));
      const payload = { ...roomForm, roomNumbers: roomNumbersArray };
      await axios.post(
        `http://localhost:5000/api/rooms/${roomForm.hotelId}`,
        payload
      );
      toast.success("Room Created Successfully");
      setRoomForm(initialRoomState);
      setRoomImgInput("");
      fetchRooms();
    } catch (err) {
      toast.error("Failed to create room");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Rooms</CardTitle>
        <Dialog>
          {/* ... (Dialog Content same as before) ... */}
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Select Hotel</Label>
                <Select
                  onValueChange={(v) =>
                    setRoomForm({ ...roomForm, hotelId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a Hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map((h) => (
                      <SelectItem key={h._id} value={h._id}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Room Name</Label>
                  <Input
                    value={roomForm.name}
                    onChange={(e) =>
                      setRoomForm({ ...roomForm, name: e.target.value })
                    }
                    placeholder="Deluxe Suite"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    onValueChange={(v) => setRoomForm({ ...roomForm, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Room Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {constants.types?.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Textarea
                value={roomForm.description}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, description: e.target.value })
                }
                placeholder="Room Description"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Price ($)"
                  value={roomForm.price.normal}
                  onChange={(e) =>
                    setRoomForm({
                      ...roomForm,
                      price: { ...roomForm.price, normal: e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Capacity (Persons)"
                  value={roomForm.capacity}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, capacity: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Size (sqm)"
                  value={roomForm.size}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, size: e.target.value })
                  }
                />
                <Input
                  placeholder="Room Numbers (101, 102)"
                  value={roomForm.roomNumbers}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, roomNumbers: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="block mb-2 font-semibold">Amenities</Label>
                <div className="grid grid-cols-3 gap-2">
                  {constants.amenities?.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        checked={roomForm.amenities.includes(item)}
                        onCheckedChange={() =>
                          toggleSelection(
                            item,
                            roomForm.amenities,
                            setRoomForm,
                            "amenities"
                          )
                        }
                      />
                      <label className="text-sm">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Images (URLs)</Label>
                <Textarea
                  placeholder="https://img1.jpg, https://img2.jpg (Separate with comma)"
                  value={roomImgInput}
                  onChange={(e) => setRoomImgInput(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddRoomImages}
                  className="w-full"
                >
                  <ImagePlus className="w-4 h-4 mr-2" /> Add Images
                </Button>
              </div>
              <div className="flex gap-2 overflow-x-auto p-2 border rounded min-h-[80px]">
                {roomForm.images.length === 0 && (
                  <span className="m-auto text-sm text-muted-foreground">
                    No images added
                  </span>
                )}
                {roomForm.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="object-cover w-20 h-20 border rounded shadow-sm"
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRoom} disabled={!roomForm.hotelId}>
                Save Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="p-4">{r.name}</td>
                    <td className="p-4">{r.type}</td>
                    {/* METANA EDIT KALA - PRICE DISPLAY */}
                    <td className="p-4">{formatPrice(r.price.normal)}</td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteClick("room", r._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    No rooms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomsTab;
