import Team from "../models/TeamModel.js";

/* ➕ CREATE TEAM MEMBER */
export const createTeam = async (req, res) => {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    try {
        const { name, position, socials } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        let parsedSocials = socials;
        if (typeof socials === "string") {
            try {
                parsedSocials = JSON.parse(socials);
            } catch (error) {
                console.error("Error parsing socials:", error);
                parsedSocials = [];
            }
        }

        const team = await Team.create({
            name,
            position,
            image: `uploads/${req.file.filename}`,
            socials: parsedSocials || [],
        });

        res.status(201).json({
            success: true,
            team,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* 📥 GET ALL TEAM MEMBERS */
export const getTeams = async (req, res) => {
    try {
        const teams = await Team.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            teams,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ✏ UPDATE TEAM MEMBER */
export const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position, socials } = req.body;

        const updateData = {
            name,
            position,
        };

        if (socials !== undefined) {
            let parsedSocials = socials;
            if (typeof socials === "string") {
                try {
                    parsedSocials = JSON.parse(socials);
                } catch (error) {
                    console.error("Error parsing socials:", error);
                    parsedSocials = [];
                }
            }
            updateData.socials = parsedSocials;
        }

        if (req.file) {
            updateData.image = `uploads/${req.file.filename}`;
        }

        const team = await Team.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        res.json({
            success: true,
            team,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ❌ DELETE TEAM MEMBER */
export const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        await Team.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Team member deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
