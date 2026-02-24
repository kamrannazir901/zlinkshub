import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar component now acting as a Topbar */}
      <Sidebar />

      {/* Main content area below the navigation */}
      <main className="w-full flex-1  p-8 overflow-hidden">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
