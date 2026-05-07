import { prisma } from "../lib/prisma.js";

// GET ALL COMPANY CONTACT INFO
export const getCompanyContacts = async (req, res) => {
    try {
        const contacts = await prisma.companyContact.findMany();
        res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch contact info", error: error.message });
    }
};

// CREATE COMPANY CONTACT INFO
export const createCompanyContact = async (req, res) => {
    try {
        const { type, value } = req.body;
        if (!type || !value) {
            return res.status(400).json({ success: false, message: "Type and value are required" });
        }
        const contact = await prisma.companyContact.create({
            data: { type, value },
        });
        res.status(201).json({ success: true, message: "Contact info created successfully", data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create contact info", error: error.message });
    }
};

// UPDATE COMPANY CONTACT INFO
export const updateCompanyContact = async (req, res) => {
    try {
        const { type, value } = req.body;
        const contact = await prisma.companyContact.update({
            where: { id: parseInt(req.params.id) },
            data: { type, value },
        });
        res.status(200).json({ success: true, message: "Contact info updated successfully", data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update contact info", error: error.message });
    }
};

// DELETE COMPANY CONTACT INFO
export const deleteCompanyContact = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.companyContact.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ success: true, message: "Contact info deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete contact info", error: error.message });
    }
};

export const syncCompanyContacts = async (req, res) => {
    try {
        const { type, values } = req.body;
        if (!type || !Array.isArray(values)) {
            return res.status(400).json({ success: false, message: "Type and values array are required" });
        }

        // Use a transaction to ensure atomicity
        await prisma.$transaction([
            prisma.companyContact.deleteMany({ where: { type } }),
            prisma.companyContact.createMany({
                data: values.filter(v => v.trim() !== "").map(v => ({ type, value: v.trim() }))
            })
        ]);

        res.status(200).json({ success: true, message: `Synced ${type} contacts successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to sync contact info", error: error.message });
    }
};
