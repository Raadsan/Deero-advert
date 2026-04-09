import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId) },
      include: { role: true }
    });

    if (!user) return res.status(401).json({ message: "User no longer exists" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
