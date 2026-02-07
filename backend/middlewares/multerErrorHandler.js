import multer from "multer";

// Express error-handling middleware for multer errors
export default function multerErrorHandler(err, req, res, next) {
  if (!err) return next();

  // Return any error as a 400 response with the error message
  res.status(400).json({
    message: err.message || "An error occurred during file upload."
  });
}
