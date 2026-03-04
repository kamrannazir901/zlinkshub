import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Share2,
  Bookmark,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { fetchGuideBySlug } from "../../../services/guideService";

const SingleGuidePage = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadGuide = async () => {
      try {
        setLoading(true);
        const res = await fetchGuideBySlug(slug);
        setGuide(res.data || res);
      } catch (err) {
        console.error("Guide Fetch Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadGuide();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-10 h-10 text-[#d81159] animate-spin" />
        <p className="text-[13px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Syncing Content...
        </p>
      </div>
    );

  if (error || !guide)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center bg-white">
        <AlertCircle size={60} className="text-gray-200" />
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
          Article Not Found
        </h2>
        <Link
          to="/guides"
          className="bg-black text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-[#d81159] transition-all"
        >
          Return to Library
        </Link>
      </div>
    );

  return (
    <article className="min-h-screen bg-white pb-24">
      {/* 1. Sticky Top Navigation */}
      <div className="pt-24 pb-6 px-4 md:px-6 max-w-4xl mx-auto">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d81159] transition-all text-[11px] font-black uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} /> Back to Library
        </Link>
      </div>

      {/* 2. Article Header */}
      <header className="max-w-4xl mx-auto px-4 md:px-6 mb-12">
        <div className="flex items-center gap-3 mb-8">
          <span className="bg-[#d81159] text-white text-xs uppercase tracking-widest px-3 py-1 rounded-md">
            {guide.category}
          </span>
          <span className="flex items-center gap-1.5 text-gray-400 text-xs uppercase">
            <Clock size={12} className="text-[#d81159]" />{" "}
            {guide.readTime || "5 Min Read"}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-10">
          {guide.title}
        </h1>

        {/* Meta Info Bar - Forced Horizontal and Compact on all screens */}
        <div className="flex flex-row items-center justify-between py-4 border-y border-gray-100 gap-2">
          <div className="flex items-center gap-3">
            {/* Smaller Z Logo */}
            <div className="w-9 h-9 min-w-[36px] rounded-full bg-gray-900 flex items-center justify-center text-white font-black text-sm border-2 border-gray-50">
              Z
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-900 tracking-tight leading-none">
                ZLinksHub Editorial
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1 mt-1">
                <Calendar size={10} />{" "}
                {new Date(
                  guide.updatedAt || guide.createdAt,
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all text-[11px] font-bold text-gray-600 active:scale-95"
            >
              <Share2 size={12} />{" "}
              <span className="hidden xs:inline">Share</span>
            </button>
            <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all text-gray-600">
              <Bookmark size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Content Area with Custom Scoped CSS */}
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div
          className="guide-content-wrapper"
          dangerouslySetInnerHTML={{
            __html: guide.content || guide.description,
          }}
        />
      </div>

      {/* 4. Global Scoped Styles for CKEditor Output */}
      <style>{`
        .guide-content-wrapper {
          color: #374151;
          font-size: 18px;
          line-height: 1.8;
        }
        
        /* Headings */
        .guide-content-wrapper h2 {
          font-size: 2rem;
          font-weight: 900;
          color: #111827;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }

        .guide-content-wrapper h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        /* Paragraphs & Spacing */
        .guide-content-wrapper p {
          margin-bottom: 1.5rem;
        }

        .guide-content-wrapper strong {
          color: #111827;
          font-weight: 700;
        }

        /* Lists */
        .guide-content-wrapper ul, .guide-content-wrapper ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .guide-content-wrapper ul { list-style-type: disc; }
        .guide-content-wrapper ol { list-style-type: decimal; }

        .guide-content-wrapper li {
          margin-bottom: 0.5rem;
        }

        /* Tables (Critical for your reviews) */
        .guide-content-wrapper table {
          width: 100%;
          border-collapse: collapse;
          margin: 2.5rem 0;
          font-size: 16px;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid #f3f4f6;
        }

        .guide-content-wrapper table th {
          background-color: #f9fafb;
          font-weight: 800;
          text-align: left;
          padding: 12px 16px;
          border-bottom: 2px solid #f3f4f6;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.05em;
        }

        .guide-content-wrapper table td {
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .guide-content-wrapper table tr:last-child td {
          border-bottom: none;
        }

        /* Links */
        .guide-content-wrapper a,.guide-content-wrapper a strong {
          color: #d81159 !important;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .guide-content-wrapper a:hover {
          border-bottom-color: #d81159;
        }

        /* Blockquotes */
        .guide-content-wrapper blockquote {
          border-left: 4px solid #d81159;
          background: #fff5f8;
          padding: 1.5rem 2rem;
          margin: 2rem 0;
          border-radius: 0 1.5rem 1.5rem 0;
          font-style: italic;
          color: #4b5563;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .guide-content-wrapper { font-size: 17px; }
          .guide-content-wrapper h2 { font-size: 1.5rem; }
          .guide-content-wrapper table { font-size: 14px; }
        }
      `}</style>
    </article>
  );
};

export default SingleGuidePage;
