import AffiliateAPIAccount from "../models/AffiliateAPIAccount.js";
import TrackingTag from "../models/TrackingTag.js";
// Add new API account
export const addAPIAccount = async (req, res) => {
  try {
    const {
      appName,
      applicationId,
      credentialId,
      credentialSecret,
      version,
      marketplace,
    } = req.body;

    // Strict validation: all fields must be present as per our new plan
    if (
      !appName ||
      !applicationId ||
      !credentialId ||
      !credentialSecret ||
      !version ||
      !marketplace
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required to establish a connection" });
    }

    // Uniqueness check using the Application ID anchor
    const accountExists = await AffiliateAPIAccount.findOne({ applicationId });
    if (accountExists) {
      return res.status(400).json({
        message: "An account with this Application ID already exists",
      });
    }

    // Create account using the lean schema fields
    const account = await AffiliateAPIAccount.create({
      appName,
      applicationId,
      credentialId,
      credentialSecret,
      version,
      marketplace,
    });

    res.status(201).json(account);
  } catch (error) {
    // Handle database unique constraint errors or general failures
    res.status(500).json({ message: error.message });
  }
};

// List all accounts
export const getAllAPIAccounts = async (req, res) => {
  try {
    // Returns accounts sorted by newest first for better admin visibility
    const accounts = await AffiliateAPIAccount.find().sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAPIAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if the account exists
    const account = await AffiliateAPIAccount.findById(id);
    if (!account) {
      return res.status(404).json({ message: "API Account not found" });
    }

    // 2. Delete the API Account
    await AffiliateAPIAccount.findByIdAndDelete(id);

    // 3. Cascade Delete: Remove all tags linked to this specific account ID
    const deletedTagsCount = await TrackingTag.deleteMany({ apiAccount: id });

    res.json({
      message: "API Account and all associated tags deleted successfully",
      deletedTags: deletedTagsCount.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
