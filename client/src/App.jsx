import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/theme-provider";

// Placeholder Pages (අපි පස්සේ මේවා හදමු)
const Home = () => (
  <div className="pt-24 h-screen flex justify-center items-center">
    <h1>Home Page</h1>
  </div>
);
const FindHotels = () => (
  <div className="pt-24">
    <h1>Find Hotels</h1>
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* Navbar එක හැම page එකකම උඩින්ම තියෙනවා */}
      <Navbar />

      <main className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-hotels" element={<FindHotels />} />
          {/* තව routes මෙතනට එනවා... */}
        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App;
