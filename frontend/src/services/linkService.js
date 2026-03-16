import API from "./api";

export const getPublicLink = (id) => API.get(`/links/product/${id}`);

export const getAllPublicLinks = (limit = 8) =>
  API.get("/links/products/feed", {
    params: { limit },
  });

export const generateLink = (data) => API.post("/links/generate", data);

export const getUserLinks = (page = 1, limit = 10) => {
  return API.get(`/links?page=${page}&limit=${limit}`);
};

export const deleteLink = (id) => API.delete(`/links/${id}`);
