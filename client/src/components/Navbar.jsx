import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Menu, Moon, Sun, DollarSign } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";

// Context
import { useCurrency } from "@/context/CurrencyContext";

const Navbar = () => {
  const { user } = useUser();
  const { setTheme, theme } = useTheme();

  // Currency Context
  const { currency, setCurrency } = useCurrency();

  const location = useLocation();

  // --- 1. Admin Check Logic ---
  const isAdmin = user?.publicMetadata?.role === "admin";

  // --- 2. Base Navigation Links ---
  const baseLinks = [
    { name: "Home", path: "/" },
    { name: "Find Hotels", path: "/find-hotels" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // --- 3. Dynamic Links Generator (Admin vs User Logic) ---
  const getNavLinks = () => {
    const links = [...baseLinks];
    if (user) {
      if (isAdmin) {
        // Admin නම් Admin Dashboard පෙන්වන්න
        links.push({
          name: "Admin Dashboard",
          path: "/admin/dashboard",
          active: true,
        });
      } else {
        // User නම් My Dashboard පෙන්වන්න
        links.push({
          name: "My Dashboard",
          path: "/dashboard",
          active: true,
        });
      }
    }
    return links;
  };

  const finalLinks = getNavLinks();

  // --- Currency Toggle Logic ---
  const toggleCurrency = () => {
    setCurrency(currency === "USD" ? "LKR" : "USD");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full transition-all duration-300 border-b shadow-sm border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-20 px-4 mx-auto md:px-8">
        {/* --- LOGO SECTION --- */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-10 h-10 transition-all shadow-lg bg-gradient-to-tr from-primary to-blue-600 rounded-xl group-hover:shadow-primary/50">
            <span className="text-xl font-bold text-white">O</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-transparent bg-gradient-to-r from-primary to-blue-400 bg-clip-text">
            Orrio
          </span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="items-center hidden gap-8 md:flex">
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

        {/* --- RIGHT SECTION (Currency, Theme, Auth) --- */}
        <div className="items-center hidden gap-4 md:flex">
          {/* Currency Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCurrency}
            className="gap-1 text-xs font-bold border border-white/10 hover:bg-white/10"
          >
            <DollarSign className="w-3 h-3" />
            {currency}
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative rounded-full"
          >
            <Sun className="w-5 h-5 text-orange-500 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-5 h-5 text-blue-400 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Auth Logic */}
          <SignedOut>
            <div className="flex gap-2">
              <Link to="/sign-in">
                <Button variant="ghost" className="hover:bg-primary/10">
                  Log In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button className="px-6 text-white transition-opacity rounded-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium lg:block">
                Hi, {user?.firstName}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>

        {/* --- MOBILE MENU (Hamburger) --- */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Currency (Optional) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCurrency}
            className="gap-1 mr-1 text-xs font-bold border border-white/10"
          >
            {currency}
          </Button>

          {/* Mobile Theme Toggle */}
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
                      <Button className="w-full text-white bg-primary">
                        Sign Up
                      </Button>
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
