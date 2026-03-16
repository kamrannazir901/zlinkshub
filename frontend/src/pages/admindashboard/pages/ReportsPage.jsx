import React, { useEffect, useState } from "react";
import {
  getReports,
  clearEarnings,
  clearAllDatabase,
} from "../../../services/reportService";
import { getAllAPIAccounts } from "../../../services/affiliateService";
import Pagination from "../../../components/Pagination";
import UploadCard from "./UploadCard"; // Import our new component

const ReportsPage = () => {
  const [sales, setSales] = useState([]);
  const [apiAccounts, setApiAccounts] = useState([]);
  const [summary, setSummary] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // UI States
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllAPIAccounts()
      .then((res) => setApiAccounts(res.data))
      .catch(console.error);
  }, []);

  const fetchData = async (pageNumber = 1) => {
    if (!startDate || !endDate) return alert("Please select a date range.");
    setLoading(true);
    try {
      const params = { startDate, endDate, page: pageNumber, limit: 10 };
      if (selectedAccountId) params.apiAccountId = selectedAccountId;
      if (searchTerm.trim()) params.trackingId = searchTerm.trim();

      const res = await getReports(params);
      setSales(res.data.reports || []);
      setSummary(res.data.summary || 0);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      alert("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 ">
          Earnings Reports
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
        {/* Summary Card */}
        <div className="bg-primary p-6 rounded-2xl shadow-lg text-white">
          <p className="text-pink-100 text-xs font-bold uppercase">
            Total Ad Fees
          </p>
          <h3 className="text-3xl font-bold">${summary.toFixed(2)}</h3>
        </div>

        {/* Conditional Upload Card */}
        {!showUpload ? (
          <button
            onClick={() => setShowUpload(true)}
            className="bg-pink-600 max-w-[200px] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-pink-200 hover:bg-pink-700 transition-all"
          >
            + Upload CSV
          </button>
        ) : (
          <UploadCard
            apiAccounts={apiAccounts}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>

      {/* Filter Row - Single Decent Row */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-wrap md:flex-nowrap gap-3 items-center">
        <select
          className="border-none bg-gray-50 rounded-xl p-2 text-sm font-medium focus:ring-2 focus:ring-pink-500 outline-none"
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
        >
          <option value="">All Accounts</option>
          {apiAccounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.appName}
            </option>
          ))}
        </select>

        <div className="flex items-center bg-gray-50 rounded-xl px-3 border border-transparent focus-within:border-pink-200 transition-all">
          <span className="text-[10px] font-bold text-gray-400 mr-2">FROM</span>
          <input
            type="date"
            className="bg-transparent border-none p-2 text-sm outline-none"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-gray-50 rounded-xl px-3 border border-transparent focus-within:border-pink-200 transition-all">
          <span className="text-[10px] font-bold text-gray-400 mr-2">TO</span>
          <input
            type="date"
            className="bg-transparent border-none p-2 text-sm outline-none"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="Tracking ID..."
          className="flex-grow bg-gray-50 border-none rounded-xl p-2 text-sm outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={() => fetchData(1)}
          disabled={loading}
          className="bg-pink-600 text-white px-8 py-2 rounded-xl text-sm font-bold hover:bg-pink-700 transition-all shadow-md shadow-pink-100"
        >
          {loading ? "..." : "Filter"}
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black">
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">ASIN</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Revenue</th>
                <th className="px-6 py-4 text-right">Ad Fees</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {sales.length > 0 ? (
                sales.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-700">
                      {s.trackingId || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{s.asin}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(s.dateShipped).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-pink-600">
                      {(s.revenue || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-pink-600">
                      {(s.adFees || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-400 italic"
                  >
                    No records to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={fetchData}
        />
      </div>

      {/* Admin Maintenance */}
      <div className="flex justify-between items-center bg-red-50 p-4 rounded-2xl border border-red-100 mt-8">
        <div className="text-xs">
          <span className="font-bold text-red-700 uppercase tracking-wider">
            Admin Maintenance
          </span>
        </div>

        <div className="flex gap-2">
          {/* 1. Clear Filtered */}
          <button
            onClick={async () => {
              if (window.confirm("Clear visible filtered records?")) {
                await clearEarnings({
                  apiAccountId: selectedAccountId,
                  startDate,
                  endDate,
                  trackingId: searchTerm,
                });
                fetchData(1);
              }
            }}
            className="px-4 py-2 text-red-600 font-bold text-[10px] uppercase hover:bg-red-100 rounded-lg transition-all"
          >
            Clear Filtered
          </button>

          {/* 2. Purge All */}
          <button
            onClick={async () => {
              if (window.confirm("CONFIRM: Purge entire database?")) {
                await clearAllDatabase();
                setSales([]);
                setSummary(0);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white font-bold text-[10px] uppercase rounded-lg hover:bg-red-700 transition-all shadow-sm"
          >
            Purge All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
