import React from "react";
import FrontendLayout from "../layouts/FrontendLayout";
import HeroSection from "../components/HeroSection";
import ProductsSection from "../components/ProductsSection";
import CategoriesSection from "../components/CategoriesSection";
import WhyZLinksHub from "../components/WhyZLinksHub";
import GuidesSection from "../components/GuidesSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <WhyZLinksHub />
      <GuidesSection />
      <CategoriesSection />
      <ProductsSection />
    </>
  );
};

export default Home;
