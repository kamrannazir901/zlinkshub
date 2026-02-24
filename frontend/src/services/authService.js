import API from "./api";

export const login = (data) => API.post("/auth/login", data);

export const registerUser = (data) => API.post("/auth/register", data);

export const getProfile = () => API.get("/auth/me");
