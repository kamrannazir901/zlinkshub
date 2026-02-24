import { useEffect, useState } from "react";
import { getTags, deleteTag } from "../../../services/tagService";
import { Link } from "react-router-dom";

const TrackingTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await getTags();
      setTags(res.data);
    } catch (err) {
      console.error("Failed to fetch tracking tags:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure? This will permanently remove this tag assignment.",
      )
    ) {
      try {
        await deleteTag(id);
        setTags(tags.filter((tag) => tag._id !== id));
      } catch (err) {
        alert("Failed to delete the tag.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">Tracking Tags</h1>
          <p className="text-sm text-gray">
            Link Tags to creators and API locales
          </p>
        </div>
        <Link
          to="/admin/tracking-tags/new"
          className="w-full sm:w-auto text-center px-6 py-2.5 bg-primary text-white rounded-md hover:opacity-90 transition-all font-medium shadow-sm"
        >
          Add New Tag
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray/10">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  Marketplace
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  Assigned User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  API Account
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray/10 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray">
                    Loading tags...
                  </td>
                </tr>
              ) : tags.length > 0 ? (
                tags.map((tag) => (
                  <tr
                    key={tag._id}
                    className="hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-black">
                        {tag.tag}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium bg-amber-100 text-black rounded-full border border-amber-200">
                        {tag.marketplace}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">
                        {tag.user?.name || "Unassigned"}
                      </div>
                      <div className="text-xs text-gray">{tag.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray">
                      {tag.apiAccount?.appName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(tag._id)}
                        className="text-primary hover:opacity-70 transition-colors ml-4 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray italic"
                  >
                    No tracking tags assigned.
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

export default TrackingTags;
