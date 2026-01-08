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
// Currency Hook එක import කරන්න
import { useCurrency } from "@/context/CurrencyContext";

const HotelsTab = ({ hotels, fetchHotels, onDeleteClick, constants }) => {
  const { currency } = useCurrency(); // Currency එක ගන්න
  const exchangeRate = 300; // Rate එක

  // Price Format Helper
  const formatPrice = (amount) => {
    if (!amount) return "0";
    if (currency === "LKR")
      return `Rs. ${(amount * exchangeRate).toLocaleString()}`;
    return `$${amount.toLocaleString()}`;
  };

  // ... (Form State සහ Handlers ටික පරණ විදියටම තියන්න - වෙනසක් නෑ) ...
  const initialHotelState = {
    name: "",
    type: "",
    country: "",
    city: "",
    address: "",
    contact: "",
    email: "",
    description: "",
    price: { normal: "", discount: "" },
    rating: 5,
    amenities: [],
    features: [],
    images: [],
  };
  const [hotelForm, setHotelForm] = useState(initialHotelState);
  const [hotelImgInput, setHotelImgInput] = useState("");

  const toggleSelection = (item, currentList, setter, fieldName) => {
    const newList = currentList.includes(item)
      ? currentList.filter((i) => i !== item)
      : [...currentList, item];
    setter((prev) => ({ ...prev, [fieldName]: newList }));
  };

  const handleAddHotelImages = () => {
    if (!hotelImgInput) return;
    const newImages = hotelImgInput
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url !== "");
    setHotelForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    setHotelImgInput("");
  };

  const handleCreateHotel = async () => {
    try {
      await axios.post("http://localhost:5000/api/hotels", hotelForm);
      toast.success("Hotel Created Successfully");
      setHotelForm(initialHotelState);
      setHotelImgInput("");
      fetchHotels();
    } catch (err) {
      toast.error("Failed to create hotel");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hotels</CardTitle>
        <Dialog>
          {/* ... (Dialog Content eka parana widiyatama thiyanna) ... */}
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Hotel</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Form Inputs (Previous code same) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hotel Name</Label>
                  <Input
                    value={hotelForm.name}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, name: e.target.value })
                    }
                    placeholder="Grand Hotel"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    onValueChange={(v) =>
                      setHotelForm({ ...hotelForm, type: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={hotelForm.city}
                  onChange={(e) =>
                    setHotelForm({ ...hotelForm, city: e.target.value })
                  }
                  placeholder="City"
                />
                <Input
                  value={hotelForm.country}
                  onChange={(e) =>
                    setHotelForm({ ...hotelForm, country: e.target.value })
                  }
                  placeholder="Country"
                />
              </div>
              <Input
                value={hotelForm.address}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, address: e.target.value })
                }
                placeholder="Full Address"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={hotelForm.contact}
                  onChange={(e) =>
                    setHotelForm({ ...hotelForm, contact: e.target.value })
                  }
                  placeholder="Contact No"
                />
                <Input
                  value={hotelForm.email}
                  onChange={(e) =>
                    setHotelForm({ ...hotelForm, email: e.target.value })
                  }
                  placeholder="Email"
                />
              </div>
              <Textarea
                value={hotelForm.description}
                onChange={(e) =>
                  setHotelForm({ ...hotelForm, description: e.target.value })
                }
                placeholder="Description"
              />
              <div className="grid grid-cols-2 gap-4 p-3 rounded bg-muted/40">
                <div className="space-y-1">
                  <Label>Base Price ($)</Label>
                  <Input
                    type="number"
                    value={hotelForm.price.normal}
                    onChange={(e) =>
                      setHotelForm({
                        ...hotelForm,
                        price: { ...hotelForm.price, normal: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Discount ($)</Label>
                  <Input
                    type="number"
                    value={hotelForm.price.discount}
                    onChange={(e) =>
                      setHotelForm({
                        ...hotelForm,
                        price: { ...hotelForm.price, discount: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="block mb-2 font-semibold">Amenities</Label>
                <div className="grid grid-cols-3 gap-2">
                  {constants.amenities?.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        checked={hotelForm.amenities.includes(item)}
                        onCheckedChange={() =>
                          toggleSelection(
                            item,
                            hotelForm.amenities,
                            setHotelForm,
                            "amenities"
                          )
                        }
                      />
                      <label className="text-sm">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="block mb-2 font-semibold">Features</Label>
                <div className="grid grid-cols-3 gap-2">
                  {constants.features?.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        checked={hotelForm.features.includes(item)}
                        onCheckedChange={() =>
                          toggleSelection(
                            item,
                            hotelForm.features,
                            setHotelForm,
                            "features"
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
                  value={hotelImgInput}
                  onChange={(e) => setHotelImgInput(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddHotelImages}
                  className="w-full"
                >
                  <ImagePlus className="w-4 h-4 mr-2" /> Add Images
                </Button>
              </div>
              <div className="flex gap-2 overflow-x-auto p-2 border rounded min-h-[80px]">
                {hotelForm.images.length === 0 && (
                  <span className="m-auto text-sm text-muted-foreground">
                    No images added
                  </span>
                )}
                {hotelForm.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="object-cover w-20 h-20 border rounded shadow-sm"
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateHotel}>Save Hotel</Button>
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
                <th className="p-4">City</th>
                <th className="p-4">Price</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {hotels.length > 0 ? (
                hotels.map((h) => (
                  <tr key={h._id} className="border-t">
                    <td className="p-4 font-medium">{h.name}</td>
                    <td className="p-4">{h.type}</td>
                    <td className="p-4">{h.city}</td>
                    {/* METANA EDIT KALA - PRICE DISPLAY */}
                    <td className="p-4">{formatPrice(h.price.normal)}</td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteClick("hotel", h._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    No hotels found
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

export default HotelsTab;
