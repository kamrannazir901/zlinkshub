import React, { useEffect, useState } from "react";
import { getStats } from "../../../services/userService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTags: 0,
    totalApis: 0,
    unassignedTags: 0,
    usersWithoutTags: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getStats();
        const data = res.data || res;
        setStats({
          totalUsers: data.totalUsers || 0,
          totalTags: data.totalTags || 0,
          totalApis: data.totalApis || 0,
          unassignedTags: data.unassignedTags || 0,
          usersWithoutTags: data.usersWithoutTags || 0,
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to sync dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-gray font-bold animate-pulse uppercase tracking-[0.2em] text-xs">
          Syncing Platform Data...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-black tracking-tight uppercase">
          Platform Overview
        </h1>
        <p className="text-gray text-sm mt-1">
          Real-time resource and user analytics
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-primary text-primary rounded-md text-sm font-medium">
          System Sync Error: {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Total Users - Deep Navy */}
        <div className="bg-[#0f172a] p-8 rounded-2xl shadow-xl border-t-8 border-blue-500">
          <div className="flex justify-between items-start">
            <h4 className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
              Total Creators
            </h4>
            <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-1 rounded font-bold">
              LIVE
            </span>
          </div>
          <p className="text-6xl font-black text-white mt-4 tracking-tighter">
            {stats.totalUsers.toLocaleString()}
          </p>
        </div>

        {/* API Accounts - Your Brand Primary */}
        <div className="bg-primary p-8 rounded-2xl shadow-xl border-t-8 border-pink-300">
          <div className="flex justify-between items-start">
            <h4 className="text-white/70 text-[10px] uppercase font-black tracking-widest">
              Marketplace APIs
            </h4>
            <span className="bg-white/20 text-white text-[10px] px-2 py-1 rounded font-bold">
              ACTIVE
            </span>
          </div>
          <p className="text-6xl font-black text-white mt-4 tracking-tighter">
            {stats.totalApis.toLocaleString()}
          </p>
        </div>

        {/* Total Tracking Tags - Deep Charcoal */}
        <div className="bg-black p-8 rounded-2xl shadow-xl border-t-8 border-slate-700">
          <div className="flex justify-between items-start">
            <h4 className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
              Total Store Tags
            </h4>
          </div>
          <p className="text-6xl font-black text-white mt-4 tracking-tighter">
            {stats.totalTags.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Operational Insight Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Unassigned Tags Inventory */}
        <div className="bg-white border-2 border-dashed border-gray/20 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-black font-black text-lg uppercase leading-none">
              Tag Inventory
            </h4>
            <p className="text-gray text-sm mt-1 font-medium">
              Available tags ready for new users
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-black text-primary tracking-tight">
              {stats.unassignedTags}
            </p>
            <span className="text-[10px] font-bold text-gray uppercase tracking-tighter">
              Unassigned Tags
            </span>
          </div>
        </div>

        {/* Action Needed: Users without tags */}
        <div
          className={`p-8 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6 transition-all 
          ${stats.usersWithoutTags > 0 ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray/10 opacity-60"}`}
        >
          <div>
            <h4 className="text-black font-black text-lg uppercase leading-none">
              Setup Pending
            </h4>
            <p className="text-gray text-sm mt-1 font-medium">
              Users waiting for tag assignment
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-5xl font-black tracking-tight ${stats.usersWithoutTags > 0 ? "text-amber-600" : "text-gray"}`}
            >
              {stats.usersWithoutTags}
            </p>
            <span className="text-[10px] font-bold text-gray uppercase tracking-tighter">
              Inactive Users
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
