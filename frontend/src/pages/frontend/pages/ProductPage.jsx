import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicLink } from "../../../services/linkService";

const ProductPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false); // Toggle for description

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getPublicLink(id);
        const productInfo = res.data.data;
        if (productInfo) {
          setData(productInfo);
          document.title = productInfo.productData?.title || "Product Details";
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white italic text-gray-400 animate-pulse uppercase tracking-widest text-xs font-bold">
        Loading Product...
      </div>
    );

  if (error || !data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center px-4">
        <h1 className="text-xl font-black uppercase tracking-tighter">
          Product Not Found
        </h1>
      </div>
    );

  const { productData, affiliateUrl, marketplace } = data;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center py-6 md:py-12 px-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-4xl md:rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* IMAGE: Reduced height on mobile */}
          <div className="bg-[#FBFBFB] p-6 md:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-50">
            <div className="w-full flex justify-center">
              <img
                src={productData?.image}
                alt={productData?.title}
                className="w-auto h-55 md:h-87.5 object-contain transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 md:p-12 flex flex-col justify-center">
            {/* BADGE */}
            <div className="mb-4">
              <span className="bg-black text-white text-[10px] px-2 py-1 rounded-md uppercase tracking-widest">
                {marketplace?.replace("www.", "")}
              </span>
            </div>

            {/* TITLE: Slightly smaller for mobile */}
            <h1 className="text-lg md:text-xl font-black text-black leading-tight mb-3">
              {productData?.title}
            </h1>

            {/* PRICE */}
            <div className="mb-6">
              <p className="text-3xl md:text-4xl font-black text-primary tracking-tighter">
                {productData?.price}
              </p>
            </div>

            {/* DESCRIPTION: Collapsible logic */}
            {productData?.description && (
              <div className="mb-8 overflow-hidden">
                <p
                  className={`text-xs text-gray-600 leading-relaxed font-medium transition-all ${!showFullDesc ? "line-clamp-2" : ""}`}
                >
                  {productData.description}
                </p>
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-2 text-[10px] font-black uppercase text-gray-400 hover:text-black tracking-widest transition-colors"
                >
                  {showFullDesc ? "Show Less" : "See More"}
                </button>
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="space-y-3">
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-4 bg-black text-white text-xs font-black rounded-xl hover:bg-zinc-800 active:scale-[0.97] transition-all uppercase tracking-[0.2em]"
              >
                Buy Now
              </a>
              <p className="text-center text-[8px] text-gray-400 font-bold uppercase tracking-widest">
                Official Amazon Listing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-3 left-0 right-0 text-center pointer-events-none opacity-50">
        <p className="text-[7px] text-gray-300 uppercase tracking-[0.3em] font-bold">
          Partner Earnings Apply
        </p>
      </div>
    </div>
  );
};

export default ProductPage;
