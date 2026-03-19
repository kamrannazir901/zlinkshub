import User from "../models/User.js";
import TrackingTag from "../models/TrackingTag.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, tags, payoutPercentage } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Validate Tag Uniqueness
    let tagsToAssign = [];
    if (tags?.length > 0) {
      const foundTags = await TrackingTag.find({ _id: { $in: tags } });
      const seenApiAccounts = new Set();
      tagsToAssign = foundTags
        .filter((tag) => {
          const apiId = tag.apiAccount.toString();
          if (seenApiAccounts.has(apiId)) return false;
          seenApiAccounts.add(apiId);
          return true;
        })
        .map((t) => t._id);
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      payoutPercentage: parseFloat(payoutPercentage) || 100,
    });

    if (tagsToAssign.length > 0) {
      await TrackingTag.updateMany(
        { _id: { $in: tagsToAssign } },
        { $set: { user: user._id } },
      );
    }

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error during user creation" });
  }
};

// GET ALL USERS (Optimized to 2 queries total)
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Create query object for search
    const query = search
      ? {
          $or: [
            { name: { $regex: new RegExp(search, "i") } },
            { email: { $regex: new RegExp(search, "i") } },
          ],
        }
      : {};

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true,
    };
    const userResult = await User.paginate(query, options);

    const userIds = userResult.docs.map((u) => u._id);
    const allTags = await TrackingTag.find({ user: { $in: userIds } }).lean();

    const usersWithTags = userResult.docs.map((user) => ({
      ...user,
      tags: allTags.filter(
        (tag) => tag.user?.toString() === user._id.toString(),
      ),
    }));

    res.json({
      usersWithTags,
      totalDocs: userResult.totalDocs,
      page: userResult.page,
      totalPages: userResult.totalPages,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const tags = await TrackingTag.find({ user: user._id })
      .populate("apiAccount", "appName")
      .lean();

    res.json({ ...user, tags });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role, tags, payoutPercentage } = req.body;
    const userId = req.params.id;

    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    // Validate Tags
    let tagsToAssign = [];
    if (tags?.length > 0) {
      const foundTags = await TrackingTag.find({ _id: { $in: tags } });
      const seenApiAccounts = new Set();
      tagsToAssign = foundTags
        .filter((tag) => {
          const apiId = tag.apiAccount.toString();
          if (seenApiAccounts.has(apiId)) return false;
          seenApiAccounts.add(apiId);
          return true;
        })
        .map((t) => t._id);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        role,
        payoutPercentage: parseFloat(payoutPercentage) || 100,
      },
      { returnDocument: "after" }, // Modern Mongoose option
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // Sync Tags
    await TrackingTag.updateMany({ user: userId }, { $set: { user: null } });
    if (tagsToAssign.length > 0) {
      await TrackingTag.updateMany(
        { _id: { $in: tagsToAssign } },
        { $set: { user: userId } },
      );
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Update failed", details: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.email === process.env.ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ message: "Cannot delete the System Admin." });
    }

    // Release tags back to the pool
    await TrackingTag.updateMany({ user: userId }, { $set: { user: null } });
    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted and tags freed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
