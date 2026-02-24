import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getAllPublicLinks } from "../../../services/linkService";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllPublicLinks();
        // Adjust based on your API response structure (e.g., res.data.data or res.data)
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left max-w-2xl">
          <span className="inline-block mb-3 text-[10px] font-black tracking-[0.2em] text-black uppercase bg-gray-100 px-4 py-1.5 rounded-md">
            Featured Deals
          </span>

          <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tighter">
            Latest <span className="text-primary">ZLinksHub</span>{" "}
            Recommendations
          </h2>

          <p className="mt-5 text-sm md:text-base text-gray-500 font-medium leading-relaxed">
            Hand-selected based on performance, price, and satisfaction. Shop
            the best of Amazon in one place.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {loading ? (
            // Simple Loading Skeleton
            [...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-square rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                No recommendations found yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
