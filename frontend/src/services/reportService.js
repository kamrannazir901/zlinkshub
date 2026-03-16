import API from "./api";

export const uploadEarningsCSV = (formData) =>
  API.post("/reports/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getReports = (params) => API.get("/reports", { params });

export const clearEarnings = (range) =>
  API.delete("/reports/clear", {
    data: range,
  });

export const clearAllDatabase = () => API.delete("/reports/clear-all");

export const getMyEarnings = (params) =>
  API.get("/reports/my-earnings", { params });

// Explicit Admin view
export const getAdminUserEarnings = (userId, params) =>
  API.get(`/reports/admin-view/${userId}`, { params });
