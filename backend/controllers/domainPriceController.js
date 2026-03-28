import DomainPrice from "../models/DomainPrice.js";

// Helper: normalize TLD
const normalizeTLD = (tld) => {
  if (!tld || typeof tld !== "string") return "";

  const clean = tld.trim().toLowerCase();

  return clean.startsWith(".") ? clean : `.${clean}`;
};


// CREATE DOMAIN PRICE
export const createDomainPrice = async (req, res) => {
  try {
    console.log("[createDomainPrice] Received body:", JSON.stringify(req.body));
    const { tld, price, isActive } = req.body;


    const normalizedTLD = normalizeTLD(tld);

    if (!normalizedTLD) {
      return res.status(400).json({
        success: false,
        message: "TLD is required",
      });
    }


    if (price === undefined || price === null || price === "") {
      return res.status(400).json({
        success: false,
        message: "Price is required",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    const existingTLD = await DomainPrice.findOne({
      tld: normalizedTLD,
    });

    if (existingTLD) {
      return res.status(409).json({
        success: false,
        message: `${normalizedTLD} already exists`,
      });
    }

    const domainPrice = await DomainPrice.create({
      tld: normalizedTLD,
      price: Number(price),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });


    return res.status(201).json({
      success: true,
      message: "Domain price created successfully",
      data: domainPrice,
    });
  } catch (error) {
    console.error("Create Domain Price Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create domain price",
      error: error.message,
    });
  }
};

// GET ALL DOMAIN PRICES
export const getAllDomainPrices = async (req, res) => {
  try {
    const domainPrices = await DomainPrice.find().sort({ tld: 1 });


    return res.status(200).json({
      success: true,
      count: domainPrices.length,
      data: domainPrices,
    });
  } catch (error) {
    console.error("Get All Domain Prices Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch domain prices",
      error: error.message,
    });
  }
};

// GET SINGLE DOMAIN PRICE BY ID
export const getDomainPriceById = async (req, res) => {
  try {
    const { id } = req.params;

    const domainPrice = await DomainPrice.findById(id);

    if (!domainPrice) {
      return res.status(404).json({
        success: false,
        message: "Domain price not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: domainPrice,
    });
  } catch (error) {
    console.error("Get Domain Price By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch domain price",
      error: error.message,
    });
  }
};

// GET DOMAIN PRICE BY TLD
export const getDomainPriceByTLD = async (req, res) => {
  try {
    const { tld } = req.params;

    const normalizedTLD = normalizeTLD(tld);

    const domainPrice = await DomainPrice.findOne({
      tld: normalizedTLD,
    });

    if (!domainPrice) {
      return res.status(404).json({
        success: false,
        message: `${normalizedTLD} not found`,
      });
    }


    return res.status(200).json({
      success: true,
      data: domainPrice,
    });
  } catch (error) {
    console.error("Get Domain Price By Extension Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch domain price by extension",
      error: error.message,
    });
  }
};

// UPDATE DOMAIN PRICE
export const updateDomainPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { tld, price, isActive } = req.body;

    const existingDomainPrice = await DomainPrice.findById(id);

    if (!existingDomainPrice) {
      return res.status(404).json({
        success: false,
        message: "Domain price not found",
      });
    }

    const updateData = {};

    if (tld !== undefined) {
      const normalizedTLD = normalizeTLD(tld);

      if (!normalizedTLD) {
        return res.status(400).json({
          success: false,
          message: "Invalid TLD",
        });
      }

      const duplicateTLD = await DomainPrice.findOne({
        tld: normalizedTLD,
        _id: { $ne: id },
      });

      if (duplicateTLD) {
        return res.status(409).json({
          success: false,
          message: `${normalizedTLD} already exists`,
        });
      }

      updateData.tld = normalizedTLD;
    }


    if (price !== undefined) {
      if (price === null || price === "" || Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid non-negative number",
        });
      }

      updateData.price = Number(price);
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const updatedDomainPrice = await DomainPrice.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Domain price updated successfully",
      data: updatedDomainPrice,
    });
  } catch (error) {
    console.error("Update Domain Price Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update domain price",
      error: error.message,
    });
  }
};

// DELETE DOMAIN PRICE
export const deleteDomainPrice = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDomainPrice = await DomainPrice.findByIdAndDelete(id);

    if (!deletedDomainPrice) {
      return res.status(404).json({
        success: false,
        message: "Domain price not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Domain price deleted successfully",
      data: deletedDomainPrice,
    });
  } catch (error) {
    console.error("Delete Domain Price Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete domain price",
      error: error.message,
    });
  }
};

// TOGGLE ACTIVE / INACTIVE
export const toggleDomainPriceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const domainPrice = await DomainPrice.findById(id);

    if (!domainPrice) {
      return res.status(404).json({
        success: false,
        message: "Domain price not found",
      });
    }

    domainPrice.isActive = !domainPrice.isActive;
    await domainPrice.save();

    return res.status(200).json({
      success: true,
      message: `Domain price ${
        domainPrice.isActive ? "activated" : "deactivated"
      } successfully`,
      data: domainPrice,
    });
  } catch (error) {
    console.error("Toggle Domain Price Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update domain price status",
      error: error.message,
    });
  }
};
