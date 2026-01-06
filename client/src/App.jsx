import { useEffect } from "react"; // 1. useEffect import කරන්න
import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react"; // 2. useUser hook එක ගන්න
import axios from "axios"; // 3. axios ගන්න

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
import Legal from "./pages/Legal";
import SingleHotel from "./pages/SingleHotel";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import SingleRoom from "./components/SingleRoom";

const Home = () => (
  <>
    <Hero />
    <Featured />
    <Stats />
  </>
);

function App() {
  // 4. Clerk එකෙන් User විස්තර ගන්න
  const { user, isSignedIn } = useUser();

  // 5. User Log වුනාම Backend එකට Data යවන්න
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
          });
          console.log("User synced with Database");
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    };

    syncUser();
  }, [isSignedIn, user]); // User කෙනෙක් sign in වුන ගමන් මේක වැඩ කරනවා

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
            <Route path="/hotels/:id" element={<SingleHotel />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/room/:id" element={<SingleRoom />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </ThemeProvider>
  );
}

export default App;
