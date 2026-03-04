import React from "react";
import { ShieldCheck, Search, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <Search className="text-[#d81159]" size={24} />,
    title: "Editorial Research",
    desc: "We analyze hundreds of data points and user feedback to recommend products that truly deliver performance.",
  },
  {
    icon: <ShieldCheck className="text-[#d81159]" size={24} />,
    title: "Independent Picks",
    desc: "Our selections are 100% independent. We focus on quality and value rather than brand sponsorships.",
  },
  {
    icon: <BarChart3 className="text-[#d81159]" size={24} />,
    title: "Smart Tracking",
    desc: "Our team monitors price trends on Amazon to ensure you find the best value for your specific budget.",
  },
];

const WhyZLinksHub = () => {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header - Bold but not heavy */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Why <span className="text-[#d81159]">ZLinksHub?</span>
          </h2>
          <p className="text-gray-600 text-base font-normal mt-2 max-w-2xl">
            A transparent approach to product recommendations and detailed
            shopping guides for the modern consumer.
          </p>
        </div>

        {/* Feature Grid - Clean readable text sizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {features.map((item, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all bg-white shadow-sm shadow-gray-50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#d81159]/5 flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer Box - High readability, no small print */}
        <div className="mt-12 p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-900 shrink-0 md:pt-0.5">
              Transparency
            </span>
            <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed font-normal">
              **ZLinksHub** is a participant in the Amazon Services LLC
              Associates Program. This means we may earn a commission from
              qualifying purchases at no extra cost to you. We only recommend
              products we believe add value to our readers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyZLinksHub;
