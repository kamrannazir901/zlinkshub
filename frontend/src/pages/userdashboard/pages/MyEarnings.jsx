import React, { useState, useEffect } from "react";
import { getMyEarnings } from "../../../services/reportService";
import Pagination from "../../../components/Pagination";
import { useSearchParams } from "react-router-dom";

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

const MyEarnings = () => {
  const [sales, setSales] = useState([]);
  // Summary now holds both total gross and total net
  const [summary, setSummary] = useState({ totalAdFees: 0, totalPayout: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [userName, setUserName] = useState("My Earnings");
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    fetchData(1, year, month);
  }, [userId]);

  const fetchData = async (
    pageNumber = 1,
    selYear = year,
    selMonth = month,
  ) => {
    setLoading(true);
    try {
      const res = await getMyEarnings({
        year: selYear,
        month: selMonth,
        page: pageNumber,
        limit: 10,
        userId,
      });

      if (res.data.userName) {
        setUserName(`${res.data.userName}'s Earnings`);
      } else {
        setUserName("My Earnings");
      }

      setSales(res.data.reports || []);
      // Update summary with the object from backend
      setSummary(res.data.summary || { totalAdFees: 0, totalPayout: 0 });
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      console.error(err);
      alert("Failed to load earnings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
        {userName}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Reports are updated monthly. Select a specific period to view your
        performance data.
      </p>

      {/* Grid: Filter + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[120px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">
                Select Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-pink-500"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">
                Select Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-pink-500"
              >
                {MONTHS.map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => fetchData(1)}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-pink-100 hover:bg-pink-700 transition-all"
            >
              {loading ? "..." : "Update View"}
            </button>
          </div>
        </div>

        {/* Updated Summary Card: Shows both Gross and Net */}
        <div className="lg:col-span-2 bg-primary p-6 rounded-2xl shadow-lg text-white flex justify-between items-center">
          <div>
            <p className="text-pink-100 text-[10px] font-bold uppercase tracking-wider">
              Your Net Payout
            </p>
            <h3 className="text-3xl font-bold">
              ${(summary.totalPayout || 0).toFixed(2)}
            </h3>
          </div>
          <div className="text-right border-l border-pink-400/30 pl-6">
            <p className="text-pink-100 text-[10px] font-bold uppercase tracking-wider">
              Gross Ad Fees
            </p>
            <h3 className="text-xl opacity-90">
              ${(summary.totalAdFees || 0).toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      {/* Table - Monthly Performance View */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black">
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4 text-center">Clicks</th>
                <th className="px-6 py-4 text-center">Ordered</th>
                <th className="px-6 py-4 text-center">Shipped</th>
                <th className="px-6 py-4 text-center">Returned</th>
                <th className="px-6 py-4 text-center">Currency</th>
                <th className="px-6 py-4 text-center">Conversion Rate</th>
                <th className="px-6 py-4 text-right">Total Fees</th>
                <th className="px-6 py-4 text-right text-pink-600">
                  Your Share
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {sales.length > 0 ? (
                sales.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-700">
                      {s.trackingId}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      {s.clicks || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      {s.itemsOrdered || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      {s.itemsShipped || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-red-400">
                      {s.itemsReturned || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      {s.currency || "USD"}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      {s.conversionRate || 1}
                    </td>
                    {/* Total Ad Fees Column */}
                    <td className="px-6 py-4 text-right text-gray-400">
                      ${(s.adFeesUSD || 0).toFixed(2)}
                    </td>
                    {/* Final Payout Column */}
                    <td className="px-6 py-4 text-right font-bold text-pink-600">
                      ${(s.userPayoutUSD || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-400 italic"
                  >
                    No records found for the selected month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => fetchData(p)}
        />
      </div>
    </div>
  );
};

export default MyEarnings;
