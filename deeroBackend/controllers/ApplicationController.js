import { prisma } from "../lib/prisma.js";

export const submitApplication = async (req, res) => {
    try {
        const { fullName, position, phone, email, careerId } = req.body;

        if (!fullName || !position || !phone || !email) {
            return res.status(400).json({ message: "Required fields are missing", success: false });
        }

        // Handle files from req.files
        const files = req.files || [];
        const cvFile = files.find(f => f.fieldname === 'cv');
        const portfolioFile = files.find(f => f.fieldname === 'portfolio');
        const certificateFile = files.find(f => f.fieldname === 'certificate');

        if (!cvFile) {
            return res.status(400).json({ message: "CV is required", success: false });
        }

        const application = await prisma.jobApplication.create({
            data: {
                fullName,
                position,
                phone,
                email,
                cvUrl: cvFile.path || cvFile.url,
                portfolioUrl: portfolioFile ? (portfolioFile.path || portfolioFile.url) : null,
                certificateUrl: certificateFile ? (certificateFile.path || certificateFile.url) : null,
                careerId: careerId ? parseInt(careerId) : null,
            },
        });

        res.status(201).json({
            message: "Application submitted successfully",
            success: true,
            data: application
        });
    } catch (error) {
        console.error("Application submission error:", error);
        res.status(500).json({
            message: "Failed to submit application",
            success: false,
            error: error.message
        });
    }
};

export const getAllApplications = async (req, res) => {
    try {
        const applications = await prisma.jobApplication.findMany({
            include: { career: true },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            message: "Applications fetched successfully",
            success: true,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch applications",
            success: false,
            error: error.message
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updated = await prisma.jobApplication.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.status(200).json({
            message: `Application status updated to ${status}`,
            success: true,
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update status",
            success: false,
            error: error.message
        });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.jobApplication.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            message: "Application deleted successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete application",
            success: false,
            error: error.message
        });
    }
};
