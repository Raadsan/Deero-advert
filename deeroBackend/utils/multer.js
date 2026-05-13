import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|svg|pdf|html|htm|mp4|webm|ogg|mov|avi|mkv|m4a|mp3|wav|doc|docx|xls|xlsx|zip|txt/;
  const allowedMimetypes = /image\/|application\/pdf|text\/html|video\/|audio\/|application\/msword|application\/vnd.openxmlformats-officedocument|application\/zip|text\/plain/;

  const isExtensionValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const isMimetypeValid = allowedMimetypes.test(file.mimetype);

  console.log(`DEBUG: Uploading File - Name: ${file.originalname}, Mime: ${file.mimetype}, ExtValid: ${isExtensionValid}, MimeValid: ${isMimetypeValid}`);

  if (isExtensionValid || isMimetypeValid) {
    cb(null, true);
  } else {
    console.error(`DEBUG: Multer Rejected File - Mime: ${file.mimetype}, Name: ${file.originalname}`);
    cb(new Error("File type not supported."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2048 * 1024 * 1024 } // 2GB limit
});

export default upload;
