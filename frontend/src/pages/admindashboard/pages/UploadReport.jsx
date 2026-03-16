import React, { useState } from "react";
import {
  uploadEarningsCSV,
  clearEarnings,
} from "../../../services/reportService";

const UploadReport = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Admin inputs for tagging the upload
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("month", month);
    formData.append("year", year);

    try {
      const res = await uploadEarningsCSV(formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 1. Responsive Header & Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-6">Report Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Filters */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase text-gray-500 mb-1">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="p-2 border rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase text-gray-500 mb-1">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="p-2 border rounded-md"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Apply Filter
          </button>
          <button
            className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            onClick={() => clearEarnings(month, year)}
          >
            Clear Period
          </button>
        </div>
      </div>

      {/* 2. Upload Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold mb-4">
          Upload New Data for {month}/{year}
        </h3>
        <form
          onSubmit={handleUpload}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm border p-2 rounded-md"
          />
          <button
            disabled={loading}
            className="bg-[#d81159] text-white px-6 py-2 rounded-lg font-medium"
          >
            {loading ? "Processing..." : "Submit CSV"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm font-bold text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
};
