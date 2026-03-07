import API from "./api";

export const getPublicLink = (id) => API.get(`/links/product/${id}`);

export const getAllPublicLinks = (limit = 8) =>
  API.get("/links/products/feed", {
    params: { limit },
  });

export const generateLink = (data) => API.post("/links/generate", data);

export const getUserLinks = () => API.get("/links");

export const deleteLink = (id) => API.delete(`/links/${id}`);
