import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Featured from "./components/Featured";
import Stats from "./components/Stats";
import Footer from "./components/Footer";
import FindHotels from "./pages/FindHotels";
import Contact from "./pages/Contact"; // New Import
import About from "./pages/About"; // New Import
import { ThemeProvider } from "./components/theme-provider";

// Home Page Layout
const Home = () => (
  <>
    <Hero />
    <Featured />
    <Stats />
  </>
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <main className="min-h-screen bg-background text-foreground font-sans flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find-hotels" element={<FindHotels />} />
            <Route path="/contact" element={<Contact />} /> {/* Route added */}
            <Route path="/about" element={<About />} /> {/* Route added */}
          </Routes>
        </div>
        <Footer />
      </main>
    </ThemeProvider>
  );
}

export default App;
