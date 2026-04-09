import multer from "multer";

export default function multerErrorHandler(err, req, res, next) {
  if (!err) return next();

  // Log the full error to the backend terminal to help us debug
  console.error("DEBUG: Multer/Cloudinary Error:", err);

  res.status(400).json({
    success: false,
    message: err.message || "An error occurred during file upload."
  });
}
