import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="pt-16 p-4 md:p-16">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
