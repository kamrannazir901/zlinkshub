import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/authService";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");

      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...submitData } = data;

      const res = await registerUser(submitData);

      // Save token for auto-login
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      reset();

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 400) {
        setApiError(err.response.data.message || "User already exists");
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16">
      <div className="w-full max-w-md bg-white border border-gray/20 rounded-lg shadow-sm p-8">
        <h2 className="text-3xl font-bold text-black mb-2 text-center">
          Sign Up
        </h2>
        <p className="text-gray text-center mb-6">
          Create your Affilvio account and start earning commissions
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* API Error */}
          {apiError && (
            <div className="bg-red-100 text-red-600 p-3 rounded text-sm">
              {apiError}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Full Name is required" })}
              className="w-full border border-gray/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.name && (
              <p className="text-primary text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
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
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full border border-gray/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.password && (
              <p className="text-primary text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full border border-gray/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.confirmPassword && (
              <p className="text-primary text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/80 transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
