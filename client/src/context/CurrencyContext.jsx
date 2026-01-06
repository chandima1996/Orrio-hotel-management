import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");

  // මෙන්න මේ variable එක කලින් කෝඩ් එකේ තිබුනේ නෑ, ඒකයි Error එක ආවේ
  const exchangeRate = 300; // දැනට අපි 1 USD = 300 LKR කියලා ගමු

  // Price Conversion Function
  const convertPrice = (priceInUSD) => {
    if (currency === "LKR") {
      // ඩොලර් නම් රුපියල් කරන්න
      return (priceInUSD * exchangeRate).toLocaleString();
    }
    // නැත්නම් ඩොලර් විදියටම එවන්න
    return priceInUSD.toLocaleString();
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        exchangeRate, // දැන් මේක define කරලා තියෙන නිසා error එන්නේ නෑ
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
