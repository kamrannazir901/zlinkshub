import React, { useEffect, useState } from "react";
import { ArrowRight, Clock, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllGuides } from "../../../services/guideService";

const GuidesSection = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLatestGuides = async () => {
      try {
        setLoading(true);
        const res = await fetchAllGuides(3);
        setGuides(res.data || []);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    getLatestGuides();
  }, []);

  // Helper to ensure headings don't ruin the short description
  const renderPreview = (htmlContent) => {
    const plainText =
      new DOMParser().parseFromString(htmlContent, "text/html").body
        .textContent || "";
    return plainText.length > 160
      ? plainText.substring(0, 160) + "..."
      : plainText;
  };

  if (loading) return null; // Or your skeleton loader

  return (
    <section className="py-10 md:py-16 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header - Consistent Styling */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              ZLinksHub <span className="text-[#d81159]">Guides</span>
            </h2>
            <p className="text-gray-600 text-base font-normal mt-2">
              Expert research and buying advice to help you shop smarter.
            </p>
          </div>
          <Link
            to="/guides"
            className="flex items-center gap-2 text-sm font-semibold text-[#d81159] hover:underline group"
          >
            View All Guides{" "}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {guides.length > 0 && (
            <>
              {/* Featured Guide - Uses /slug */}
              <div className="lg:col-span-7">
                <Link
                  to={`/guides/${guides[0].slug}`}
                  className="group block h-full p-8 md:p-10 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6 text-sm font-medium text-gray-500 uppercase tracking-wide">
                    <span className="text-[#d81159]">{guides[0].category}</span>
                    <span className="flex items-center gap-1.5 font-normal">
                      <Clock size={16} /> {guides[0].readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#d81159] transition-colors leading-tight">
                    {guides[0].title}
                  </h3>
                  {/* Preview uses the cleaner to ignore <h2> tags */}
                  <p className="text-gray-600 text-base font-normal mb-8 line-clamp-3 leading-relaxed">
                    {renderPreview(guides[0].content)}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 border-b-2 border-[#d81159] pb-0.5">
                    Read Full Research <ChevronRight size={14} />
                  </div>
                </Link>
              </div>

              {/* Sidebar Guides - Uses /slug */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {guides.slice(1).map((guide) => (
                  <Link
                    key={guide._id}
                    to={`/guides/${guide.slug}`}
                    className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-[#d81159]/20 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3 text-[12px] font-medium text-gray-500 uppercase tracking-widest">
                      <span className="text-[#d81159]">{guide.category}</span>
                      <span className="flex items-center gap-1 font-normal uppercase">
                        <BookOpen size={14} /> {guide.readTime}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#d81159] transition-colors leading-snug">
                      {guide.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;
