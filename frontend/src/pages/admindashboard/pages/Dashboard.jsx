import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../../../services/userService";
import {
  Users,
  Tag,
  Globe,
  BookOpen,
  ArrowUpRight,
  Plus,
  Activity,
  Zap,
  AlertCircle,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTags: 0,
    totalApis: 0,
    unassignedTags: 0,
    usersWithoutTags: 0,
    totalGuides: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await getStats();
        setStats(res.data || res);
      } catch (err) {
        console.error("Dashboard Sync Error");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-[#d81159] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[15px] font-semibold text-slate-400 uppercase tracking-widest">
          Initialising Systems
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* --- SECTION: HEADER (Grounded & Direct) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tight">
            <span className="text-[#d81159]">Dashboard</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[14px] font-medium text-slate-500 uppercase tracking-wide">
                Server Online
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-[14px] font-medium text-slate-400 uppercase tracking-wide">
              Platform v3.2.1
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/users/new"
            className="px-6 py-3 bg-white border-2 border-black text-black rounded-xl font-semibold text-[15px] hover:bg-black hover:text-white transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New User
          </Link>
          <Link
            to="/admin/tracking-tags/new"
            className="px-6 py-3 bg-[#d81159] text-white rounded-xl font-semibold text-[15px] hover:opacity-90 transition-all shadow-lg shadow-pink-100 flex items-center gap-2"
          >
            <Zap size={18} /> New Tag
          </Link>
        </div>
      </div>

      {/* --- SECTION: PRIMARY METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Total Creators"
          value={stats.totalUsers}
          icon={<Users size={32} />}
          color="bg-[#0f172a]"
          accent="border-blue-500"
        />
        <StatCard
          label="Active APIs"
          value={stats.totalApis}
          icon={<Globe size={32} />}
          color="bg-[#d81159]"
          accent="border-pink-300"
        />
        <StatCard
          label="Store Tags"
          value={stats.totalTags}
          icon={<Tag size={32} />}
          color="bg-black"
          accent="border-slate-600"
        />
        <StatCard
          label="Live Guides"
          value={stats.totalGuides}
          icon={<BookOpen size={32} />}
          color="bg-[#4338ca]"
          accent="border-indigo-400"
        />
      </div>

      {/* --- SECTION: SYSTEM STATUS & NAVIGATION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* New System Health Design (Technical/Detailed) */}
        <div className="lg:col-span-2 bg-slate-50 border-2 border-slate-200 rounded-3xl overflow-hidden flex flex-col">
          <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-slate-400" size={20} />
              <h3 className="text-[15px] font-bold text-black uppercase tracking-wider">
                Pending Actions
              </h3>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatusRow
              label="Available Tags"
              value={stats.unassignedTags}
              subtext="Inventory ready for new creators"
              icon={<Tag size={20} />}
              color="text-blue-600"
            />
            <StatusRow
              label="Configuration Pending"
              value={stats.usersWithoutTags}
              subtext="Users requiring tag assignment"
              icon={<AlertCircle size={20} />}
              color={
                stats.usersWithoutTags > 0 ? "text-[#d81159]" : "text-slate-400"
              }
              isAlert={stats.usersWithoutTags > 0}
            />
          </div>

          <div className="mt-auto border-t border-slate-200 px-8 py-4 bg-white/50 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-slate-400" />
              <span className="text-[13px] font-medium text-slate-500">
                Database Encrypted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-slate-400" />
              <span className="text-[13px] font-medium text-slate-500">
                Auto-sync active
              </span>
            </div>
          </div>
        </div>

        {/* Quick Access Sidebar */}
        <div className="bg-black rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap size={100} />
          </div>
          <div className="relative z-10">
            <h3 className="text-[14px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">
              Navigation
            </h3>
            <div className="space-y-3">
              <QuickAction to="/admin/users" label="Manage Users" />
              <QuickAction to="/admin/tracking-tags" label="Manage Tags" />
              <QuickAction
                to="/admin/api-accounts"
                label="Manage Api Accounts"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const StatCard = ({ label, value, icon, color, accent }) => (
  <div
    className={`${color} ${accent} border-t-8 p-8 rounded-3xl shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}
  >
    <div className="absolute -right-4 -top-4 text-white/10 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <div className="relative z-10">
      <p className="text-[14px] font-medium text-white/40 uppercase tracking-widest mb-4">
        {label}
      </p>
      <p className="text-5xl font-black text-white tracking-tighter">
        {value.toLocaleString()}
      </p>
    </div>
  </div>
);

const StatusRow = ({ label, value, subtext, icon, color, isAlert }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
    <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>{icon}</div>
    <div>
      <p className="text-[14px] font-bold text-slate-400 uppercase tracking-tight">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-4xl font-black tracking-tighter ${isAlert ? "text-[#d81159]" : "text-black"}`}
        >
          {value}
        </span>
        <span className="text-[14px] font-medium text-slate-400 italic">
          {isAlert ? "Needs Action" : "Stable"}
        </span>
      </div>
      <p className="text-[13px] font-medium text-slate-400 mt-1">{subtext}</p>
    </div>
  </div>
);

const QuickAction = ({ to, label }) => (
  <Link
    to={to}
    className="flex items-center justify-between p-4 bg-white/5 rounded-xl group hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
  >
    <span className="text-[15px] font-medium text-slate-200">{label}</span>
    <ArrowUpRight
      size={18}
      className="text-slate-600 group-hover:text-[#d81159] transition-all"
    />
  </Link>
);

export default Dashboard;
