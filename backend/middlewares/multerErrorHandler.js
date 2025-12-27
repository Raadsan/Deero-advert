import multer from "multer";

// Express error-handling middleware for multer errors
export default function multerErrorHandler(err, req, res, next) {
  if (!err) return next();

  // Multer uses name 'MulterError'
  if (err.name === "MulterError" || err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  // pass through other errors
  next(err);
}
