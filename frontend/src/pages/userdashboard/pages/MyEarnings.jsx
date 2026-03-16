import React, { useState, useEffect } from "react";
import { getMyEarnings } from "../../../services/reportService";
import Pagination from "../../../components/Pagination";
import { useSearchParams } from "react-router-dom";

const MyEarnings = () => {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userName, setUserName] = useState("My Earnings");
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    const now = new Date();
    const firstDayOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );
    const lastDayOfPrevMonth = new Date(firstDayOfCurrentMonth - 1);
    const firstDayOfPrevMonth = new Date(
      lastDayOfPrevMonth.getFullYear(),
      lastDayOfPrevMonth.getMonth(),
      1,
    );

    setStartDate(firstDayOfPrevMonth.toISOString().split("T")[0]);
    setEndDate(lastDayOfPrevMonth.toISOString().split("T")[0]);

    // Initial fetch
    fetchData(
      1,
      firstDayOfPrevMonth.toISOString().split("T")[0],
      lastDayOfPrevMonth.toISOString().split("T")[0],
    );
  }, [userId]);

  const fetchData = async (
    pageNumber = 1,
    start = startDate,
    end = endDate,
  ) => {
    if (!start || !end) return alert("Please select a date range.");
    setLoading(true);
    try {
      const res = await getMyEarnings({
        startDate: start,
        endDate: end,
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
      setSummary(res.data.summary || 0);
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
        {userName}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        View your sales and ad fees here. We update these reports once a month.
        To see reports for a different time, pick your start and end dates
        below, then click 'Filter Results'.
      </p>

      {/* Grid: Filter + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200"
              />
            </div>
            <button
              onClick={() => fetchData(1)}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm"
            >
              {loading ? "Loading..." : "Filter Results"}
            </button>
          </div>
        </div>

        <div className="bg-primary p-6 rounded-2xl shadow-lg text-white">
          <p className="text-pink-100 text-xs font-bold uppercase">
            Total Ad Fees
          </p>
          <h3 className="text-3xl font-bold">${summary.toFixed(2)}</h3>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Ad Fees ($)</th>
                <th className="px-6 py-4">ASIN</th>
                <th className="px-6 py-4">Tracking ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {sales.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {new Date(s.dateShipped).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-pink-600">
                    {(s.adFees || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 font-mono">{s.asin}</td>
                  <td className="px-6 py-4 font-mono">{s.trackingId}</td>
                </tr>
              ))}
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
