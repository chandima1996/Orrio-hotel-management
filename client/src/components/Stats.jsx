import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Building2, Star } from "lucide-react";

// --- Single Stat Card Component ---
const StatCard = ({ item }) => {
  const ref = useRef(null);
  // මෙම කොටස screen එකට ආවද කියලා බලනවා (margin: -100px කියන්නේ screen එකට හොඳටම ආවම trigger වෙන්න)
  const isInView = useInView(ref, { margin: "-100px", once: false });
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(item.value.substring(0, 3)); // "15k+" වලින් 15 ගන්නවා (Sample logic)
    // ඇත්තටම අපිට අංකය විතරක් animation එකට ඕන නිසා අපි පොඩි parsing එකක් කරනවා:
    // සරලව: 0 සිට target අගය දක්වා loop එකක්

    // Animation Duration & Logic
    let duration = 2000; // 2 seconds
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      // Calculate current number based on progress
      const percentage = Math.min(progress / duration, 1);
      const currentVal = Math.floor(percentage * item.targetNumber);

      setCount(currentVal);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isInView) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      // View එකෙන් එලියට ගියාම ආයේ 0 ට reset කරනවා (Re-triggering effect)
      setCount(0);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, item.targetNumber]);

  return (
    <div
      ref={ref}
      className="relative h-[400px] group overflow-hidden flex items-center justify-center"
    >
      {/* 1. Background Image with Zoom Effect */}
      <div className="absolute inset-0 bg-black">
        <img
          src={item.image}
          alt={item.label}
          className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
      </div>

      {/* 2. Content */}
      <div className="relative z-10 text-center p-6 border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl w-3/4 transform transition-all duration-500 hover:-translate-y-2">
        <div className="mb-4 flex justify-center">
          <div className="p-3 bg-primary/20 rounded-full text-primary ring-1 ring-primary/50">
            {item.icon}
          </div>
        </div>

        <h3 className="text-5xl md:text-6xl font-extrabold text-white mb-2 font-sans tracking-tight">
          {count}
          {item.suffix}
        </h3>

        <p className="text-lg text-gray-300 font-medium tracking-wide uppercase">
          {item.label}
        </p>
      </div>
    </div>
  );
};

// --- Main Stats Section ---
const Stats = () => {
  const statsData = [
    {
      id: 1,
      label: "Happy Guests",
      targetNumber: 150, // Animation එක 0 - 150 දක්වා යයි
      suffix: "k+",
      value: "150k+",
      icon: <Users className="w-8 h-8" />,
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 2,
      label: "Luxury Hotels",
      targetNumber: 85,
      suffix: "+",
      value: "85+",
      icon: <Building2 className="w-8 h-8" />,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 3,
      label: "User Ratings",
      targetNumber: 4,
      suffix: ".9", // මෙතන 4 වෙනකම් count වෙලා .9 අගට එකතු වෙනවා
      value: "4.9",
      icon: <Star className="w-8 h-8" />,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 w-full bg-black">
      {statsData.map((item) => (
        <StatCard key={item.id} item={item} />
      ))}
    </section>
  );
};

export default Stats;
