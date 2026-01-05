import { CheckCircle2, Cpu, Globe, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <Badge className="mb-4" variant="outline">
            Since 2025
          </Badge>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
            Redefining Travel with{" "}
            <span className="text-primary">Artificial Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Orrio is not just a booking platform; it's your personal AI travel
            companion. We merge cutting-edge technology with human hospitality
            to create seamless, personalized, and futuristic travel experiences.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative h-[500px] rounded-3xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000"
              alt="Our Team"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground text-lg">
              We believe that travel should be effortless. By leveraging the
              power of data and AI, we eliminate the stress of planning and
              booking, allowing you to focus on what matters most: experiencing
              the world.
            </p>
            <div className="space-y-4 pt-4">
              {[
                "AI-Driven Personalization",
                "Sustainable Travel Options",
                "Global Luxury Network",
                "24/7 Smart Support",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="font-medium text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu className="w-10 h-10" />,
                title: "Smart Itineraries",
                desc: "Our AI analyzes your preferences to build the perfect day-by-day travel plan instantly.",
              },
              {
                icon: <Globe className="w-10 h-10" />,
                title: "Global Booking",
                desc: "Access to over 1 million hotels, resorts, and futuristic stays across 190+ countries.",
              },
              {
                icon: <ShieldCheck className="w-10 h-10" />,
                title: "Secure & Safe",
                desc: "Bank-grade security for your payments and 24/7 emergency support wherever you are.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
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

export default About;
