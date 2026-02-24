import TrackingTag from "../models/TrackingTag.js";
import AffiliateAPIAccount from "../models/AffiliateAPIAccount.js";

// Add Tag (Automatically attaches marketplace)
export const addTag = async (req, res) => {
  try {
    const { tag, apiAccountId } = req.body;

    if (!tag || !apiAccountId) {
      return res
        .status(400)
        .json({ message: "Tag and API Account are required" });
    }

    const account = await AffiliateAPIAccount.findById(apiAccountId);
    if (!account)
      return res.status(404).json({ message: "API Account not found" });

    const existingTag = await TrackingTag.findOne({ tag });
    if (existingTag)
      return res.status(400).json({ message: "This Tag is already in use" });

    const newTag = await TrackingTag.create({
      tag,
      apiAccount: apiAccountId,
      marketplace: account.marketplace,
      user: null,
    });

    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List all tags
export const getAllTags = async (req, res) => {
  try {
    const tags = await TrackingTag.find()
      .populate("user", "name email")
      .populate("apiAccount", "appName"); // Simplified population
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single tag
export const getTagById = async (req, res) => {
  try {
    const tag = await TrackingTag.findById(req.params.id)
      .populate("user", "name email")
      .populate("apiAccount", "appName");
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchTags = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const tags = await TrackingTag.find({
      tag: { $regex: query, $options: "i" },
      user: null,
    })
      .limit(10)
      .populate("apiAccount", "appName");

    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a tag
export const deleteTag = async (req, res) => {
  try {
    const deletedTag = await TrackingTag.findByIdAndDelete(req.params.id);
    if (!deletedTag) return res.status(404).json({ message: "Tag not found" });
    res.json({ message: "Tracking tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
