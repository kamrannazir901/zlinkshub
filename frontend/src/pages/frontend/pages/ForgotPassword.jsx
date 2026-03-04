import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../../services/authService"; // Import the service

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiMessage({ type: "", text: "" });

      // Call the backend API
      const res = await forgotPassword(data);

      setApiMessage({
        type: "success",
        text: "If an account exists with that email, a reset link has been sent!",
      });
      reset();
    } catch (err) {
      setApiMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center py-8">
      <div className="w-full max-w-md bg-white border border-gray/20 rounded-lg shadow-sm p-8">
        <h2 className="text-3xl font-bold text-black mb-2 text-center">
          Forgot Password
        </h2>
        <p className="text-gray text-[15px] text-center mb-6">
          Enter your email and we’ll send you a password reset link.
        </p>

        {/* Status Messages */}
        {apiMessage.text && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              apiMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {apiMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              disabled={loading}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email",
                },
              })}
              placeholder="Enter your email"
              className="w-full border border-gray/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:bg-gray-50"
            />
            {errors.email && (
              <p className="text-primary text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/80 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
