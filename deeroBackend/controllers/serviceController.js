import { prisma } from "../lib/prisma.js";

// Helper to format service data correctly for the frontend
const formatService = (service) => {
    return {
        ...service,
        packages: (service.packages || []).map(pkg => ({
            ...pkg,
            // Convert feature objects [{feature: "text"}] to just strings ["text"]
            features: (pkg.features || []).map(f => typeof f === 'object' ? f.feature : f)
        }))
    };
};

const successResponse = (res, message, data, status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data: Array.isArray(data) ? data.map(formatService) : formatService(data)
    });
};

// CREATE Service
export const CreateService = async (req, res) => {
    try {
        const { serviceTitle, packages } = req.body;
        if (!serviceTitle) return res.status(400).json({ message: "serviceTitle is required", success: false });

        let serviceIcon = null;
        if (req.files) {
            const getFilePath = (names) => {
                const files = Array.isArray(req.files) ? req.files : (req.files ? Object.values(req.files).flat() : []);
                for (const f of files) {
                    if (names.includes(f.fieldname)) return f.path.replace(/\\/g, "/");
                }
                return undefined;
            };
            serviceIcon = getFilePath(["serviceIcon", "icon", "service_icon", "image"]);
        }

        if (!serviceIcon) {
            return res.status(400).json({ message: "serviceIcon is required. Check Cloudinary settings.", success: false });
        }

        let packagesData = packages;
        if (typeof packages === "string") {
            try { packagesData = JSON.parse(packages); } catch (e) {}
        }

        const newService = await prisma.service.create({
            data: {
                serviceTitle,
                serviceIcon,
                packages: {
                    create: (packagesData || []).map(pkg => ({
                        packageTitle: pkg.packageTitle,
                        price: parseFloat(pkg.price) || 0,
                        features: {
                            create: (pkg.features || []).map(f => ({ feature: String(f) }))
                        }
                    }))
                }
            },
            include: { packages: { include: { features: true } } }
        });

        return successResponse(res, "Service created successfully", newService, 201);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET ALL Services
export const getALlServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            include: { packages: { include: { features: true } } },
            orderBy: { createdAt: "desc" },
        });
        return successResponse(res, "Services fetched", services);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET Service by ID
export const getServicesById = async (req, res) => {
    try {
        const { _id } = req.params;
        const serviceId = parseInt(_id);
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: { packages: { include: { features: true } } },
        });
        if (!service) return res.status(404).json({ success: false, message: "Service not found" });
        return successResponse(res, "Service fetched", service);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE Service
export const updateServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceId = parseInt(id);
        const { serviceTitle, packages } = req.body;

        const existingService = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!existingService) return res.status(404).json({ success: false, message: "Service not found" });

        let serviceIcon = existingService.serviceIcon;
        if (req.files) {
            const getFilePath = (names) => {
                const files = Array.isArray(req.files) ? req.files : (req.files ? Object.values(req.files).flat() : []);
                for (const f of files) {
                    if (names.includes(f.fieldname)) return f.path.replace(/\\/g, "/");
                }
                return undefined;
            };
            const newPath = getFilePath(["serviceIcon", "icon", "service_icon", "image"]);
            if (newPath) serviceIcon = newPath;
        }

        if (packages) {
            let packagesData = packages;
            if (typeof packages === "string") {
                try { packagesData = JSON.parse(packages); } catch (e) {}
            }
            if (Array.isArray(packagesData)) {
                // Cascading update: delete and recreate
                const oldPkgs = await prisma.servicePackage.findMany({ where: { serviceId } });
                for (const op of oldPkgs) await prisma.servicePackageFeature.deleteMany({ where: { servicePackageId: op.id } });
                await prisma.servicePackage.deleteMany({ where: { serviceId } });

                await prisma.service.update({
                    where: { id: serviceId },
                    data: {
                        serviceTitle: serviceTitle || existingService.serviceTitle,
                        serviceIcon,
                        packages: {
                            create: packagesData.map(p => ({
                                packageTitle: p.packageTitle,
                                price: parseFloat(p.price) || 0,
                                features: { create: (p.features || []).map(f => ({ feature: String(f) })) }
                            }))
                        }
                    }
                });
            }
        } else {
            await prisma.service.update({ where: { id: serviceId }, data: { serviceTitle, serviceIcon } });
        }

        const updated = await prisma.service.findUnique({
            where: { id: serviceId },
            include: { packages: { include: { features: true } } }
        });
        return successResponse(res, "Service updated", updated);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE Service
export const deleteServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceId = parseInt(id);
        const oldPkgs = await prisma.servicePackage.findMany({ where: { serviceId: serviceId } });
        for (const op of oldPkgs) await prisma.servicePackageFeature.deleteMany({ where: { servicePackageId: op.id } });
        await prisma.servicePackage.deleteMany({ where: { serviceId: serviceId } });
        await prisma.service.delete({ where: { id: serviceId } });
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
