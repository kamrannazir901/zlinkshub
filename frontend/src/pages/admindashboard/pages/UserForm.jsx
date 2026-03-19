import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserById,
  createUser,
  updateUser,
  searchTags,
} from "../../../services/userService";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    payoutPercentage: 100,
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      const fetchUserData = async () => {
        try {
          const res = await getUserById(id);
          const data = res.data || res;
          setFormData({
            name: data.name || "",
            email: data.email || "",
            role: data.role || "user",
            payoutPercentage: data.payoutPercentage || 100,
          });
          setSelectedTags(data.tags || []);
        } catch (err) {
          setError("Could not load user data. Please refresh.");
        }
      };
      fetchUserData();
    }
  }, [id, isEdit]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        try {
          const res = await searchTags(searchTerm);
          const data = res.data || res;
          setSearchResults(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Search failed", err);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const addTag = (tag) => {
    setError("");
    const hasExistingApiTag = selectedTags.find(
      (t) => t.apiAccount?._id === tag.apiAccount?._id,
    );

    if (hasExistingApiTag) {
      setError(`A tag from "${tag.apiAccount?.appName}" is already assigned.`);
      return;
    }

    if (!selectedTags.find((t) => t._id === tag._id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  const removeTag = (tagId) => {
    setSelectedTags(selectedTags.filter((t) => t._id !== tagId));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...formData,
      tags: selectedTags.map((t) => t._id),
    };

    try {
      if (isEdit) {
        await updateUser(id, payload);
      } else {
        await createUser(payload);
      }
      navigate("/admin/users");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while saving.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg border border-gray/20 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="px-8 py-6 border-b border-gray/10 bg-gray-50/50">
          <h1 className="text-2xl font-bold text-black">
            {isEdit ? "Update Creator" : "Create New Creator"}
          </h1>
          <p className="text-sm text-gray mt-1">
            Fill in the details and assign tracking tags to this user.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          {/* Identity Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-black uppercase mb-2 tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                className="border border-gray/30 rounded-md px-4 py-2.5 focus:border-primary outline-none transition text-sm"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-black uppercase mb-2 tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                className="border border-gray/30 rounded-md px-4 py-2.5 focus:border-primary outline-none transition text-sm"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-black uppercase mb-2 tracking-wider">
                Payout Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  className="w-full border border-gray/30 rounded-md px-4 py-2.5 focus:border-primary outline-none transition text-sm"
                  placeholder="e.g. 80"
                  value={formData.payoutPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payoutPercentage: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {!isEdit && (
            <div className="flex flex-col">
              <label className="text-xs font-bold text-black uppercase mb-2 tracking-wider">
                Temporary Password
              </label>
              <input
                type="password"
                required
                className="border border-gray/30 rounded-md px-4 py-2.5 focus:border-primary outline-none transition text-sm"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          )}

          <hr className="border-gray/10" />

          {/* Tags Section */}
          <div className="space-y-4">
            <div className="relative">
              <label className="text-xs font-bold text-black uppercase mb-2 block tracking-wider">
                Assign Tracking Tags
              </label>
              <input
                type="text"
                className="w-full border border-gray/30 rounded-md px-4 py-2.5 focus:border-primary outline-none transition text-sm bg-gray-50/30"
                placeholder="Type tag name to search (e.g. mystore-20)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Search Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray/20 rounded-md shadow-xl max-h-60 overflow-auto">
                  {searchResults.map((tag) => (
                    <button
                      key={tag._id}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="w-full text-left px-4 py-3 hover:bg-amber-50 flex justify-between items-center border-b border-gray/5 last:border-0 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-sm text-black block">
                          {tag.tag}
                        </span>
                        <span className="text-[10px] text-gray uppercase">
                          {tag.marketplace}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded">
                        {tag.apiAccount?.appName}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Tags Display */}
            <div className="bg-amber-50/50 p-6 rounded-lg border border-amber-100">
              <p className="text-[10px] font-black text-gray uppercase mb-4 tracking-widest">
                Currently Assigned Tags
              </p>
              <div className="flex flex-wrap gap-3">
                {selectedTags.map((tag) => (
                  <div
                    key={tag._id}
                    className="bg-white border border-amber-200 flex items-center pl-4 pr-2 py-1.5 rounded-md shadow-sm"
                  >
                    <span className="font-bold text-sm text-black">
                      {tag.tag}
                    </span>
                    <span className="ml-2 text-[10px] font-medium bg-amber-100 text-black px-1.5 rounded uppercase">
                      {tag.apiAccount?.appName}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag._id)}
                      className="ml-3 w-5 h-5 flex items-center justify-center rounded-full hover:bg-primary hover:text-white text-gray transition-all text-lg leading-none"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {selectedTags.length === 0 && (
                  <p className="text-sm italic text-gray/60">
                    No tags assigned yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-6 pt-6 border-t border-gray/10">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="text-sm font-bold text-gray hover:text-black transition-colors"
            >
              Back to List
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-white rounded-md font-bold hover:opacity-90 transition disabled:opacity-50 shadow-md shadow-primary/20"
            >
              {loading ? "Saving..." : isEdit ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
