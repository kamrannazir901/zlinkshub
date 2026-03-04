import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { productData, marketplace, _id } = product;

  return (
    <Link to={`/product/${_id}`} className="group block">
      {/* Image Container */}
      <div className="relative aspect-square bg-[#FBFBFB] rounded-3xl overflow-hidden border border-gray-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/5 group-hover:-translate-y-1">
        <img
          src={productData?.image}
          alt={productData?.title}
          className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-md uppercase tracking-wider">
            {productData?.category || "General"}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-5 px-1">
        <h3 className="text-sm text-black leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {productData?.title}
        </h3>

        <div className="mt-3 flex justify-between items-center">
          <p className="text-xl font-black text-primary tracking-tighter">
            {productData?.price}
          </p>
          <span className="text-[10px] uppercase tracking-widest group-hover:text-black transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
