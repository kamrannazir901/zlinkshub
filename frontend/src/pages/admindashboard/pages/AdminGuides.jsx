import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllGuides, deleteGuide } from "../../../services/guideService";
import Pagination from "../../../components/Pagination";
import {
  BookOpen,
  Calendar,
  Trash2,
  Edit3,
  Plus,
  Search,
  Loader2,
} from "lucide-react";

const AdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const fetchGuides = async (pageNumber, searchTerm) => {
    setLoading(true);
    try {
      const res = await fetchAllGuides(pageNumber, 10, searchTerm);
      const data = res.data;
      setGuides(data.guides || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
    } catch (err) {
      console.error("Failed to fetch guides:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setActiveSearch(search);
    setPage(1);
  };

  useEffect(() => {
    fetchGuides(page, activeSearch);
  }, [page, activeSearch]);

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure? This will permanently delete this guide.")
    ) {
      try {
        await deleteGuide(id);
        fetchGuides(page, activeSearch);
      } catch (err) {
        alert("Failed to delete the guide.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">
            Education Guides
          </h1>
          <p className="text-sm text-gray">
            Manage your expert buying guides and articles
          </p>
        </div>
        <Link
          to="/admin/guides/new"
          className="px-6 py-2.5 bg-[#d81159] text-white rounded-md hover:opacity-90 font-medium"
        >
          Add New Guide
        </Link>
      </div>

      {/* Search Bar matching TrackingTags */}
      <div className="mb-4 relative w-full sm:w-60">
        <div
          className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
          onClick={handleSearch}
        >
          <Search className="h-3.5 w-3.5 text-gray" />
        </div>
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="block w-full pl-9 pr-3 py-1.5 border border-gray/20 rounded-md text-xs focus:ring-1 focus:ring-[#d81159]"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray/10">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase">
                  Guide Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase">
                  Read Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase">
                  Created At
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray">
                    Loading guides...
                  </td>
                </tr>
              ) : guides.length > 0 ? (
                guides.map((guide) => (
                  <tr key={guide._id} className="hover:bg-amber-50/30">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">
                      {guide.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {guide.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray">
                      {guide.readTime || "5 min"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray">
                      {new Date(guide.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          to={`/admin/guides/${guide._id}`}
                          className="text-[#d81159]"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(guide._id)}
                          className="text-black"
                          title="Delete"
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
                    className="px-6 py-12 text-center text-gray italic"
                  >
                    No guides found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AdminGuides;
