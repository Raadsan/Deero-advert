import Portfolio from "../models/PortfolioModel.js";

// ➕ Create Portfolio
export const createPortfolio = async (req, res) => {
  try {
    const { title, description, industry, Industry, year, Year } = req.body;
    const finalIndustry = industry || Industry;
    const finalYear = year || Year;

    if (!req.files?.mainImage) {
      return res.status(400).json({
        message: "Main image is required",
      });
    }

    const mainImage = req.files.mainImage[0].path;
    const galleryImages = req.files.gallery?.map((file) => file.path) || [];

    const portfolio = await Portfolio.create({
      title,
      description,
      industry: finalIndustry,
      year: finalYear,
      mainImage,
      gallery: galleryImages,
    });

    res.status(201).json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get all portfolios
export const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    res.json({ success: true, count: portfolios.length, portfolios });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }
    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 Update Portfolio (mainImage optional, add new gallery images)
export const updatePortfolio = async (req, res) => {
  try {
    const { title, description, industry, Industry, year, Year } = req.body;
    const finalIndustry = industry || Industry;
    const finalYear = year || Year;

    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    // update title if provided
    if (title) portfolio.title = title;

    // update description if provided
    if (description) portfolio.description = description;

    // update industry if provided
    if (finalIndustry) portfolio.industry = finalIndustry;

    // update year if provided
    if (finalYear) portfolio.year = finalYear;

    // replace mainImage if uploaded
    // With upload.any(), files are in req.files as array, filter by fieldname
    const mainImageFile = req.files?.find((file) => file.fieldname === "mainImage");
    if (mainImageFile) {
      portfolio.mainImage = mainImageFile.path;
    }

    // append new gallery images if uploaded
    const galleryFiles = req.files?.filter((file) => file.fieldname === "gallery") || [];
    if (galleryFiles.length > 0) {
      const newImages = galleryFiles.map((file) => file.path);
      portfolio.gallery = portfolio.gallery.concat(newImages);
    }

    await portfolio.save();
    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑 Delete Portfolio
export const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    await portfolio.deleteOne();
    res.json({ success: true, message: "Portfolio deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑 Delete single gallery image
export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imagePath } = req.body;

    const portfolio = await Portfolio.findById(id);
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    // Remove image by filtering out the matching path
    portfolio.gallery = portfolio.gallery.filter(img => img !== imagePath);
    await portfolio.save();

    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
