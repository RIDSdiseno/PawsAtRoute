// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
});

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  filename: string,
  mimetype?: string
) {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        filename_override: filename,
        resource_type: "auto", // pdf/jpg/png, etc
        use_filename: true,
        unique_filename: true,
      },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve({ secure_url: result.secure_url });
      }
    );
    stream.end(buffer);
  });
}
