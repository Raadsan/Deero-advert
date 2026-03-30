import imageCompression from "browser-image-compression";

export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,              // 🔥 reduce file size
    maxWidthOrHeight: 1600,   // 🔥 keep good quality
    useWebWorker: true,
    initialQuality: 0.8,      // 🔥 image quality (important)
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // Maintain the original filename and type
    return new File([compressedFile], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Compression Error:", error);
    return file; // Return original if compression fails
  }
};
