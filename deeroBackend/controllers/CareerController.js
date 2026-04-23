import { prisma } from "../lib/prisma.js";

// Create Careers...
export const createCareer = async (req, res) => {
    try {
        const { title, type, location, description, postedDate, expireDate } = req.body;

        if (!title || !type || !location || !description || !postedDate || !expireDate) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const posted = new Date(postedDate);
        const expire = new Date(expireDate);

        if (expire <= posted) {
            return res.status(400).json({ message: "Expire date must be after posted date", success: false });
        }

        const career = await prisma.career.create({
            data: {
                title: title.trim(),
                type,
                location: location.trim(),
                description: description.trim(),
                postedDate: posted,
                expireDate: expire,
            },
        });

        res.status(201).json({ message: "Job posting created successfully", success: true, data: career });
    } catch (error) {
        res.status(500).json({ message: "Failed to create job posting", success: false, error: error.message });
    }
};

// Get All Careers
export const getAllCareers = async (req, res) => {
    try {
        const careers = await prisma.career.findMany({ orderBy: { postedDate: 'desc' } });
        res.status(200).json({
            message: careers.length === 0 ? "No job postings found" : "All job postings",
            success: true,
            data: careers,
            count: careers.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch job postings", success: false, error: error.message });
    }
};

// Get Active Careers Only
export const getActiveCareers = async (req, res) => {
    try {
        const now = new Date();
        const careers = await prisma.career.findMany({
            where: { expireDate: { gte: now } },
            orderBy: { postedDate: 'desc' },
        });

        res.status(200).json({
            message: careers.length === 0 ? "No active job postings" : "Active job postings",
            success: true,
            data: careers,
            count: careers.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch active job postings", success: false, error: error.message });
    }
};

// Get Career By ID
export const getCareerById = async (req, res) => {
    try {
        const career = await prisma.career.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!career) return res.status(404).json({ success: false, message: "Job posting not found" });
        res.status(200).json({ success: true, message: "Job posting retrieved successfully", data: career });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
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

        if (update.postedDate && update.expireDate && update.expireDate <= update.postedDate) {
            return res.status(400).json({ success: false, message: "Expire date must be after posted date" });
        }

        const updatedCareer = await prisma.career.update({
            where: { id: parseInt(id) },
            data: update,
        });

        res.status(200).json({ success: true, message: "Job posting updated successfully", data: updatedCareer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete Career
export const deleteCareer = async (req, res) => {
    try {
        await prisma.career.delete({ where: { id: parseInt(req.params.id) } });
        res.status(200).json({ message: "Job posting deleted successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", success: false, error: error.message });
    }
};
