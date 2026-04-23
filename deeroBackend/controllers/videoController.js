import { prisma } from "../lib/prisma.js";

// Add a new video
export const addVideo = async (req, res) => {
  try {
    const { title, url: urlBody } = req.body;
    let url = urlBody;

    if (req.file) {
      url = req.file.path.replace(/\\/g, "/");
    }

    if (!url) {
      return res.status(400).json({ message: "Video file or URL is required", success: false });
    }

    const video = await prisma.video.create({
      data: {
        title,
        url,
      },
    });

    res.status(201).json({ message: "Video added successfully", success: true, data: video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add video", success: false, error: error.message });
  }
};

// Get all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ message: "Videos fetched successfully", success: true, data: videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch videos", success: false, error: error.message });
  }
};

// Get single video by ID
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({
      where: { id: parseInt(id) },
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found", success: false });
    }

    res.status(200).json({ message: "Video fetched successfully", success: true, data: video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch video", success: false, error: error.message });
  }
};

// Update video by ID
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url: urlBody } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    
    if (req.file) {
      updateData.url = req.file.path.replace(/\\/g, "/");
    } else if (urlBody) {
      updateData.url = urlBody;
    }

    const updatedVideo = await prisma.video.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({ message: "Video updated successfully", success: true, data: updatedVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update video", success: false, error: error.message });
  }
};

// Delete video by ID
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.video.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Video deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete video", success: false, error: error.message });
  }
};
