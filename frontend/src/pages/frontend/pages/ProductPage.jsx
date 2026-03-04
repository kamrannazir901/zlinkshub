import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicLink } from "../../../services/linkService";
import { ExternalLink, ArrowLeft } from "lucide-react";

const ProductPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getPublicLink(id);
        if (res.data.data) {
          setData(res.data.data);
          document.title = res.data.data.productData?.title || "Product";
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

  if (loading || error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm tracking-widest uppercase">
        {loading ? "Syncing..." : "Product Unavailable"}
      </div>
    );
  }

  const { productData, affiliateUrl, createdAt } = data;

  const BuyButton = ({ className = "" }) => (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 px-6 py-4 bg-black text-white text-sm font-bold rounded-lg hover:bg-zinc-800 transition-all uppercase tracking-widest border border-black box-border ${className}`}
    >
      <span className="truncate">Checkout on Amazon</span>
      <ExternalLink size={14} className="shrink-0" />
    </a>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="px-6 py-6 max-w-7xl mx-auto">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} /> BACK
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* Main Product Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-20">
          {/* 1. TEXT CONTENT (First on all devices) */}
          <div className="flex flex-col justify-center">
            <div className="mb-2 text-xs text-white bg-primary/85 rounded-full inline-block w-fit px-2 py-1 uppercase tracking-widest font-normal">
              {productData?.category || "General"}
            </div>

            <h1 className="text-xl md:text-2xl font-bold leading-tight mb-4">
              {productData?.title}
            </h1>

            <div className="text-3xl font-bold mb-2 tracking-tighter">
              {productData?.price}
            </div>

            <p className="text-[12px] text-gray-400 mb-6 italic font-normal">
              * Prices and availability are subject to change on Amazon.
            </p>

            {/* ACTION BUTTON (Before Image on Mobile) */}
            <div className="mb-8 lg:mb-0">
              <BuyButton className="w-full lg:w-fit lg:min-w-[280px]" />
            </div>
          </div>

          {/* 2. IMAGE (Second on Mobile) */}
          <div className="mt-4 lg:mt-0 bg-[#fcfcfc] border border-gray-50 rounded-2xl p-6 flex items-center justify-center">
            <img
              src={productData?.image}
              alt="Product"
              className="w-full h-auto max-h-[400px] object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* 3. DESCRIPTION (Full Width Below) */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <div className="max-w-4xl">
            <h3 className="text-sm uppercase tracking-widest mb-6 text-gray-400 font-normal">
              Product Information
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-10 font-normal">
              {productData?.description}
            </p>

            {/* Secondary Button after description for mobile UX */}
            <div className="lg:hidden mb-12">
              <BuyButton className="w-full" />
            </div>

            <footer className="pt-8 border-t border-gray-50">
              <p className="text-sm text-gray-400 leading-relaxed italic font-normal">
                <strong>Affiliate Disclosure:</strong> As an Amazon Associate,
                we earn from qualifying purchases. Prices and availability are
                accurate as of {new Date(createdAt).toLocaleDateString()} and
                are subject to change.
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
