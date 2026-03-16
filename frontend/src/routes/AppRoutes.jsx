import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import FrontendLayout from "../pages/frontend/layouts/FrontendLayout";

// Frontend Pages
import Home from "../pages/frontend/pages/Home";
import About from "../pages/frontend/pages/About";
import Contact from "../pages/frontend/pages/Contact";
import Login from "../pages/frontend/pages/Login";
import ForgotPassword from "../pages/frontend/pages/ForgotPassword";
import ResetPassword from "../pages/frontend/pages/ResetPassword";
import Disclaimer from "../pages/frontend/pages/Disclaimer";
import ProductPage from "../pages/frontend/pages/ProductPage";
import ProductsPage from "../pages/frontend/pages/ProductsPage";
import GuidesPage from "../pages/frontend/pages/GuidesPage";
import SingleGuidePage from "../pages/frontend/pages/SingleGuidePage";
// New Legal Pages
import PrivacyPolicy from "../pages/frontend/pages/PrivacyPolicy";
import TermsOfService from "../pages/frontend/pages/TermsOfService";

// Admin layout
import AdminLayout from "../pages/admindashboard/layout/AdminLayout";

// user layout
import UserLayout from "../pages/userdashboard/layout/UserLayout";

// Admin Pages
import Dashboard from "../pages/admindashboard/pages/Dashboard";
import Users from "../pages/admindashboard/pages/Users";
import APIAccounts from "../pages/admindashboard/pages/APIAccounts";
import TrackingTags from "../pages/admindashboard/pages/TrackingTags";
import AddAPIAccount from "../pages/admindashboard/pages/AddAPIAccount";
import AddTrackingTag from "../pages/admindashboard/pages/AddTrackingTag";
import UserForm from "../pages/admindashboard/pages/UserForm";
import AdminGuides from "../pages/admindashboard/pages/AdminGuides";
import GuideForm from "../pages/admindashboard/pages/GuideForm";
import ReportsPage from "../pages/admindashboard/pages/ReportsPage";
// User Dashboard Pages
import UserDashboard from "../pages/userdashboard/pages/Dashboard";
import MyEarnings from "../pages/userdashboard/pages/MyEarnings";
import ScrollToTop from "../components/ScrollToTop";

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* --- Public Routes --- */}
        <Route element={<FrontendLayout />}>
          {/* Home is now the Index (Root) Page */}
          <Route path="/" element={<Home />} index />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />

          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />

          {/* Content Pages */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:slug" element={<SingleGuidePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="product/:id" element={<ProductPage />} />

          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Route>

        {/* --- Protected User Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="my-earnings" element={<MyEarnings />} />
          </Route>
        </Route>

        {/* --- Protected Admin Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/:id" element={<UserForm />} />
            <Route path="api-accounts" element={<APIAccounts />} />
            <Route path="api-accounts/new" element={<AddAPIAccount />} />
            <Route path="tracking-tags" element={<TrackingTags />} />
            <Route path="tracking-tags/new" element={<AddTrackingTag />} />

            <Route path="guides" element={<AdminGuides />} />
            <Route path="guides/new" element={<GuideForm />} />
            <Route path="guides/:id" element={<GuideForm />} />

            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/user-earnings" element={<MyEarnings />} />
          </Route>
        </Route>

        {/* Redirect unknown routes to Home instead of Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
