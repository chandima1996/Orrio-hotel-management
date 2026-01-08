import React from "react";
import { Users, Building2, CalendarDays, DollarSign } from "lucide-react";
import StatsCard from "./StatsCard";
import { useCurrency } from "@/context/CurrencyContext"; // Currency Context එක import කරන්න

const OverviewTab = ({ bookingsCount, hotelsCount, usersCount }) => {
  const { currency } = useCurrency(); // Currency එක ගන්න

  // Exchange Rate (මෙය පසුව API එකකින් ගන්නත් පුළුවන්, දැනට hardcode කරමු)
  const exchangeRate = 300;
  const baseRevenueUSD = 45231; // Backend එකෙන් එන USD අගය

  // Price Format කරන Function එක
  const formatPrice = (amount) => {
    if (currency === "LKR") {
      return `Rs. ${(amount * exchangeRate).toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* formatPrice function එක හරහා value එක යවන්න */}
      <StatsCard
        title="Total Revenue"
        value={formatPrice(baseRevenueUSD)}
        icon={DollarSign}
      />

      <StatsCard title="Bookings" value={bookingsCount} icon={CalendarDays} />
      <StatsCard title="Hotels" value={hotelsCount} icon={Building2} />
      <StatsCard title="Users" value={usersCount} icon={Users} />
    </div>
  );
};

export default OverviewTab;
