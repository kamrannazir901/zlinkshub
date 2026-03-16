import React, { useState } from "react";
import { uploadEarningsCSV } from "../../../services/reportService";

const CURRENCIES = [
  { label: "USD", value: "USD", rate: 1.0 },
  { label: "GBP", value: "GBP", rate: 1.25 },
  { label: "EUR (DE)", value: "EUR_DE", rate: 1.08 },
  { label: "EUR (IT)", value: "EUR_IT", rate: 1.08 },
  { label: "EUR (ES)", value: "EUR_ES", rate: 1.08 },
  { label: "EUR (FR)", value: "EUR_FR", rate: 1.08 },
];
const UploadCard = ({ apiAccounts, onClose }) => {
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
    if (!file || !selectedAccountId || !startDate || !endDate)
      return alert("All fields are required.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("apiAccountId", selectedAccountId);
    formData.append("reportStartDate", startDate);
    formData.append("reportEndDate", endDate);
    formData.append("currency", currency);
    formData.append("conversionRate", conversionRate);

    try {
      await uploadEarningsCSV(formData);
      alert("Upload successful!");
      onClose();
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-800">New Data Import</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500">
          ✕
        </button>
      </div>
      <form onSubmit={handleUpload} className="space-y-4">
        <select
          className="w-full border rounded-lg p-2 text-sm"
          onChange={(e) => setSelectedAccountId(e.target.value)}
        >
          <option value="">Select Account</option>
          {apiAccounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.appName}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className="border rounded-lg p-2 text-xs"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border rounded-lg p-2 text-xs"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

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
            className="border rounded-lg p-2 text-xs"
            onChange={(e) => setConversionRate(e.target.value)}
          />
        </div>

        <input
          type="file"
          className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-gray-100"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800"
        >
          {loading ? "Processing..." : "Import CSV"}
        </button>
      </form>
    </div>
  );
};
export default UploadCard;
