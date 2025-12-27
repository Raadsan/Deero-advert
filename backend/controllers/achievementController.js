import Achievement from "../models/AchievementModel.js";

// =======================
// Add Achievement
// =======================
export const addAchievement = async (req, res) => {
  try {
    const { title, count } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
        success: false
      });
    }

    if (count === undefined || count === null || count === "") {
      return res.status(400).json({
        message: "Count is required",
        success: false
      });
    }

    // Convert count to number and validate
    let countNumber;
    if (typeof count === "string") {
      countNumber = Number(count.trim());
    } else if (typeof count === "number") {
      countNumber = count;
    } else {
      return res.status(400).json({
        message: "Count must be a valid number",
        success: false
      });
    }

    // Check if conversion resulted in a valid number
    if (isNaN(countNumber) || !isFinite(countNumber)) {
      return res.status(400).json({
        message: `Count must be a valid number. Received: "${count}"`,
        success: false
      });
    }

    // Validate icon file
    if (!req.file) {
      return res.status(400).json({
        message: "Icon image is required",
        success: false
      });
    }

    const achievement = new Achievement({
      title: title.trim(),
      count: countNumber,
      icon: req.file.filename
    });

    const saved = await achievement.save();
    res.status(201).json({
      message: "Achievement created successfully",
      success: true,
      data: saved
    });

  } catch (error) {
    console.error("Add Achievement Error:", error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({
        message: "Validation error",
        success: false,
        error: errors
      });
    }

    res.status(500).json({
      message: "Failed to add achievement",
      success: false,
      error: error.message
    });
  }
};

// =======================
// Get All Achievements
// =======================
export const getAchievements = async (req, res) => {
  try {
    const data = await Achievement.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: data.length === 0 ? "No achievements found" : "All Achievements",
      success: true,
      data: data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch achievements",
      success: false,
      error: error.message
    });
  }
};

// =======================
// Get Achievement By ID
// =======================
export const getAchievementById = async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findById(id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found with this id"
      });
    }

    res.status(200).json({
      success: true,
      message: "Achievement retrieved successfully",
      data: achievement
    });
  } catch (error) {
    console.error("Get Achievement By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// =======================
// Update Achievement
// =======================
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, count } = req.body;

    // Build update object
    const update = {};

    if (title !== undefined) {
      update.title = title.trim();
    }

    if (count !== undefined && count !== null && count !== "") {
      // Convert count to number and validate
      let countNumber;
      if (typeof count === "string") {
        countNumber = Number(count.trim());
      } else if (typeof count === "number") {
        countNumber = count;
      } else {
        return res.status(400).json({
          message: "Count must be a valid number",
          success: false
        });
      }

      // Check if conversion resulted in a valid number
      if (isNaN(countNumber) || !isFinite(countNumber)) {
        return res.status(400).json({
          message: `Count must be a valid number. Received: "${count}"`,
          success: false
        });
      }

      update.count = countNumber;
    }

    // Handle icon file upload if provided
    if (req.file) {
      update.icon = req.file.filename;
    }

    // If no fields provided to update, return 400
    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updatable fields provided"
      });
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updatedAchievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Achievement updated successfully",
      data: updatedAchievement
    });

  } catch (error) {
    console.error("Update Achievement Error:", error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({
        message: "Validation error",
        success: false,
        error: errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// =======================
// Delete Achievement
// =======================
export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Achievement.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ 
        message: "Achievement not found",
        success: false
      });
    }

    res.status(200).json({ 
      message: "Achievement deleted successfully",
      success: true,
      data: deleted
    });
  } catch (error) {
    console.error("Delete Achievement Error:", error);
    res.status(500).json({ 
      message: "Delete failed",
      success: false,
      error: error.message
    });
  }
};
