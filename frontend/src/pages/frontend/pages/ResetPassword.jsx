import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../../services/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await resetPassword(token, { password: data.password });
      setMessage({
        type: "success",
        text: "Password reset successful! Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Invalid or expired token.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center py-8">
      <div className="w-full max-w-md border border-gray/20 rounded-lg p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              className="w-full border rounded-md px-4 py-2"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                validate: (val) =>
                  watch("password") === val || "Passwords do not match",
              })}
              className="w-full border rounded-md px-4 py-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
