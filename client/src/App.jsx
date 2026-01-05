import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Featured from "./components/Featured"; // Import Featured
import { ThemeProvider } from "./components/theme-provider";

// Placeholder Pages
const FindHotels = () => (
  <div className="pt-24 container">
    <h1>Find Hotels Page</h1>
  </div>
);

// Home Page Layout
const Home = () => (
  <>
    <Hero />
    <Featured /> {/* Featured Hotels Section */}
    {/* තව Sections (Reviews, Newsletter) මෙතනට පස්සේ දාන්න පුළුවන් */}
    <div className="py-20 text-center">
      <h3 className="text-2xl font-bold">More coming soon...</h3>
    </div>
  </>
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <main className="min-h-screen bg-background text-foreground font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-hotels" element={<FindHotels />} />
        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App;
