import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { generateLink, getUserLinks } from "../../../services/linkService";

const Dashboard = () => {
  const [newlyGenerated, setNewlyGenerated] = useState(null); // Separate state for the "latest" link
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
      setNewlyGenerated(null); // Reset previous result while loading

      const res = await generateLink({ amazonUrl: data.amazonUrl });

      setNewlyGenerated(res.data); // Store the specific new link
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
    <div className="max-w-2xl mx-auto px-4 py-16 bg-[#F9FAFB] min-h-screen">
      {/* 1. COMPACT GENERATOR */}
      <section className="mb-6">
        <h1 className="mb-1 ">Link Generator</h1>
        <p className="text-xs text-gray-500 mb-6">
          Convert Amazon URLs to branded pages.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            {...register("amazonUrl", { required: true })}
            placeholder="Paste Amazon link..."
            className="w-full p-4 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Generate Link"}
          </button>
        </form>
        {apiError && (
          <p className="text-red-500 text-[10px] mt-2 font-bold uppercase">
            {apiError}
          </p>
        )}
      </section>

      {/* 2. NEWLY GENERATED CARD (Quick Access for Admin) */}
      {newlyGenerated && (
        <section className="mb-10 animate-in fade-in slide-in-from-top duration-500">
          <div className="bg-white p-5 rounded-4xl border-2 border-primary shadow-xl ring-4 ring-black/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-2xl border border-gray-100 p-2">
                <img
                  src={newlyGenerated.productData?.image}
                  className="w-full h-full object-contain mix-blend-multiply"
                  alt="new product"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm  text-black leading-tight mb-1 truncate">
                  {newlyGenerated.productData?.title}
                </h4>
                <p className="text-lg  text-primary">
                  {newlyGenerated.productData?.price}
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  {newlyGenerated.marketplace}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCopy(newlyGenerated._id)}
              className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                copiedId === newlyGenerated._id
                  ? "bg-green-800 text-white"
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

      {/* 3. RECENT ACTIVITY */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs  text-gray-600 uppercase tracking-widest">
            Recent Activity
          </h3>
          <button onClick={fetchHistory} className="text-xs text-gray-600">
            REFRESH
          </button>
        </div>

        <div className="space-y-3 opacity-80">
          {recentLinks.map((link) => (
            <div
              key={link._id}
              className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-50">
                <img
                  src={link.productData?.image}
                  className="w-full h-full object-contain mix-blend-multiply"
                  alt="thumb"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-black truncate pr-2">
                  {link.productData?.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[9px]  text-[#FF9900]">
                    {link.productData?.price}
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase">
                    {link.marketplace?.replace("www.", "")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopy(link._id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-[9px]  uppercase transition-all ${
                  copiedId === link._id
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-black"
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
