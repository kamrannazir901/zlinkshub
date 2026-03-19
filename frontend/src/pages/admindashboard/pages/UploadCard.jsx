import React, { useState } from "react";
import { uploadEarningsCSV } from "../../../services/reportService";

const CURRENCIES = [
  { label: "American Dollar (USD)", value: "USD", rate: 1 },
  { label: "Canadian Dollar (CAD)", value: "CAD", rate: 0.72 }, // Example rates
  { label: "British Pound (GBP)", value: "GBP", rate: 1.25 },
  { label: "Euro (EUR)", value: "EUR", rate: 1.08 },
];

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

const YEARS = [2024, 2025, 2026]; // Add more as needed

const UploadCard = ({ apiAccounts, onClose }) => {
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [currency, setCurrency] = useState("USD");
  const [conversionRate, setConversionRate] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleCurrencyChange = (e) => {
    const selectedValue = e.target.value;
    const selected = CURRENCIES.find((c) => c.value === selectedValue);
    setCurrency(selectedValue);
    setConversionRate(selected ? selected.rate.toString() : "1");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedAccountId || !year || !month)
      return alert("All fields are required.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("apiAccountId", selectedAccountId);
    formData.append("year", year);
    formData.append("month", month);
    formData.append("currency", currency);
    formData.append("conversionRate", conversionRate);

    try {
      await uploadEarningsCSV(formData);
      alert("Monthly report uploaded successfully!");
      onClose();
    } catch (err) {
      alert("Upload failed. Check if the file format is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-800">Monthly Data Import</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500">
          ✕
        </button>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* API Account Selection */}
        <select
          className="w-full border rounded-lg p-2 text-sm"
          onChange={(e) => setSelectedAccountId(e.target.value)}
          value={selectedAccountId}
        >
          <option value="">Select Account / Region</option>
          {apiAccounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.appName}
            </option>
          ))}
        </select>

        {/* Year and Month Selection */}
        <div className="grid grid-cols-2 gap-2">
          <select
            className="border rounded-lg p-2 text-xs"
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
            className="border rounded-lg p-2 text-xs"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Currency and Rate Selection */}
        <div className="grid grid-cols-2 gap-2">
          <select
            className="border rounded-lg p-2 text-xs"
            onChange={handleCurrencyChange}
            value={currency}
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="any"
            value={conversionRate}
            placeholder="Rate to USD"
            className="border rounded-lg p-2 text-xs"
            onChange={(e) => setConversionRate(e.target.value)}
          />
        </div>

        {/* File Input */}
        <input
          type="file"
          accept=".csv"
          className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-gray-100"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
        >
          {loading ? "Processing..." : "Import Monthly Report"}
        </button>
      </form>
    </div>
  );
};

export default UploadCard;
