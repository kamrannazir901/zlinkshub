import API from "./api";

export const login = (data) => API.post("/auth/login", data);

export const registerUser = (data) => API.post("/auth/register", data);

export const getProfile = () => API.get("/auth/me");

// Request reset link
export const forgotPassword = (data) => {
  return API.post("/auth/forgot-password", data);
};

// Reset password with token
export const resetPassword = (token, data) => {
  return API.post(`/auth/reset-password/${token}`, data);
};

// Submit contact form (Sends email to admin)
export const submitContactForm = (data) => {
  return API.post("/auth/contact", data);
};
