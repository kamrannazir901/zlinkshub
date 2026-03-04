import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllGuides, deleteGuide } from "../../../services/guideService";
import {
  BookOpen,
  Calendar,
  Tag,
  Trash2,
  Edit3,
  Plus,
  Loader2,
} from "lucide-react";

const AdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await fetchAllGuides(9);
      // Ensure we are setting the array correctly depending on your API response structure
      setGuides(Array.isArray(res.data) ? res.data : res.data.guides || []);
    } catch (err) {
      console.error("Failed to fetch guides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;

    if (
      window.confirm("Are you sure? This will permanently delete this guide.")
    ) {
      try {
        await deleteGuide(id);
        // Update state locally so the row disappears immediately
        setGuides((prevGuides) =>
          prevGuides.filter((guide) => guide._id !== id),
        );
      } catch (err) {
        console.error("Delete error:", err);
        alert(
          "Failed to delete the guide. Check if your backend route for DELETE /:id is set up.",
        );
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">
            Education Guides
          </h1>
          <p className="text-sm text-gray-500">
            Manage your expert buying guides, articles, and educational content
          </p>
        </div>
        <Link
          to="/admin/guides/new"
          className="w-full sm:w-auto text-center px-6 py-2.5 bg-[#d81159] text-white rounded-md hover:bg-black transition-all font-medium shadow-sm flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add New Guide
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Guide Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Read Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                {/* Fixed width for actions column to prevent misalignment */}
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 text-[#d81159] animate-spin" />
                      Loading guides...
                    </div>
                  </td>
                </tr>
              ) : guides.length > 0 ? (
                guides.map((guide) => (
                  <tr
                    key={guide._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-50 flex-shrink-0 flex items-center justify-center text-[#d81159]">
                          <BookOpen size={16} />
                        </div>
                        <span className="text-sm font-bold text-gray-900 truncate max-w-[200px] lg:max-w-xs">
                          {guide.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100 inline-flex items-center gap-1">
                        <Tag size={10} /> {guide.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="opacity-40" />
                        {guide.readTime || "5 min read"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {guide.createdAt
                        ? new Date(guide.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          to={`/admin/guides/${guide._id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit Guide"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(guide._id)}
                          className="text-[#d81159] hover:text-red-800 transition-colors"
                          title="Delete Guide"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500 italic"
                  >
                    No guides found. Click "Add New Guide" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminGuides;
