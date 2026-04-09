import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "deero-uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg", "pdf"],
    resource_type: "auto",
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|svg|pdf|html|htm/;
  const allowedMimetypes = /image\/|application\/pdf|text\/html/;

  const isExtensionValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const isMimetypeValid = allowedMimetypes.test(file.mimetype);

  if (isExtensionValid || isMimetypeValid) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

export default upload;
