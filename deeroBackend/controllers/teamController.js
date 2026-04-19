import { prisma } from "../lib/prisma.js";

/* ➕ CREATE TEAM MEMBER */
export const createTeam = async (req, res) => {
    try {
        const { name, position, description, socials } = req.body;

        if (!req.file) return res.status(400).json({ message: "Image is required" });

        let parsedSocials = socials;
        if (typeof socials === "string") {
            try { parsedSocials = JSON.parse(socials); } catch (error) { parsedSocials = []; }
        }

        const team = await prisma.team.create({
            data: {
                name,
                position,
                description,
                image: req.file.path.replace(/\\/g, "/"),
                socials: {
                    create: (parsedSocials || []).map(s => ({
                        platform: s.platform,
                        url: s.url
                    }))
                },
            },
            include: { socials: true }
        });

        res.status(201).json({ success: true, team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* 📥 GET ALL TEAM MEMBERS */
export const getTeams = async (req, res) => {
    try {
        const teams = await prisma.team.findMany({
            include: { socials: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, teams });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ✏ UPDATE TEAM MEMBER */
export const updateTeam = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, position, description, socials } = req.body;

        const data = {};
        if (name !== undefined) data.name = name;
        if (position !== undefined) data.position = position;
        if (description !== undefined) data.description = description;
        if (req.file) data.image = req.file.path.replace(/\\/g, "/");

        if (socials !== undefined) {
            await prisma.teamSocial.deleteMany({ where: { teamId: id } });
            let parsedSocials = socials;
            if (typeof socials === "string") {
                try { parsedSocials = JSON.parse(socials); } catch (error) { parsedSocials = []; }
            }
            data.socials = {
                create: (parsedSocials || []).map(s => ({
                    platform: s.platform,
                    url: s.url
                }))
            };
        }

        const team = await prisma.team.update({
            where: { id },
            data,
            include: { socials: true }
        });

        res.json({ success: true, team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ❌ DELETE TEAM MEMBER */
export const deleteTeam = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.teamSocial.deleteMany({ where: { teamId: id } });
        await prisma.team.delete({ where: { id } });
        res.json({ success: true, message: "Team member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
