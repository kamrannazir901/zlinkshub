import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { generateLink, getUserLinks } from "../../../services/linkService";

const Dashboard = () => {
  const [newlyGenerated, setNewlyGenerated] = useState(null);
  const [recentLinks, setRecentLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getUserLinks();
      setRecentLinks(res.data || []);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");
      setNewlyGenerated(null);

      const res = await generateLink({ amazonUrl: data.amazonUrl });

      setNewlyGenerated(res.data);
      reset();
      fetchHistory();
    } catch (err) {
      setApiError(err.response?.data?.message || "Amazon API Error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (linkId) => {
    const fullLink = `${window.location.origin}/product/${linkId}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedId(linkId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 min-h-screen">
      {/* 1. COMPACT GENERATOR */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Link Generator</h1>
        <p className="text-sm text-gray-500 mb-6">
          Convert Amazon URLs to branded pages.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("amazonUrl", { required: true })}
            placeholder="Paste Amazon link..."
            className="w-full p-4 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 transition-all"
          >
            {loading ? "Processing..." : "Generate Link"}
          </button>
        </form>
        {apiError && (
          <p className="text-red-500 text-sm mt-3 font-medium">{apiError}</p>
        )}
      </section>

      {/* 2. NEWLY GENERATED CARD (SHOWS CATEGORY) */}
      {newlyGenerated && (
        <section className="mb-10 animate-in fade-in slide-in-from-top duration-500">
          <div className="bg-white p-6 rounded-[2.5rem] border-2 border-primary shadow-xl">
            {/* Category Badge - Only shown here */}
            <div className="mb-4">
              <span className="bg-primary/10 text-primary text-sm  px-3 py-1 rounded-full uppercase ">
                {newlyGenerated.productData?.category || "General"}
              </span>
            </div>

            <div className="flex items-center gap-5 mb-6">
              <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-2xl border border-gray-100 p-2">
                <img
                  src={newlyGenerated.productData?.image}
                  className="w-full h-full object-contain mix-blend-multiply"
                  alt="new product"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-black leading-snug mb-2 line-clamp-2">
                  {newlyGenerated.productData?.title}
                </h4>
                <p className="text-xl font-bold text-primary mb-1">
                  {newlyGenerated.productData?.price}
                </p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">
                  {newlyGenerated.marketplace}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCopy(newlyGenerated._id)}
              className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider ${
                copiedId === newlyGenerated._id
                  ? "bg-green-700 text-white"
                  : "bg-primary text-white shadow-lg"
              }`}
            >
              {copiedId === newlyGenerated._id ? (
                <>✓ Copied for Customer</>
              ) : (
                <>Copy Branded Link</>
              )}
            </button>
          </div>
        </section>
      )}

      {/* 3. RECENT ACTIVITY (CLEAN LIST - NO CATEGORY) */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-widest">
            Recent Activity
          </h3>
          <button
            onClick={fetchHistory}
            className="text-sm text-gray-400 hover:text-black transition-colors"
          >
            REFRESH
          </button>
        </div>

        <div className="space-y-4">
          {recentLinks.map((link) => (
            <div
              key={link._id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-50 p-1">
                <img
                  src={link.productData?.image}
                  className="w-full h-full object-contain mix-blend-multiply"
                  alt="thumb"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-black truncate pr-4 mb-1">
                  {link.productData?.title}
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary">
                    {link.productData?.price}
                  </span>
                  <span className="text-sm text-gray-400 uppercase">
                    {link.marketplace?.replace("www.", "")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopy(link._id)}
                className={`shrink-0 px-5 py-2 rounded-xl text-sm font-bold uppercase transition-all ${
                  copiedId === link._id
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {copiedId === link._id ? "✓" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
