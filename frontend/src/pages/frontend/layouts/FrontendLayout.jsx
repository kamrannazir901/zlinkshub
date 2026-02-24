import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const FrontendLayout = () => {
  return (
    <div className="flex flex-col min-h-screen text-black bg-white">
      {/* Navbar is fixed, so it doesn't take up space in the document flow */}
      <Navbar />

      {/* pt-16: Adds 64px of padding-top to match the navbar height
        flex-1: Ensures the main area grows to push the footer down
      */}
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FrontendLayout;
