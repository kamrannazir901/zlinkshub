import React from "react";
import { ArrowUpRight, Monitor, Coffee, Gamepad2, Sofa } from "lucide-react";

const CATEGORY_LINKS = [
  {
    id: 1,
    name: "Electronics",
    description:
      "Explore the latest in tech, from audio gear to mobile essentials.",
    icon: <Monitor size={24} />,
    amazonUrl:
      "https://www.amazon.com/electronics-store/b?ie=UTF8&node=172282&tag=abidsaab09-20",
    color: "bg-blue-50",
  },
  {
    id: 2,
    name: "Home & Kitchen",
    description:
      "Upgrade your living space with premium kitchenware and decor.",
    icon: <Coffee size={24} />,
    amazonUrl:
      "https://www.amazon.com/home-garden-kitchen-furniture-bedding/b?ie=UTF8&node=1055398&tag=abidsaab09-20",
    color: "bg-orange-50",
  },
  {
    id: 3,
    name: "Video Games",
    description:
      "Hardware, accessories, and the latest titles for every platform.",
    icon: <Gamepad2 size={24} />,
    amazonUrl:
      "https://www.amazon.com/computer-video-games-hardware-accessories/b?ie=UTF8&node=468642&tag=abidsaab09-20",
    color: "bg-purple-50",
  },
  {
    id: 4,
    name: "Furniture",
    description: "Modern furniture for your office, bedroom, and living room.",
    icon: <Sofa size={24} />,
    amazonUrl:
      "https://www.amazon.com/Furniture/b?ie=UTF8&node=1063306&tag=abidsaab09-20",
    color: "bg-emerald-50",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-10 md:py-16 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header - Consistent with Products/Guides */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              Browse by <span className="text-[#d81159]">Category</span>
            </h2>
            <p className="text-gray-600 text-base font-normal mt-2">
              Carefully curated collections tailored for your workspace and
              lifestyle.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {CATEGORY_LINKS.map((cat) => (
            <a
              key={cat.id}
              href={cat.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:border-[#d81159]/20 hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 relative overflow-hidden"
            >
              {/* Animated Background Accent */}
              <div
                className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${cat.color} opacity-40 group-hover:scale-[3] transition-transform duration-700 ease-in-out`}
              />

              <div className="relative z-10">
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#d81159] group-hover:text-white group-hover:rotate-[10deg] transition-all duration-300 mb-8">
                  {cat.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#d81159] transition-colors mb-3">
                  {cat.name}
                </h3>

                <p className="text-[14px] leading-relaxed text-gray-500 font-medium mb-8">
                  {cat.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] font-black text-gray-900 uppercase tracking-widest group-hover:gap-3 transition-all">
                  Shop Category{" "}
                  <ArrowUpRight size={16} className="text-[#d81159]" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
