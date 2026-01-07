import { Flame } from "lucide-react";
import WhyChoose1 from "../../assets/whychoose1.png";
import WhyChoose2 from "../../assets/whychoose2.png";
import WhyChoose3 from "../../assets/whychoose3.png";
import WhyChoose4 from "../../assets/whychoose4.png";
import theme from "../../lib/theme";
import {CheckCircle} from "lucide-react";
import AnimatedNumber from "../../Components/AnimatedNumber";

const cards = [
  {
    value: <AnimatedNumber value={100} suffix="+" />,
    label: "Happy Customers",
    img: WhyChoose1,
  },
  {
    value: <AnimatedNumber value={150} suffix="+" />,
    label: "Premium products",
    img: WhyChoose2,
  },
  {
    value: <AnimatedNumber value={98} suffix="%" />,
    label: "Repeat & Returning Buyers",
    img: WhyChoose3,
  },
  {
    value: "Freshly Packed",
    label: "Aroma Preserved",
    img: WhyChoose4,
  },
];


export default function WhyChooseUs() {
  return (
    <section className="w-full py-8 sm:py-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2">
        <CheckCircle size={40} className="inline-block ml-2 text-green-800 font-bold animate-pulse bg-green-200 rounded-full p-1" />

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-center mb-4">
          <span>Why C</span>
          <span
            className="border-b-4 pb-1"
            style={{ borderColor: theme.colors.accent.primary }}
          >
            hoos
          </span>
          <span>e Us</span>
        </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 sm:mt-10">
          {cards.map((item, index) => (
            <div
              key={index}
              className="relative rounded-3xl overflow-hidden group shadow-2xl h-[350px] sm:h-[400px] md:h-[450px] lg:h-[400px]"
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 w-full">
                <div className="w-full bg-black/40 backdrop-blur-sm px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between rounded-b-3xl">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1">
                      {item.value}
                    </div>
                    <div className="text-xs sm:text-sm text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] line-clamp-2">
                      {item.label}
                    </div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg shrink-0 border-2 border-white/30" style={{ backgroundColor: theme.colors.accent.primary }}>
                    <Flame size={16} className="text-white sm:w-5 sm:h-5 drop-shadow-md" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
