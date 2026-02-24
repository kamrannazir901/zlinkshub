import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createAPIAccount } from "../../../services/affiliateService";

const AddAPIAccount = () => {
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
      await createAPIAccount(data);
      navigate("/admin/api-accounts");
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Error saving account details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg border border-gray/20 shadow-sm">
      <h1 className="text-2xl font-bold text-black mb-2">Connect Amazon API</h1>
      <p className="text-sm text-gray mb-8">
        Enter required credentials to enable locale-based link building.
      </p>

      {apiError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-100 text-sm">
          {apiError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5"
      >
        {/* App Nickname */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Account Nickname
          </label>
          <input
            type="text"
            placeholder="e.g. US Electronics"
            {...register("appName", { required: "Nickname is required" })}
            className={`w-full border rounded-md px-4 py-3 outline-none transition ${errors.appName ? "border-red-500" : "border-gray focus:border-primary"}`}
          />
          {errors.appName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.appName.message}
            </span>
          )}
        </div>

        {/* Application ID */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Application ID
          </label>
          <input
            type="text"
            placeholder="Unique App ID from Amazon Console"
            {...register("applicationId", {
              required: "Application ID is required",
            })}
            className={`w-full border rounded-md px-4 py-3 outline-none transition ${errors.applicationId ? "border-red-500" : "border-gray focus:border-primary"}`}
          />
          {errors.applicationId && (
            <span className="text-red-500 text-xs mt-1">
              {errors.applicationId.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Marketplace */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Marketplace Host
            </label>
            <input
              type="text"
              placeholder="www.amazon.com"
              {...register("marketplace", {
                required: "Marketplace is required",
              })}
              className={`w-full border rounded-md px-4 py-3 outline-none transition ${errors.marketplace ? "border-red-500" : "border-gray focus:border-primary"}`}
            />
            {errors.marketplace && (
              <span className="text-red-500 text-xs mt-1">
                {errors.marketplace.message}
              </span>
            )}
          </div>

          {/* API Version */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              SDK Version
            </label>
            <input
              type="text"
              placeholder="e.g. 2.1"
              {...register("version", { required: "Version is required" })}
              className={`w-full border rounded-md px-4 py-3 outline-none transition ${errors.version ? "border-red-500" : "border-gray focus:border-primary"}`}
            />
            {errors.version && (
              <span className="text-red-500 text-xs mt-1">
                {errors.version.message}
              </span>
            )}
          </div>
        </div>

        {/* Credential ID */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Credential ID
          </label>
          <input
            type="text"
            {...register("credentialId", {
              required: "Credential ID is required",
            })}
            className={`w-full border rounded-md px-4 py-3 outline-none transition ${errors.credentialId ? "border-red-500" : "border-gray focus:border-primary"}`}
          />
          {errors.credentialId && (
            <span className="text-red-500 text-xs mt-1">
              {errors.credentialId.message}
            </span>
          )}
        </div>

        {/* Credential Secret */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Credential Secret
          </label>
          <input
            type="password"
            {...register("credentialSecret", {
              required: "Secret key is required",
            })}
            className={`w-full border rounded-md px-4 py-3 outline-none transition ${errors.credentialSecret ? "border-red-500" : "border-gray focus:border-primary"}`}
          />
          {errors.credentialSecret && (
            <span className="text-red-500 text-xs mt-1">
              {errors.credentialSecret.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-4 bg-primary text-white rounded-md font-bold hover:opacity-90 transition disabled:opacity-50 shadow-sm"
        >
          {loading ? "Saving Credentials..." : "Save Connection"}
        </button>
      </form>
    </div>
  );
};

export default AddAPIAccount;
