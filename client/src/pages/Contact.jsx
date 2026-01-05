import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <div className="min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-lg">
            Have questions about the future of travel? Our AI agents and human
            experts are ready to assist you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            {/* Info Cards */}
            <div className="grid gap-6">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Visit Us</h3>
                  <p className="text-muted-foreground">
                    123 Future Tech Boulevard,
                    <br />
                    Silicon Valley, CA 94025
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Call Us</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  <p className="text-muted-foreground">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Email Us</h3>
                  <p className="text-muted-foreground">hello@orrio.com</p>
                  <p className="text-muted-foreground">support@orrio.com</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-bold text-xl mb-4">Follow Our Journey</h3>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="p-8 rounded-3xl bg-card border border-border shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="How can we help you?"
                  className="min-h-[150px]"
                />
              </div>
              <Button className="w-full h-12 text-lg">
                Send Message <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-[400px] bg-muted rounded-3xl mb-20 flex items-center justify-center border border-border overflow-hidden relative">
          <div className="absolute inset-0 bg-gray-900 opacity-20"></div>
          <p className="text-muted-foreground flex items-center gap-2 z-10">
            <MapPin className="w-5 h-5" /> Interactive Map Loading...
          </p>
          {/* Real Map embed code goes here */}
        </div>

        {/* --- BRANDING FOOTER SECTION --- */}
        <div className="py-20 flex justify-center items-center opacity-10 select-none pointer-events-none">
          <h1 className="text-[15vw] font-black leading-none bg-gradient-to-b from-foreground to-transparent bg-clip-text text-transparent uppercase tracking-tighter">
            ORRIO
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Contact;
