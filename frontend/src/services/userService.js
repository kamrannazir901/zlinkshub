import API from "./api";

export const getUsers = (page = 1, limit = 20, search = "") =>
  API.get(`/users?page=${page}&limit=${limit}&search=${search}`);

// Renamed to match the call in the Form (getUserById)
export const getUserById = (id) => API.get(`/users/${id}`);

export const createUser = (data) => API.post("/users", data);

export const updateUser = (id, data) => API.put(`/users/${id}`, data);

export const deleteUser = (id) => API.delete(`/users/${id}`);

/**
 * Searches for tags that are unassigned (user: null)
 * @param {string} query - The search term for the tag name
 */
export const searchTags = (query) =>
  API.get(`/tracking-tags/search?query=${query}`);

export const getStats = () => API.get("/users/stats");
