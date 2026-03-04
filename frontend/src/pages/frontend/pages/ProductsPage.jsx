import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"; // Adjusted to your path
import { getAllPublicLinks } from "../../../services/linkService";
import { Sparkles, ShoppingBag, Plus, Loader2 } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(8); // Start with 10
  const maxProducts = 50;

  const fetchProducts = async (limit, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const res = await getAllPublicLinks(limit);
      const data = res.data?.data || res.data || [];

      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts(currentLimit, true);
  }, []);

  // Handle Load More
  const handleLoadMore = () => {
    const nextLimit = currentLimit + 4;
    if (nextLimit <= maxProducts) {
      setCurrentLimit(nextLimit);
      fetchProducts(nextLimit);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Page Header */}
        <div className="border-b border-gray-100 pb-10 mb-12">
          <div className="flex items-center gap-2 text-[#d81159] font-bold text-sm uppercase tracking-widest mb-3">
            <ShoppingBag size={16} />
            <span>Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            All <span className="text-[#d81159]">Recommendations</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Browse our full collection of vetted products. Every item here has
            been analyzed for quality, value, and real-world reliability.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center mb-10">
          <p className="text-gray-400 text-[14px] font-medium">
            Showing{" "}
            <span className="text-gray-900 font-bold">{products.length}</span>{" "}
            premium finds
          </p>
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
            <div className="col-span-full py-32 text-center bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
              <Sparkles className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-gray-900 font-bold text-xl mb-2">
                Expanding the Collection
              </h3>
              <p className="text-gray-500 font-medium">
                Check back soon for fresh deals!
              </p>
            </div>
          )}
        </div>

        {/* Load More Action */}
        {!loading && products.length > 0 && (
          <div className="mt-20 flex flex-col items-center">
            {currentLimit < maxProducts ? (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-[15px] hover:bg-gray-800 transition-all disabled:opacity-50 shadow-xl shadow-gray-200"
              >
                {loadingMore ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
                Load More Results
              </button>
            ) : (
              <div className="text-center">
                <div className="h-px w-24 bg-gray-100 mx-auto mb-8"></div>
                <p className="text-gray-400 text-sm font-medium">
                  You've viewed all {maxProducts} premium recommendations.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
