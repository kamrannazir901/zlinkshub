import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  Send,
  MessageSquare,
  User,
  Loader2,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { submitContactForm } from "../../../services/authService";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => {
        setStatusMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const response = await submitContactForm(data);
      setStatusMessage({
        type: "success",
        text: response.data.message || "Message sent successfully!",
      });
      reset();
    } catch (error) {
      console.error("Submission error:", error);
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to send message.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#d81159]/20 focus:border-[#d81159] transition-all text-[15px] bg-gray-50/50 disabled:opacity-60 disabled:cursor-not-allowed";
  const labelClass =
    "flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 ml-1";
  const errorClass = "text-[#d81159] text-xs font-semibold mt-1 ml-2";

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#d81159] font-bold text-sm uppercase tracking-widest mb-4">
            <Mail size={16} />
            <span>Support Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Get in <span className="text-[#d81159]">Touch</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Have questions about our recommendations? Our team is here to help.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-gray-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d81159]/5 rounded-bl-full -mr-16 -mt-16"></div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div>
                <label className={labelClass}>
                  <User size={16} className="text-[#d81159]" /> Full Name
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  {...register("name", { required: "Name is required" })}
                  className={inputClass}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className={errorClass}>{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>
                  <Mail size={16} className="text-[#d81159]" /> Email Address
                </label>
                <input
                  type="email"
                  disabled={isSubmitting}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email",
                    },
                  })}
                  className={inputClass}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className={errorClass}>{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className={labelClass}>
                <Info size={16} className="text-[#d81159]" /> Subject
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                {...register("subject", { required: "Subject is required" })}
                className={inputClass}
                placeholder="How can we help?"
              />
              {errors.subject && (
                <p className={errorClass}>{errors.subject.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className={labelClass}>
                <MessageSquare size={16} className="text-[#d81159]" /> Your
                Message
              </label>
              <textarea
                rows="5"
                disabled={isSubmitting}
                {...register("message", { required: "Message is required" })}
                className={`${inputClass} resize-none`}
                placeholder="Tell us more about your inquiry..."
              />
              {errors.message && (
                <p className={errorClass}>{errors.message.message}</p>
              )}
            </div>

            {/* Status Message Box - Positioned Above Button */}
            {statusMessage.text && (
              <div
                className={`p-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${
                  statusMessage.type === "success"
                    ? "bg-emerald-50 border border-emerald-100 text-emerald-800 shadow-sm"
                    : "bg-red-50 border border-red-100 text-red-800 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  {statusMessage.type === "success" ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  <p className="text-sm font-semibold">{statusMessage.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusMessage({ type: "", text: "" })}
                  className="hover:bg-black/5 p-1 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-[16px] hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 group disabled:bg-gray-400 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  Send Message
                  <Send
                    size={18}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Typical response time:{" "}
            <span className="text-gray-900 font-bold">Within 24 hours</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
