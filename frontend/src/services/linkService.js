import API from "./api";

export const getPublicLink = (id) => API.get(`/links/product/${id}`);

export const getAllPublicLinks = () => API.get("/links/products/feed");

export const generateLink = (data) => API.post("/links/generate", data);

export const getUserLinks = () => API.get("/links");

export const deleteLink = (id) => API.delete(`/links/${id}`);

export const testAmazonConnection = () => API.get("/links/test-connection");
