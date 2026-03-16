import API from "./api";

// Fetch all tags for the Admin list
export const getTags = (page = 1, limit = 10, search = "") =>
  API.get(
    `/tracking-tags?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
  );
// Fetch a single tag by ID
export const getTagById = (id) => API.get(`/tracking-tags/${id}`);

// Search unassigned tags (used in the UserForm or search bars)
export const searchTags = (query) =>
  API.get("/tracking-tags/search", {
    params: { query },
  });

// Create a new tracking tag assignment
export const createTag = (data) => API.post("/tracking-tags", data);

// Delete a tag permanently
export const deleteTag = (id) => API.delete(`/tracking-tags/${id}`);
