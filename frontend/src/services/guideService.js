import API from "./api";

/**
 * Public Routes
 */

// Fetch all guides for the library page
export const fetchAllGuides = (limit = 3) => {
  const url = limit ? `/guides?limit=${limit}` : "/guides";
  return API.get(url);
};
// Fetch a single guide by Slug (used for SEO-friendly public pages)
export const fetchGuideBySlug = (slug) => {
  return API.get(`/guides/${slug}`);
};

/**
 * Admin / System Routes
 */

// Fetch a single guide by ID (specifically for the Edit Form)
export const fetchGuideById = (id) => {
  return API.get(`/guides/id/${id}`);
};

// Create a new guide
export const publishGuide = (guideData) => {
  return API.post("/guides", guideData);
};

// Update an existing guide by ID
export const updateGuide = (id, guideData) => {
  return API.put(`/guides/${id}`, guideData);
};

// Optional: Delete a guide (matches the pattern of your other controllers)
export const deleteGuide = (id) => {
  return API.delete(`/guides/${id}`);
};
