import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Password reset link sent to your email!");
    reset();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16">
      <div className="w-full max-w-md bg-white border border-gray/20 rounded-lg shadow-sm p-8">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-black mb-2 text-center">
          Forgot Password
        </h2>
        <p className="text-gray text-center mb-6">
          Enter your email and we’ll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email",
                },
              })}
              placeholder="Enter your email"
              className="w-full border border-gray/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.email && (
              <p className="text-primary text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/80 transition"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
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
