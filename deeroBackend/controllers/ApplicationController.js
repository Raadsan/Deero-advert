import { prisma } from "../lib/prisma.js";

export const submitApplication = async (req, res) => {
    try {
        const { fullName, position, phone, email, careerId, portfolioUrl } = req.body;

        if (!fullName || !phone || !email) {
            return res.status(400).json({ message: "Required fields are missing", success: false });
        }

        // Always prioritize the job title from the database if careerId is provided
        let finalPosition = position;
        if (careerId) {
            const career = await prisma.career.findUnique({ 
                where: { id: parseInt(careerId) } 
            });
            if (career) {
                finalPosition = career.title;
            }
        }

        // If no careerId was provided and no position was sent, reject
        if (!finalPosition) {
            return res.status(400).json({ message: "Position is required", success: false });
        }

        // Handle files from req.files
        const files = req.files || [];
        const cvFile = files.find(f => f.fieldname === 'cv');
        const certificateFile = files.find(f => f.fieldname === 'certificate');
        const portfolioFile = files.find(f => f.fieldname === 'portfolio');

        // Portfolio is required as either a link (req.body) or a file (req.files)
        if (!cvFile || !certificateFile || (!portfolioFile && !portfolioUrl)) {
            return res.status(400).json({ 
                message: "All documents (CV, Portfolio link/file, and Education Certificate) are required", 
                success: false 
            });
        }

        const application = await prisma.jobApplication.create({
            data: {
                fullName,
                position: finalPosition,
                phone,
                email,
                cvUrl: (cvFile.path || cvFile.url).replace(/\\/g, "/"),
                portfolioUrl: portfolioUrl || (portfolioFile ? (portfolioFile.path || portfolioFile.url).replace(/\\/g, "/") : null),
                certificateUrl: (certificateFile.path || certificateFile.url).replace(/\\/g, "/"),
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
