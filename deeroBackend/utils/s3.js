import dotenv from "dotenv";
import path from "path";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_BUCKET_NAME;

const PROJECT_FOLDERS = {
  deero: "deero_uploads",
  ems: "ems_uploads",
  hr: "hr_uploads",
};

export const getUploadPrefix = () => {
  if (process.env.AWS_S3_UPLOAD_PREFIX) {
    return process.env.AWS_S3_UPLOAD_PREFIX.replace(/^\/+|\/+$/g, "");
  }

  const project = (process.env.APP_PROJECT || process.env.PROJECT_NAME || "")
    .toLowerCase()
    .trim();

  return PROJECT_FOLDERS[project] || "uploads";
};

export const buildS3Key = (filename) => {
  const safeName = path.basename(filename).replace(/^\/+/, "");
  return `${getUploadPrefix()}/${safeName}`;
};

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getS3PublicUrl = (key) => {
  const cleanKey = key.replace(/^\/+/, "");
  return `https://${bucket}.s3.${region}.amazonaws.com/${cleanKey}`;
};

export const extractS3KeyFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  if (!url.startsWith("http")) {
    return url.replace(/^\/+/, "");
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname;

    if (host.startsWith(`${bucket}.s3.`)) {
      return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    }

    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts[0] === bucket) {
      return decodeURIComponent(pathParts.slice(1).join("/"));
    }
  } catch {
    return null;
  }

  return null;
};

export const deleteS3Object = async (urlOrKey) => {
  const key = extractS3KeyFromUrl(urlOrKey);
  if (!key) return false;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  return true;
};

export const isS3Url = (filePath) =>
  typeof filePath === "string" &&
  (filePath.startsWith("http") || filePath.startsWith(`${getUploadPrefix()}/`));
