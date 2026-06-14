import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import { s3Client, getS3PublicUrl, buildS3Key } from "./s3.js";

const storage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, buildS3Key(filename));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|svg|pdf|html|htm|mp4|webm|ogg|mov|avi|mkv|m4a|mp3|wav|doc|docx|xls|xlsx|zip|txt/;
  const allowedMimetypes = /image\/|application\/pdf|text\/html|video\/|audio\/|application\/msword|application\/vnd.openxmlformats-officedocument|application\/zip|text\/plain/;

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
  limits: { fileSize: 2048 * 1024 * 1024 },
});

const normalizeFile = (file) => {
  if (!file) return;

  const url = file.location || (file.key ? getS3PublicUrl(file.key) : file.path);
  if (url) {
    file.path = url.replace(/\\/g, "/");
  }
};

const wrapUploadMiddleware = (middleware) => (req, res, next) => {
  middleware(req, res, (err) => {
    if (err) return next(err);

    if (req.file) normalizeFile(req.file);

    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach(normalizeFile);
      } else {
        Object.values(req.files)
          .flat()
          .forEach(normalizeFile);
      }
    }

    next();
  });
};

const wrappedUpload = {
  single: (field) => wrapUploadMiddleware(upload.single(field)),
  array: (field, maxCount) => wrapUploadMiddleware(upload.array(field, maxCount)),
  fields: (fields) => wrapUploadMiddleware(upload.fields(fields)),
  any: () => wrapUploadMiddleware(upload.any()),
  none: () => wrapUploadMiddleware(upload.none()),
};

export default wrappedUpload;
