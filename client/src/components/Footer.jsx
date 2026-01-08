import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="relative pt-20 pb-10 overflow-hidden transition-colors duration-300 border-t bg-background text-foreground border-border">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      {/* UPDATED CONTAINER: 
          Navbar එකට සමානව 'md:px-8' එකතු කරන ලදී. 
          දැන් වම් සහ දකුණු මායිම් (Margins) Navbar සහ Stats සමග සමාන වේ.
      */}
      <div className="container relative z-10 px-4 mx-auto md:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-2 lg:grid-cols-4">
          {/* 1. Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 text-white shadow-lg bg-gradient-to-tr from-primary to-blue-600 rounded-xl">
                <span className="text-xl font-bold">O</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary">
                Orrio
              </span>
            </Link>
            <p className="leading-relaxed text-muted-foreground">
              Experience luxury and comfort in the heart of the city. Your
              perfect stay awaits with premium amenities and service.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>123 Hotel Avenue, Colombo 07</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Phone className="w-4 h-4 text-primary" />
              <span>+94 11 234 5678</span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Find Hotels", path: "/find-hotels" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Privacy Policy", path: "/privacy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="transition-colors text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Support */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Support</h3>
            <ul className="space-y-3">
              {[
                "FAQ",
                "Help Center",
                "Terms of Service",
                "Cancellation Policy",
                "Partner with us",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="transition-colors text-muted-foreground hover:text-primary"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Newsletter</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 text-sm transition-all border rounded-lg bg-muted/50 border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                />
                <Mail className="absolute w-4 h-4 top-3 right-3 text-muted-foreground" />
              </div>
              <Button className="w-full text-white bg-primary hover:bg-blue-600">
                Subscribe <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-[1px] bg-border w-full mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Orrio Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
