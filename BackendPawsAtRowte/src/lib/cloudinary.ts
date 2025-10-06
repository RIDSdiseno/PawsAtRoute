// src/lib/cloudinary.ts
import { v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from "cloudinary";

function must(name: string) {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`[CLOUDINARY] Falta env var ${name}`);
  return v;
}

cloudinary.config({
  cloud_name: must("CLOUDINARY_CLOUD_NAME"),
  api_key:    must("CLOUDINARY_API_KEY"),
  api_secret: must("CLOUDINARY_API_SECRET"),
  secure: true,
});

function sanitizeFilename(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // sin tildes
    .replace(/[^\w.-]+/g, "_")       // sólo letras/números/._-
    .slice(0, 80);
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  filename: string,
  mimetype?: string
): Promise<{ secure_url: string }> {
  const safeName = sanitizeFilename(filename);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",       // PDF/imágenes, etc.
        use_filename: true,
        filename_override: safeName,
        unique_filename: true,
      },
      (err?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (err || !result) return reject(err);
        resolve({ secure_url: result.secure_url });
      }
    );
    stream.end(buffer);
  });
}
