import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD"); // Default Currency

  // 1 USD = 300 LKR (මෙය පසුව API එකකින් ගන්න පුළුවන්)
  const exchangeRate = 300;

  // මිල Format කරන Function එක
  const formatPrice = (priceInUSD) => {
    if (currency === "LKR") {
      // රුපියල් නම්: 300න් වැඩි කර කොමා දමා පෙන්වන්න (e.g., LKR 45,000)
      const converted = priceInUSD * exchangeRate;
      return `LKR ${converted.toLocaleString()}`;
    }
    // ඩොලර් නම් (e.g., $150)
    return `$${priceInUSD}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
