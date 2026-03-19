import React, { useEffect, useState } from "react";
import {
  getReports,
  clearEarnings,
  clearAllDatabase,
} from "../../../services/reportService";
import { getAllAPIAccounts } from "../../../services/affiliateService";
import Pagination from "../../../components/Pagination";
import UploadCard from "./UploadCard";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS = [2024, 2025, 2026];

const ReportsPage = () => {
  const [sales, setSales] = useState([]);
  const [apiAccounts, setApiAccounts] = useState([]);
  const [summary, setSummary] = useState({ totalAdFees: 0, totalPayable: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // UI States
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter States (Updated to Year/Month)
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllAPIAccounts()
      .then((res) => setApiAccounts(res.data))
      .catch(console.error);
  }, []);

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const params = {
        year,
        month,
        page: pageNumber,
        limit: 10,
      };
      if (selectedAccountId) params.apiAccountId = selectedAccountId;
      if (searchTerm.trim()) params.trackingId = searchTerm.trim();

      const res = await getReports(params);
      setSales(res.data.reports || []);
      setSummary(res.data.summary || { totalAdFees: 0, totalPayable: 0 });
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
          Monthly Earnings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
        {/* Card 1: Gross Ad Fees */}
        <div className="bg-primary p-6 rounded-2xl shadow-lg text-white">
          <p className="text-pink-100 text-[10px] font-bold uppercase tracking-widest">
            Total Gross Ad Fees
          </p>
          <h3 className="text-3xl font-bold">
            ${(summary.totalAdFees || 0).toFixed(2)}
          </h3>
        </div>

        {/* Card 2: User Payable */}
        <div className="bg-green-600 p-6 rounded-2xl shadow-lg text-white">
          <p className="text-green-100 text-[10px] font-bold uppercase tracking-widest">
            Total Payable to Users
          </p>
          <h3 className="text-3xl font-bold">
            ${(summary.totalPayable || 0).toFixed(2)}
          </h3>
        </div>

        {/* Upload Button */}
        {!showUpload ? (
          <button
            onClick={() => setShowUpload(true)}
            className="bg-white border-2 border-dashed border-gray-300 text-gray-500 w-full h-full min-h-[100px] rounded-2xl text-sm font-bold hover:border-pink-400 hover:text-pink-600 transition-all flex items-center justify-center gap-2"
          >
            + Upload Monthly CSV
          </button>
        ) : (
          <UploadCard
            apiAccounts={apiAccounts}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>

      {/* Filter Row - Optimized for Year/Month */}
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

        <select
          className="bg-gray-50 rounded-xl p-2 text-sm font-medium outline-none"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          className="bg-gray-50 rounded-xl p-2 text-sm font-medium outline-none"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {MONTHS.map((m, i) => (
            <option key={i + 1} value={i + 1}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search Tracking ID..."
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

      {/* Table Section - Updated for Monthly Metrics */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black">
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4 text-center">Clicks</th>
                <th className="px-6 py-4 text-center">Ordered</th>
                <th className="px-6 py-4 text-center">Shipped</th>
                <th className="px-6 py-4 text-center">Returned</th>
                <th className="px-6 py-4 text-center">Currency</th>
                <th className="px-6 py-4 text-center">Conversion Rate</th>
                <th className="px-6 py-4 text-center">Rate (%)</th>
                <th className="px-6 py-4 text-right">Total Ad Fees</th>
                <th className="px-6 py-4 text-right">User Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm bg-white">
              {sales.length > 0 ? (
                sales.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Tracking ID */}
                    <td className="px-6 py-4 font-bold text-gray-700">
                      {s.trackingId || "-"}
                    </td>

                    {/* Stats */}
                    <td className="px-6 py-4 text-center text-gray-500">
                      {s.clicks || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      {s.itemsOrdered || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      {s.itemsShipped || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-red-500 font-medium">
                      {s.itemsReturned || 0}
                    </td>

                    {/* Currency and Rate */}
                    <td className="px-6 py-4 text-center text-gray-400">
                      {s.currency || "USD"}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      {s.conversionRate || 1}
                    </td>

                    {/* Applied Percentage */}
                    <td className="px-6 py-4 text-center text-gray-400 font-medium">
                      {s.appliedPercentage}%
                    </td>

                    {/* Total Ad Fees (The 100% amount) */}
                    <td className="px-6 py-4 text-right text-gray-400 font-medium">
                      ${(s.adFeesUSD || 0).toFixed(2)}
                    </td>

                    {/* User Payable (The calculated share) */}
                    <td className="px-6 py-4 text-right font-black text-green-600">
                      ${(s.userPayoutUSD || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-400 italic"
                  >
                    No records found for this period.
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
          <button
            onClick={async () => {
              if (
                window.confirm(
                  `Clear records for ${MONTHS[month - 1]} ${year}?`,
                )
              ) {
                await clearEarnings({
                  apiAccountId: selectedAccountId,
                  year,
                  month,
                  trackingId: searchTerm,
                });
                fetchData(1);
              }
            }}
            className="px-4 py-2 text-red-600 font-bold text-[10px] uppercase hover:bg-red-100 rounded-lg transition-all"
          >
            Clear Selected Month
          </button>

          <button
            onClick={async () => {
              if (window.confirm("CONFIRM: Purge entire database?")) {
                await clearAllDatabase();
                setSales([]);
                setSummary({ totalAdFees: 0, totalPayable: 0 });
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
