import User from "../models/User.js";
import TrackingTag from "../models/TrackingTag.js";
import AffiliateAPIAccount from "../models/AffiliateAPIAccount.js";
import Guide from "../models/Guide.js"; // Import your Guide model

export const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalApis,
      totalTags,
      unassignedTags,
      assignedUserIds,
      totalGuides, // New addition
    ] = await Promise.all([
      User.countDocuments(),
      AffiliateAPIAccount.countDocuments(),
      TrackingTag.countDocuments(),
      TrackingTag.countDocuments({ user: null }),
      TrackingTag.distinct("user", { user: { $ne: null } }),
      Guide.countDocuments(), // Fetch guide count directly
    ]);

    const usersWithoutTags = totalUsers - assignedUserIds.length;

    res.json({
      totalUsers,
      totalApis,
      totalTags,
      unassignedTags,
      totalGuides, // Send this to the frontend
      usersWithoutTags: usersWithoutTags < 0 ? 0 : usersWithoutTags,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};
