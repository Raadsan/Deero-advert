import imageCompression from "browser-image-compression";

export const compressImage = async (file: File) => {
  // SVG files are vector graphics - bypass compression to preserve 100% sharpness
  if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
    return file;
  }

  const options = {
    maxSizeMB: 2,              // Keep high resolution up to 2MB
    maxWidthOrHeight: 2560,   // Preserve sharpness for large images/logos
    useWebWorker: true,
    initialQuality: 0.95,      // Ultra-high quality visual fidelity
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // Maintain the original filename and type
    return new File([compressedFile], file.name, {
      type: file.type || compressedFile.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Compression Error:", error);
    return file; // Return original if compression fails
  }
};
