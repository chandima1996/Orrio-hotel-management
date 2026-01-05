import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // Default currency is USD
  const [currency, setCurrency] = useState("USD");

  // Exchange Rates (Static values for now)
  const rates = {
    USD: 1,
    LKR: 300, // 1 USD = 300 LKR (Approx)
    EUR: 0.92,
    GBP: 0.79,
  };

  // Price Conversion Function
  const convertPrice = (price) => {
    const rate = rates[currency] || 1;
    // Price එක Rate එකෙන් වැඩි කරලා, දශම ස්ථාන අයින් කරලා ලස්සනට පෙන්වනවා
    return Math.round(price * rate).toLocaleString();
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
