import Career from "../models/CareerModel.js";

// Create Career
export const createCareer = async (req, res) => {
    try {
        const { title, type, location, description, postedDate, expireDate } = req.body;

        // Validate required fields
        if (!title || !type || !location || !description || !postedDate || !expireDate) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Validate dates
        const posted = new Date(postedDate);
        const expire = new Date(expireDate);

        if (expire <= posted) {
            return res.status(400).json({
                message: "Expire date must be after posted date",
                success: false,
            });
        }

        const career = new Career({
            title: title.trim(),
            type,
            location: location.trim(),
            description: description.trim(),
            postedDate: posted,
            expireDate: expire,
        });

        const saved = await career.save();
        res.status(201).json({
            message: "Job posting created successfully",
            success: true,
            data: saved,
        });
    } catch (error) {
        console.error("Create Career Error:", error);
        res.status(500).json({
            message: "Failed to create job posting",
            success: false,
            error: error.message,
        });
    }
};

// Get All Careers
export const getAllCareers = async (req, res) => {
    try {
        const careers = await Career.find().sort({ postedDate: -1 });
        res.status(200).json({
            message: careers.length === 0 ? "No job postings found" : "All job postings",
            success: true,
            data: careers,
            count: careers.length,
        });
    } catch (error) {
        console.error("Get All Careers Error:", error);
        res.status(500).json({
            message: "Failed to fetch job postings",
            success: false,
            error: error.message,
        });
    }
};

// Get Active Careers Only
export const getActiveCareers = async (req, res) => {
    try {
        const now = new Date();
        const careers = await Career.find({
            expireDate: { $gte: now },
        }).sort({ postedDate: -1 });

        res.status(200).json({
            message: careers.length === 0 ? "No active job postings" : "Active job postings",
            success: true,
            data: careers,
            count: careers.length,
        });
    } catch (error) {
        console.error("Get Active Careers Error:", error);
        res.status(500).json({
            message: "Failed to fetch active job postings",
            success: false,
            error: error.message,
        });
    }
};

// Get Career By ID
export const getCareerById = async (req, res) => {
    try {
        const { id } = req.params;
        const career = await Career.findById(id);

        if (!career) {
            return res.status(404).json({
                success: false,
                message: "Job posting not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Job posting retrieved successfully",
            data: career,
        });
    } catch (error) {
        console.error("Get Career By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Update Career
export const updateCareer = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, location, description, postedDate, expireDate } = req.body;

        const update = {};

        if (title !== undefined) update.title = title.trim();
        if (type !== undefined) update.type = type;
        if (location !== undefined) update.location = location.trim();
        if (description !== undefined) update.description = description.trim();
        if (postedDate !== undefined) update.postedDate = new Date(postedDate);
        if (expireDate !== undefined) update.expireDate = new Date(expireDate);

        // Validate dates if both are provided
        if (update.postedDate && update.expireDate) {
            if (update.expireDate <= update.postedDate) {
                return res.status(400).json({
                    success: false,
                    message: "Expire date must be after posted date",
                });
            }
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No updatable fields provided",
            });
        }

        const updatedCareer = await Career.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
        });

        if (!updatedCareer) {
            return res.status(404).json({
                success: false,
                message: "Job posting not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Job posting updated successfully",
            data: updatedCareer,
        });
    } catch (error) {
        console.error("Update Career Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Delete Career
export const deleteCareer = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Career.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                message: "Job posting not found",
                success: false,
            });
        }

        res.status(200).json({
            message: "Job posting deleted successfully",
            success: true,
            data: deleted,
        });
    } catch (error) {
        console.error("Delete Career Error:", error);
        res.status(500).json({
            message: "Delete failed",
            success: false,
            error: error.message,
        });
    }
};
