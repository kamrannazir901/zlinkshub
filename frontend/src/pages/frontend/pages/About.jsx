import React from "react";
import { ShieldCheck, Zap, Globe, Heart, CheckCircle2 } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 text-[#d81159] font-bold text-sm uppercase tracking-[0.2em] mb-4">
            <Globe size={18} />
            <span>Our Origin Story</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-8">
            We bridge the gap between{" "}
            <span className="text-[#d81159]">clutter</span> and{" "}
            <span className="text-[#d81159]">quality.</span>
          </h1>
          <p className="text-gray-600 text-xl leading-relaxed font-medium">
            ZLinksHub was founded on a simple realization: the internet doesn't
            need more products; it needs better filters. We spend the hours
            researching so you only spend minutes deciding.
          </p>
        </div>

        {/* Stats / Pillars Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <ShieldCheck className="text-[#d81159]" size={32} />,
              title: "Vetted Selection",
              desc: "Every link on our platform is hand-selected based on performance, reviews, and value.",
            },
            {
              icon: <Zap className="text-[#d81159]" size={32} />,
              title: "Data Driven",
              desc: "We analyze historical pricing and spec sheets to ensure you get the best deal available.",
            },
            {
              icon: <Heart className="text-[#d81159]" size={32} />,
              title: "User Centric",
              desc: "Our recommendations are never bought. We prioritize the buyer's experience above all else.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-[32px] p-10 border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all"
            >
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* The "How We Work" Section */}
        <div className="bg-gray-900 rounded-[48px] overflow-hidden text-white mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 md:p-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                Our Editorial <br />
                <span className="text-[#d81159]">Integrity</span>
              </h2>
              <div className="space-y-6">
                {[
                  "We only recommend products we would use ourselves.",
                  "Affiliate links do not influence our rankings.",
                  "We update our 'Latest Deals' daily to reflect stock changes.",
                  "Transparent disclosure is at the core of every page.",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2
                      className="text-[#d81159] mt-1 shrink-0"
                      size={20}
                    />
                    <p className="text-gray-300 text-lg">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] lg:h-auto bg-gray-800">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000"
                alt="Our Team"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to find your next favorite thing?
          </h2>
          <p className="text-gray-500 text-lg mb-10 font-medium">
            Join thousands of users who trust ZLinksHub for their technology and
            lifestyle upgrades.
          </p>
          <a
            href="/products"
            className="inline-block bg-[#d81159] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-[#d81159]/20"
          >
            Explore All Recommendations
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
