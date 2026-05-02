import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "deero-uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "svg", "pdf", "mp4", "webm", "ogg", "mov", "avi", "mkv", "m4a", "mp3", "wav", "doc", "docx", "xls", "xlsx", "zip", "txt"],
    resource_type: "auto",
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
  limits: { fileSize: 50 * 1024 * 1024 }
});

export default upload;
