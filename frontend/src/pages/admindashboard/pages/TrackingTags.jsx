import { useEffect, useState } from "react";
import { getTags, deleteTag } from "../../../services/tagService";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import { Search } from "lucide-react";

const TrackingTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const fetchTags = async (pageNumber, searchTerm) => {
    setLoading(true);
    try {
      // Explicitly convert searchTerm to string here as well just to be safe
      const res = await getTags(pageNumber, 10, String(searchTerm || ""));
      setTags(res.data.tags || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setActiveSearch(search);
    setPage(1);
  };

  useEffect(() => {
    fetchTags(page, activeSearch);
  }, [page, activeSearch]);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure? This will permanently remove this tag assignment.",
      )
    ) {
      try {
        await deleteTag(id);
        fetchTags(page, activeSearch);
      } catch (err) {
        alert("Failed to delete the tag.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">Tracking Tags</h1>
          <p className="text-sm text-gray">Link Tags to affiliate accounts</p>
        </div>
        <Link
          to="/admin/tracking-tags/new"
          className="px-6 py-2.5 bg-primary text-white rounded-md hover:opacity-90 font-medium"
        >
          Add New Tag
        </Link>
      </div>

      <div className="mb-4 relative w-full sm:w-60">
        <div
          className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
          onClick={handleSearch}
        >
          <Search className="h-3.5 w-3.5 text-gray" />
        </div>
        <input
          type="text"
          placeholder="Search tags, users, or apps..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="block w-full pl-9 pr-3 py-1.5 border border-gray/20 rounded-md text-xs focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Table Wrapper with horizontal scroll */}
      <div className="bg-white rounded-lg border border-gray/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray/10">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase">
                  Tag
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase">
                  Marketplace
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase">
                  Assigned User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase">
                  API Account
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray uppercase">
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
                  <tr key={tag._id} className="hover:bg-amber-50/30">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">
                      {tag.tag}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-amber-100 rounded-full">
                        {tag.marketplace}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tag.user?.name || "Unassigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tag.apiAccount?.appName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(tag._id)}
                        className="text-primary font-semibold"
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
                    No tags found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination stays outside the overflow container */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};

export default TrackingTags;
