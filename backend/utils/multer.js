import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Set storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "deero-uploads", // folder-ka Cloudinary lagu kaydinayo
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg", "pdf"],
    resource_type: "auto", // Allow both images and documents
  },
});

// File filter remains the same to check extensions before upload
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|svg|pdf|html|htm/;
  const allowedMimetypes = /image\/|application\/pdf|text\/html/;

  const isExtensionValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const isMimetypeValid = allowedMimetypes.test(file.mimetype);

  if (isExtensionValid || isMimetypeValid) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported. Allowed: images (jpeg, png, gif, webp, svg), HTML, and PDF."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // max 50MB
});

export default upload;

