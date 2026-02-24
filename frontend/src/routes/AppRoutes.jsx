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
import Contact from "../pages/frontend/pages/Contact";
import Login from "../pages/frontend/pages/Login";
import Signup from "../pages/frontend/pages/Signup";
import ForgotPassword from "../pages/frontend/pages/ForgotPassword";
import Disclaimer from "../pages/frontend/pages/Disclaimer";
import ProductPage from "../pages/frontend/pages/ProductPage";

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

// User Dashboard Pages
import UserDashboard from "../pages/userdashboard/pages/Dashboard";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route element={<FrontendLayout />}>
          <Route path="/" element={<Home />} index />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="product/:id" element={<ProductPage />} />
        </Route>

        {/* --- Protected User Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
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
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
