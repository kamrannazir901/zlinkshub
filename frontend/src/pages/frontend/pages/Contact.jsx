import React from "react";
import { useForm } from "react-hook-form";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Message sent successfully!");
    reset();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black">Contact Us</h2>
          <p className="text-gray mt-3">
            Have questions about Affilvio? Send us a message and we’ll respond
            soon.
          </p>
        </div>

        {/* Form Card */}
        <div className=" border border-gray/20 rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full border border-gray/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-primary text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                className="w-full border border-gray/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-primary text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Message
              </label>
              <textarea
                rows="5"
                {...register("message", { required: "Message is required" })}
                className="w-full border border-gray/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Write your message..."
              />
              {errors.message && (
                <p className="text-primary text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/80 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
