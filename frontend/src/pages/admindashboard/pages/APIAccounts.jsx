import { useEffect, useState } from "react";
import {
  getAPIAccountsPaginated,
  deleteAPIAccount,
} from "../../../services/affiliateService";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import { Search } from "lucide-react";

const APIAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Separation of concerns
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const fetchAccounts = async (pageNumber, searchTerm) => {
    try {
      setLoading(true);
      // Ensure your service uses the params: page, limit, search
      const res = await getAPIAccountsPaginated(pageNumber, 10, searchTerm);
      setAccounts(res.data.accounts || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      console.error("Failed to fetch API accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setActiveSearch(search);
    setPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    fetchAccounts(page, activeSearch);
  }, [page, activeSearch]);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure? This will also delete all associated tracking tags.",
      )
    ) {
      try {
        await deleteAPIAccount(id);
        fetchAccounts(page, activeSearch);
      } catch (err) {
        alert("Failed to delete account");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">API Accounts</h1>
          <p className="text-sm text-gray">
            Manage Amazon Creator API credentials
          </p>
        </div>
        <Link
          to="/admin/api-accounts/new"
          className="w-full sm:w-auto text-center px-6 py-2.5 bg-primary text-white rounded-md hover:opacity-90 transition-all font-medium shadow-sm"
        >
          Add New Account
        </Link>
      </div>

      {/* Search Bar */}
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
            placeholder="Search by app name or app id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full pl-9 pr-3 py-1.5 border border-gray/20 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray/10">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  Marketplace
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  App ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  Version
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
                    Loading accounts...
                  </td>
                </tr>
              ) : accounts.length > 0 ? (
                accounts.map((acc) => (
                  <tr
                    key={acc._id}
                    className="hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">
                        {acc.appName}
                      </div>
                      <div className="text-xs text-gray/70 truncate max-w-[150px]">
                        {acc.credentialId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium bg-amber-100 text-black rounded-full border border-amber-200">
                        {acc.marketplace}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray">
                      {acc.applicationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray">
                      {acc.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(acc._id)}
                        className="text-primary hover:opacity-70 transition-colors ml-4"
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
                    No accounts found.
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

export default APIAccounts;
