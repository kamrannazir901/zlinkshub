import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");

      const res = await login(data);
      const userData = res.data;

      // Save token and user info
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Role-based redirect
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setApiError("Invalid email or password");
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-full max-w-md border border-gray/20 rounded-lg shadow-sm p-8">
        <h2 className="text-3xl font-bold text-black mb-2 text-center">
          Login
        </h2>
        <p className="text-gray text-center mb-6">
          Enter your credentials to access your dashboard
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* API Error */}
          {apiError && (
            <div className="bg-red-100 text-red-600 p-3 rounded text-sm">
              {apiError}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full border border-gray/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.email && (
              <p className="text-primary text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full border border-gray/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.password && (
              <p className="text-primary text-sm mt-1">
                {errors.password.message}
              </p>
            )}
            {/* ... inside the Password div ... */}
            <div className="flex justify-end mt-1">
              <Link
                to="/forgot-password"
                size="sm"
                className="text-xs text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* ... before the Submit Button ... */}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/80 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
