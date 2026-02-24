import User from "../models/User.js";
import TrackingTag from "../models/TrackingTag.js";
import AffiliateAPIAccount from "../models/AffiliateAPIAccount.js"; // CHECK THIS PATH

export const getAdminDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalApis, totalTags, unassignedTags, assignedUserIds] =
      await Promise.all([
        User.countDocuments(),
        AffiliateAPIAccount.countDocuments(),
        TrackingTag.countDocuments(),
        TrackingTag.countDocuments({ user: null }),
        TrackingTag.distinct("user", { user: { $ne: null } }),
      ]);

    const usersWithoutTags = totalUsers - assignedUserIds.length;

    res.json({
      totalUsers,
      totalApis,
      totalTags,
      unassignedTags,
      usersWithoutTags: usersWithoutTags < 0 ? 0 : usersWithoutTags,
    });
  } catch (error) {
    // This console log is your best friend right now
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: error.message }); // Send the message so we can see it in the browser
  }
};
