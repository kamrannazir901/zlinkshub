import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import ProductCard from "./ProductCard";
import { getAllPublicLinks } from "../../../services/linkService";
import { Sparkles, ArrowRight } from "lucide-react";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Explicitly fetch only 8 products for the homepage section
        const res = await getAllPublicLinks(8);
        setProducts(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-10 md:py-16 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              Latest <span className="text-[#d81159]">Recommendations</span>
            </h2>
            <p className="text-gray-600 text-base font-normal mt-2">
              Rigorous data analysis meets real-world performance. We only
              recommend gear that earns its spot.
            </p>
          </div>

          {/* Navigates to the full products page */}
          <Link
            to="/products"
            className="flex items-center gap-2 text-sm font-semibold text-[#d81159] hover:underline transition-all group"
          >
            View All Deals
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-[4/5] rounded-2xl mb-4"></div>
                <div className="h-5 bg-gray-50 rounded-full w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-50 rounded-full w-1/2"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border border-gray-100">
              <Sparkles className="mx-auto text-gray-300 mb-4" size={40} />
              <p className="text-gray-500 font-medium text-[15px]">
                Currently curating new recommendations for ZLinksHub...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
