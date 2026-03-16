import API from "./api";

// Fetch all unique API accounts with pagination and optional search
export const getAPIAccountsPaginated = (page = 1, limit = 10, search = "") =>
  API.get(
    `/affiliate-accounts/paginated?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
  );

// Fetch all unique API accounts
export const getAllAPIAccounts = () => API.get("/affiliate-accounts");

// Create new account with marketplace and unique applicationId
export const createAPIAccount = (data) => API.post("/affiliate-accounts", data);

// Delete account and cascade delete related tags
export const deleteAPIAccount = (id) => API.delete(`/affiliate-accounts/${id}`);
