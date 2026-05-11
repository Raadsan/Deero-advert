import { prisma } from "../lib/prisma.js";

// Create a new case study
export const addCaseStudy = async (req, res) => {
  try {
    const {
      title,
      category,
      client,
      duration,
      challenge,
      solution,
      result,
      services,
      image: imageBody,
      author,
      publishedDate
    } = req.body;

    let image = imageBody;
    if (req.files) {
      const getFilePath = (names) => {
        if (!req.files) return undefined;
        if (Array.isArray(req.files)) {
          const f = req.files.find((file) => names.includes(file.fieldname));
          return f ? f.path.replace(/\\/g, "/") : undefined;
        }
        for (const n of names) {
          if (req.files[n] && req.files[n][0]) return req.files[n][0].path.replace(/\\/g, "/");
        }
        return undefined;
      };

      const fImg = getFilePath(["image", "featured_image"]);
      if (fImg) image = fImg;
    }

    const savedCaseStudy = await prisma.caseStudy.create({
      data: {
        title,
        category,
        client,
        duration,
        challenge,
        solution,
        result,
        services: services ? (typeof services === 'string' ? JSON.parse(services) : services) : [],
        image: image || "",
        author: author || "DEERO ADVERT",
        publishedDate: publishedDate ? new Date(publishedDate) : new Date()
      }
    });

    res.status(201).json(savedCaseStudy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create case study", error: error.message });
  }
};

// Get all case studies
export const getCaseStudies = async (req, res) => {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(caseStudies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch case studies", error: error.message });
  }
};

// Get single case study by ID
export const getCaseStudyById = async (req, res) => {
  try {
    const { id } = req.params;
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { id: parseInt(id) }
    });

    if (!caseStudy) return res.status(404).json({ message: "Case study not found" });

    res.status(200).json(caseStudy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch case study", error: error.message });
  }
};

// Update case study by ID
export const updateCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;
    const caseStudyId = parseInt(id);

    const {
      title,
      category,
      client,
      duration,
      challenge,
      solution,
      result,
      services,
      image: imageBody,
      author,
      publishedDate
    } = req.body || {};

    const update = {};
    if (title !== undefined) update.title = title;
    if (category !== undefined) update.category = category;
    if (client !== undefined) update.client = client;
    if (duration !== undefined) update.duration = duration;
    if (challenge !== undefined) update.challenge = challenge;
    if (solution !== undefined) update.solution = solution;
    if (result !== undefined) update.result = result;
    if (author !== undefined) update.author = author;
    if (publishedDate !== undefined) update.publishedDate = new Date(publishedDate);

    if (services !== undefined) {
      update.services = typeof services === 'string' ? JSON.parse(services) : services;
    }

    if (req.files) {
      const getFilePath = (names) => {
        if (!req.files) return undefined;
        if (Array.isArray(req.files)) {
          const f = req.files.find((file) => names.includes(file.fieldname));
          return f ? f.path.replace(/\\/g, "/") : undefined;
        }
        for (const n of names) {
          if (req.files[n] && req.files[n][0]) return req.files[n][0].path.replace(/\\/g, "/");
        }
        return undefined;
      };

      const fImg = getFilePath(["image", "featured_image"]);
      if (fImg) update.image = fImg;
    } else {
      if (imageBody !== undefined) update.image = imageBody;
    }

    const updatedCaseStudy = await prisma.caseStudy.update({
      where: { id: caseStudyId },
      data: update
    });

    res.status(200).json(updatedCaseStudy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update case study", error: error.message });
  }
};

// Delete case study by ID
export const deleteCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.caseStudy.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: "Case study deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete case study", error: error.message });
  }
};
