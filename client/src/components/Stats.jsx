import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { Users, Building2, Star, Globe } from "lucide-react";

// --- Single Stat Card Component ---
const StatCard = ({ item }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50px", once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const end = item.targetNumber;
    let duration = 2000;
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const currentVal = Math.floor(percentage * end);

      setCount(currentVal);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, item.targetNumber]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center p-8 overflow-hidden text-center transition-transform duration-300 border rounded-2xl group border-white/10 hover:-translate-y-2"
    >
      {/* --- Background Image Layer --- */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-500 bg-center bg-cover group-hover:scale-110"
        style={{
          backgroundImage: `url(${item.image})`, // පින්තූරය මෙතැනින් load වේ
          filter: "brightness(0.5)", // පින්තූරය අඳුරු කිරීමට (Text පැහැදිලිව පෙනෙන්න)
        }}
      />

      {/* --- Content Layer (Z-Index 10) --- */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="p-3 mb-4 transition-colors rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white">
          {item.icon}
        </div>

        <div className="space-y-1">
          <h3 className="text-4xl font-extrabold text-white sm:text-5xl">
            {count}
            <span className="transition-colors text-primary group-hover:text-white">
              {item.suffix}
            </span>
          </h3>

          <p className="text-sm font-medium tracking-wider text-gray-200 uppercase sm:text-base">
            {item.label}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Stats Section ---
const Stats = () => {
  // Data with Images (ඔබට අවශ්‍ය පින්තූර URLs මෙතැනට දාන්න)
  const statsData = [
    {
      id: 1,
      label: "Happy Guests",
      targetNumber: 150,
      suffix: "k+",
      icon: <Users className="w-8 h-8" />,
      // උදාහරණ පින්තූර: Unsplash (ඔබේ පින්තූර වලින් replace කරන්න)
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      label: "Luxury Hotels",
      targetNumber: 85,
      suffix: "+",
      icon: <Building2 className="w-8 h-8" />,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      label: "Cities",
      targetNumber: 20,
      suffix: "+",
      icon: <Globe className="w-8 h-8" />,
      image:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      label: "Ratings",
      targetNumber: 4,
      suffix: ".9",
      icon: <Star className="w-8 h-8" />,
      image:
        "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="py-16 bg-gray-900 border-t border-white/10">
      <div className="container px-4 mx-auto md:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Our Numbers Speak
          </h2>
          <p className="mt-2 text-gray-400">
            Trusted by thousands of travelers around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
