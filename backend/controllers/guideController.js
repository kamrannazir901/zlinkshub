import Guide from "../models/Guide.js";

// Helper to create slug
const createSlug = (text) =>
  text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

// CREATE
export const createGuide = async (req, res) => {
  try {
    const { title, content, category, readTime } = req.body;
    const slug = createSlug(title);

    const newGuide = new Guide({ title, slug, content, category, readTime });
    await newGuide.save();

    res
      .status(201)
      .json({ message: "Guide published successfully!", guide: newGuide });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating guide", error: error.message });
  }
};

// READ ALL
export const getAllGuides = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Search by title or category
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      lean: true,
    };

    const result = await Guide.paginate(query, options);

    res.json({
      guides: result.docs,
      totalDocs: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error("Guide Fetch Error:", error);
    res.status(500).json({ message: "Error fetching guides" });
  }
};
// READ ONE BY SLUG (Public View)
export const getGuideBySlug = async (req, res) => {
  try {
    const guide = await Guide.findOne({ slug: req.params.slug });
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: "Error fetching guide" });
  }
};

// READ ONE BY ID (Admin Edit View)
export const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: "Error fetching guide details" });
  }
};

// UPDATE
export const updateGuide = async (req, res) => {
  try {
    const { title, content, category, readTime } = req.body;

    // Check if title changed to update slug
    const updatedData = {
      title,
      content,
      category,
      readTime,
      slug: createSlug(title),
    };

    const guide = await Guide.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!guide) return res.status(404).json({ message: "Guide not found" });

    res.json({ message: "Guide updated successfully!", guide });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating guide", error: error.message });
  }
};

// DELETE
export const deleteGuide = async (req, res) => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.json({ message: "Guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting guide" });
  }
};
