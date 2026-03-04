import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  ChevronRight,
  GraduationCap,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { fetchAllGuides } from "../../../services/guideService";

const GuidesPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        setLoading(true);
        const res = await fetchAllGuides();
        setGuides(res.data || res);
      } catch (err) {
        console.error("Failed to fetch guides:", err);
        setError(
          "Unable to load the educational library. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadGuides();
  }, []);

  // Helper function to strip HTML tags for the card excerpt
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, ""); // Removes all HTML tags
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-white">
        <div className="w-12 h-12 border-4 border-[#d81159] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[13px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Accessing Archive
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center bg-white">
        <AlertCircle size={60} className="text-gray-200" />
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
          Library Offline
        </h2>
        <p className="text-gray-500 font-medium max-w-md leading-relaxed">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-black text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#d81159] transition-all"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="max-w-3xl mb-24">
          <div className="flex items-center gap-2 text-[#d81159] font-black text-[11px] uppercase tracking-[0.25em] mb-6">
            <GraduationCap size={16} strokeWidth={3} />
            <span>Buyer's Education</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.95]">
            Expert <span className="text-[#d81159]">Buying Guides</span>
          </h1>
          <p className="text-gray-500 text-xl md:text-2xl leading-relaxed font-medium tracking-tight">
            No fluff. No filler. Research-backed deep dives into gear that helps
            you work, play, and live better.
          </p>
        </div>

        {/* Guides Grid */}
        {guides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {guides.map((guide) => (
              <Link
                key={guide._id || guide.id}
                to={`/guides/${guide.slug}`}
                className="group flex flex-col h-full bg-white border border-gray-100 rounded-[3rem] p-10 transition-all duration-500 hover:border-[#d81159]/20 hover:shadow-[0_30px_60px_-15px_rgba(216,17,89,0.12)] hover:-translate-y-3"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="bg-primary text-white px-4 py-1.5 rounded-xl text-[12px] text-xs tracking-widest border border-gray-100 group-hover:bg-[#d81159] group-hover:text-white group-hover:border-[#d81159] transition-all">
                    {guide.category}
                  </div>
                  <div className="text-gray-400 text-[11px] flex items-center gap-1.5 uppercase ">
                    <Clock size={14} className="text-[#d81159]" />{" "}
                    {guide.readTime || "5 min read"}
                  </div>
                </div>

                <div className="mb-8 text-gray-100 group-hover:text-[#d81159]/10 transition-colors">
                  <BookOpen size={48} strokeWidth={1} />
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-5 group-hover:text-[#d81159] transition-colors leading-tight tracking-tight">
                  {guide.title}
                </h3>

                <p className="text-gray-500 text-[15px] line-clamp-3 mb-10 leading-relaxed font-medium">
                  {guide.excerpt ||
                    stripHtml(guide.content || guide.description).substring(
                      0,
                      140,
                    ) + "..."}
                </p>

                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-gray-900 font-black text-xs uppercase tracking-widest">
                    Explore Guide
                  </span>
                  <div className="bg-gray-900 text-white p-2.5 rounded-2xl group-hover:bg-[#d81159] transition-all shadow-lg group-hover:shadow-[#d81159]/40 group-hover:rotate-[-10deg]">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-black text-sm uppercase tracking-[0.4em]">
              The library is currently empty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidesPage;
