import { useEffect, useState } from "react";
import {
  getAllAPIAccounts,
  deleteAPIAccount,
} from "../../../services/affiliateService";
import { Link } from "react-router-dom";

const APIAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await getAllAPIAccounts();
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to fetch API accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure? This will also delete all associated tracking tags.",
      )
    ) {
      try {
        await deleteAPIAccount(id);
        setAccounts(accounts.filter((acc) => acc._id !== id));
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

      {/* Responsive Table */}
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
                      <div className="text-xs text-gray/70 truncate max-w-37.5">
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
      </div>
    </div>
  );
};

export default APIAccounts;
