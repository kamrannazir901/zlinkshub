import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    // Add overflow-x-hidden to the root container
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Sidebar / Topbar */}
      <Sidebar />

      {/* Main Content Area 
         - Removed heavy md:p-16 to let the Dashboard handle its own spacing
         - Added w-full to ensure it stays within bounds
      */}
      <main className="flex-1 w-full pt-16">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
