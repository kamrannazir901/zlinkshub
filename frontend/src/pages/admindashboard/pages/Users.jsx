import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../../services/userService";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import { Search, BarChart3, FileText } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Separation of concerns: live input vs. committed search
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const fetchUsers = async (pageNumber, searchTerm) => {
    try {
      setLoading(true);
      const res = await getUsers(pageNumber, 10, searchTerm);
      setUsers(res.data.usersWithTags || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setActiveSearch(search);
    setPage(1); // Always reset to page 1 on new search
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Trigger fetch whenever the page or the committed activeSearch changes
  useEffect(() => {
    fetchUsers(page, activeSearch);
  }, [page, activeSearch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      fetchUsers(page, activeSearch);
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">Users</h1>
          <p className="text-sm text-gray">
            Manage creator accounts and their assigned tracking tags
          </p>
        </div>
        <Link
          to="/admin/users/new"
          className="w-full sm:w-auto text-center px-6 py-2.5 bg-primary text-white rounded-md hover:opacity-90 transition-all font-medium shadow-sm shadow-primary/20"
        >
          Add New User
        </Link>
      </div>

      {/* Search Bar - Controlled by handleSearch */}
      <div className="mb-4">
        <div className="relative w-full sm:w-60">
          <div
            className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer hover:text-primary transition-colors"
            onClick={handleSearch}
          >
            <Search className="h-3.5 w-3.5 text-gray" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full pl-9 pr-3 py-1.5 border border-gray/20 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray/10">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  Creator Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  Assigned Tags
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray/10 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray">
                    Loading users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-black">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.tags?.map((tag) => (
                          <span
                            key={tag._id}
                            className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-black rounded uppercase border border-amber-200"
                          >
                            {tag.tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        {/* Earnings Link */}
                        <Link
                          to={`/admin/reports/user-earnings?userId=${user._id}`}
                          className="text-gray-400 hover:text-primary transition-colors flex items-center"
                          title="View Earnings"
                        >
                          <FileText className="h-4 w-4" />
                        </Link>

                        {/* Edit Link */}
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="text-black hover:text-primary transition-colors font-semibold"
                        >
                          Edit
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-primary hover:opacity-70 transition-colors font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray italic"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};

export default Users;
