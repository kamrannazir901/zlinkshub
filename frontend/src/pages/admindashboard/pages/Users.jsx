import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../../services/userService";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    )
      return;
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
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
                        {user.tags?.length > 0 ? (
                          user.tags.map((tag) => (
                            <span
                              key={tag._id}
                              className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-black rounded uppercase border border-amber-200"
                            >
                              {tag.tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray italic">
                            No tags assigned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="text-black hover:text-primary transition-colors font-semibold"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(user._id)}
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
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray italic"
                  >
                    No users found. Click "Add New User" to get started.
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

export default Users;
