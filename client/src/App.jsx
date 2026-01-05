import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Featured from "./components/Featured";
import Stats from "./components/Stats";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/theme-provider";

// Pages
import FindHotels from "./pages/FindHotels";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Legal from "./pages/Legal"; // නම වෙනස් කළා (Step 3 බලන්න)
import SingleHotel from "./pages/SingleHotel";

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
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Legal />} />{" "}
            {/* අලුත් Component එක */}
            <Route path="/hotels/:id" element={<SingleHotel />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </ThemeProvider>
  );
}

export default App;
