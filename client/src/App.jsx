import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Featured from "./components/Featured";
import Stats from "./components/Stats";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/theme-provider";
// --- 1. Toaster Component එක import කරන්න ---
import { Toaster } from "@/components/ui/sonner";

// Pages
import FindHotels from "./pages/FindHotels";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Legal from "./pages/Legal";
import SingleHotel from "./pages/SingleHotel";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import SingleRoom from "./components/SingleRoom";
import MyDashboard from "./pages/MyDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const Home = () => (
  <>
    <Hero />
    <Featured />
    <Stats />
  </>
);

function App() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        try {
          await axios.post("http://localhost:5000/api/users/save-user", {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            photo: user.imageUrl,
            // පහත line එක එකතු කරන්න: Clerk metadata වලින් role එක යවන්න
            role: user.publicMetadata?.role || "user",
          });
          // console.log("User synced with Database");
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    };

    syncUser();
  }, [isSignedIn, user]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <main className="flex flex-col min-h-screen pt-20 font-sans bg-background text-foreground">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find-hotels" element={<FindHotels />} />
            <Route path="/hotels/:id" element={<SingleHotel />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Legal />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/room/:id" element={<SingleRoom />} />
            <Route path="/dashboard" element={<MyDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
        <Footer />
      </main>

      {/* --- 2. Toaster එක මෙතනට දාන්න (Footer එකට පස්සේ තිබුනාට කමක් නෑ) --- */}
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
