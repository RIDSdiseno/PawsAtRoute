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

function splitExt(name: string) {
  const i = name.lastIndexOf(".");
  if (i < 0) return { base: name, ext: "" };
  return { base: name.slice(0, i), ext: name.slice(i + 1) };
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  filename: string,
  mimetype?: string
): Promise<{ secure_url: string; public_id: string; resource_type: "raw" | "image" | "video" | "auto" | "authenticated" }> {
  const safeName = sanitizeFilename(filename);
  const { base, ext } = splitExt(safeName);
  const isPdf = (mimetype?.toLowerCase() === "application/pdf") || (ext.toLowerCase() === "pdf");

  return new Promise((resolve, reject) => {
    const opts: any = {
      folder,
      resource_type: isPdf ? "raw" : "auto",
      // Definimos public_id sin extensión y forzamos formato cuando sea PDF
      public_id: base,               // NO ponemos extensión aquí
      overwrite: true,
      use_filename: false,
      unique_filename: false,
      type: "upload",
    };

    if (isPdf) {
      // Esto asegura que la URL termine en .pdf (p.ej. .../raw/upload/.../archivo.pdf)
      opts.format = "pdf";
    } else {
      // Para imágenes u otros, puedes conservar filename_override si quieres que se vea el nombre
      opts.use_filename = true;
      opts.filename_override = safeName;
    }

    const stream = cloudinary.uploader.upload_stream(
      opts,
      (err?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (err || !result) return reject(err);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type as any,
        });
      }
    );
    stream.end(buffer);
  });
}
