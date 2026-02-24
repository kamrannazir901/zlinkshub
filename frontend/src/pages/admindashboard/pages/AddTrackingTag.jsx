import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllAPIAccounts } from "../../../services/affiliateService";
import { createTag } from "../../../services/tagService";

const AddTrackingTag = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiAccounts, setApiAccounts] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await getAllAPIAccounts();
        setApiAccounts(res.data);
      } catch (err) {
        console.error("Failed to fetch API accounts:", err);
      }
    };
    fetchAccounts();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");

      // Logic moved to controller: Just send tag and apiAccountId
      await createTag(data);

      navigate("/admin/tracking-tags");
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg border border-gray/20 shadow-sm">
      <h1 className="text-2xl font-bold text-black mb-2">
        Create Tracking Tag
      </h1>
      <p className="text-sm text-gray mb-8">
        Enter a Tag and select the corresponding API credentials.
      </p>

      {apiError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-100 text-sm">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Store Tag */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Tag
          </label>
          <input
            type="text"
            placeholder="e.g. mystore-20"
            {...register("tag", { required: "Store Tag is required" })}
            className={`w-full border rounded-md px-4 py-3 outline-none transition ${
              errors.tag ? "border-red-500" : "border-gray focus:border-primary"
            }`}
          />
          {errors.tag && (
            <p className="text-red-500 text-xs mt-1">{errors.tag.message}</p>
          )}
        </div>

        {/* API Account Selection */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            API Account
          </label>
          <select
            {...register("apiAccountId", {
              required: "API Account is required",
            })}
            className={`w-full border rounded-md px-4 py-3 outline-none transition bg-white ${
              errors.apiAccountId
                ? "border-red-500"
                : "border-gray focus:border-primary"
            }`}
          >
            <option value="">Select API Credentials</option>
            {apiAccounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.appName} ({acc.marketplace})
              </option>
            ))}
          </select>
          {errors.apiAccountId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.apiAccountId.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white rounded-md font-bold hover:opacity-90 transition disabled:opacity-50 shadow-sm"
        >
          {loading ? "Creating..." : "Create Tracking Tag"}
        </button>
      </form>
    </div>
  );
};

export default AddTrackingTag;
