import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Menu, Moon, Sun, DollarSign } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";

// --- අලුතින් එකතු කල Import එක ---
import { useCurrency } from "@/context/CurrencyContext";

const Navbar = () => {
  const { user } = useUser();
  const { setTheme, theme } = useTheme();

  // --- වෙනස් කල කොටස (Local State එක වෙනුවට Global Context) ---
  const { currency, setCurrency } = useCurrency();

  const location = useLocation();

  // 1. Admin Check Logic
  const isAdmin = user?.publicMetadata?.role === "admin";

  // 2. Base Navigation Links
  const baseLinks = [
    { name: "Home", path: "/" },
    { name: "Find Hotels", path: "/find-hotels" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // 3. Dynamic Links Generator
  const getNavLinks = () => {
    const links = [...baseLinks];
    if (user) {
      if (isAdmin) {
        links.push({
          name: "Admin Dashboard",
          path: "/admin/dashboard",
          active: true,
        });
      } else {
        links.push({ name: "My Dashboard", path: "/dashboard", active: true });
      }
    }
    return links;
  };

  const finalLinks = getNavLinks();

  // --- Currency Toggle Logic (Updated) ---
  const toggleCurrency = () => {
    // USD නම් LKR කරන්න, නැත්නම් USD කරන්න (Global Context එකේ)
    setCurrency(currency === "USD" ? "LKR" : "USD");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Orrio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {finalLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary font-bold"
                  : "text-muted-foreground"
              } ${link.active ? "text-primary" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Currency Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCurrency}
            className="gap-1 font-bold text-xs border border-white/10 hover:bg-white/10"
          >
            <DollarSign className="w-3 h-3" />
            {currency}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          </Button>

          <SignedOut>
            <div className="flex gap-2">
              <Link to="/sign-in">
                <Button variant="ghost" className="hover:bg-primary/10">
                  Log In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button className="rounded-full px-6 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity">
                  Sign Up
                </Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3">
              {/* User Name Display */}
              <span className="text-sm font-medium hidden lg:block">
                Hi, {user?.firstName}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Currency Toggle Button (Optional if needed in header) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCurrency}
            className="gap-1 font-bold text-xs border border-white/10 mr-1"
          >
            {currency}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l border-white/10 bg-background/95 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-6 mt-10">
                {finalLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-lg font-medium hover:text-primary ${
                      location.pathname === link.path ? "text-primary" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="h-[1px] bg-border my-2"></div>

                <SignedOut>
                  <div className="flex flex-col gap-3">
                    <Link to="/sign-in">
                      <Button className="w-full" variant="outline">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/sign-up">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="flex items-center gap-2 mt-2">
                    <UserButton />
                    <span className="font-medium">My Account</span>
                  </div>
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
