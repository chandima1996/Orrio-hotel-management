import {
  Wifi,
  Droplets,
  Dumbbell,
  Utensils,
  Car,
  Wind,
  Martini,
} from "lucide-react";

export const getAmenityIcon = (name) => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("wifi")) return <Wifi className="w-4 h-4" />;
  if (lowerName.includes("pool")) return <Droplets className="w-4 h-4" />;
  if (lowerName.includes("gym")) return <Dumbbell className="w-4 h-4" />;
  if (lowerName.includes("dining")) return <Utensils className="w-4 h-4" />;
  if (lowerName.includes("parking")) return <Car className="w-4 h-4" />;
  if (lowerName.includes("ac")) return <Wind className="w-4 h-4" />;
  if (lowerName.includes("bar")) return <Martini className="w-4 h-4" />;

  return <CheckCircle className="w-4 h-4" />; // Default icon
};
