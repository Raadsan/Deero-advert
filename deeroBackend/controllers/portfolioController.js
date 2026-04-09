import { prisma } from "../lib/prisma.js";

// ➕ Create Portfolio
export const createPortfolio = async (req, res) => {
  try {
    let { title, description, industry, Industry, year, Year, projectDirection } = req.body;
    const finalIndustry = industry || Industry;
    const finalYear = year || Year;

    if (typeof projectDirection === 'string') {
      try {
        projectDirection = JSON.parse(projectDirection);
      } catch (e) {
        projectDirection = projectDirection.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    if (!req.files || (!req.files.mainImage && !req.files['mainImage'])) {
        // Fallback for different multer styles
    }

    const mainImageFile = req.files?.mainImage?.[0] || req.files?.['mainImage']?.[0];
    if (!mainImageFile) {
        return res.status(400).json({ message: "Main image is required" });
    }

    const mainImagePath = mainImageFile.path.replace(/\\/g, "/");
    
    const galleryFiles = req.files?.gallery || req.files?.['gallery'] || [];
    const galleryImages = galleryFiles.map((file) => ({ imagePath: file.path.replace(/\\/g, "/") }));

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        industry: finalIndustry,
        year: finalYear,
        projectDirection: projectDirection || [],
        mainImage: mainImagePath,
        gallery: {
          create: galleryImages,
        },
      },
      include: { gallery: true }
    });

    res.status(201).json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get all portfolios
export const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
      include: { gallery: true }
    });
    res.json({ success: true, count: portfolios.length, portfolios });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { gallery: true }
    });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }
    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 Update Portfolio
export const updatePortfolio = async (req, res) => {
  try {
    let { title, description, industry, Industry, year, Year, projectDirection } = req.body;
    const finalIndustry = industry || Industry;
    const finalYear = year || Year;

    const portfolioId = parseInt(req.params.id);
    const existingPortfolio = await prisma.portfolio.findUnique({ where: { id: portfolioId } });
    if (!existingPortfolio) return res.status(404).json({ message: "Portfolio not found" });

    const data = {};
    if (title) data.title = title;
    if (description) data.description = description;
    if (finalIndustry) data.industry = finalIndustry;
    if (finalYear) data.year = finalYear;
    
    if (projectDirection) {
      if (typeof projectDirection === 'string') {
        try {
          data.projectDirection = JSON.parse(projectDirection) || [];
        } catch (e) {
          data.projectDirection = projectDirection.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else {
        data.projectDirection = projectDirection;
      }
    }

    const mainImageFile = req.files?.find?.((file) => file.fieldname === "mainImage") || req.files?.mainImage?.[0];
    if (mainImageFile) {
      data.mainImage = mainImageFile.path.replace(/\\/g, "/");
    }

    // Handle gallery additions
    const galleryFiles = req.files?.filter?.((file) => file.fieldname === "gallery") || req.files?.gallery || [];
    if (galleryFiles.length > 0) {
        data.gallery = {
            create: galleryFiles.map(file => ({ imagePath: file.path.replace(/\\/g, "/") }))
        };
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: portfolioId },
      data: data,
      include: { gallery: true }
    });

    res.json({ success: true, portfolio: updatedPortfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑 Delete Portfolio
export const deletePortfolio = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Cascade delete gallery if not handled by DB, Prisma handles it if specified in schema but I didn't specify onDelete
    // To be safe, manual delete gallery first or just use deleteMany
    await prisma.portfolioGallery.deleteMany({ where: { portfolioId: id } });
    await prisma.portfolio.delete({ where: { id } });
    res.json({ success: true, message: "Portfolio deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑 Delete single gallery image
export const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params; // portfolioId
    const { imageId } = req.body; // In Prisma we can use the gallery ID

    if (imageId) {
        await prisma.portfolioGallery.delete({ where: { id: parseInt(imageId) } });
    } else {
        const { imagePath } = req.body;
        await prisma.portfolioGallery.deleteMany({
            where: { portfolioId: parseInt(id), imagePath: imagePath }
        });
    }

    const updatedPortfolio = await prisma.portfolio.findUnique({
      where: { id: parseInt(id) },
      include: { gallery: true }
    });

    res.json({ success: true, portfolio: updatedPortfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
