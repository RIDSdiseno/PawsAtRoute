"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
// src/lib/cloudinary.ts
const cloudinary_1 = require("cloudinary");
function must(name) {
    const v = process.env[name]?.trim();
    if (!v)
        throw new Error(`[CLOUDINARY] Falta env var ${name}`);
    return v;
}
cloudinary_1.v2.config({
    cloud_name: must("CLOUDINARY_CLOUD_NAME"),
    api_key: must("CLOUDINARY_API_KEY"),
    api_secret: must("CLOUDINARY_API_SECRET"),
    secure: true,
});
function sanitizeFilename(name) {
    return name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "") // sin tildes
        .replace(/[^\w.-]+/g, "_") // sólo letras/números/._-
        .slice(0, 80);
}
async function uploadBufferToCloudinary(buffer, folder, filename, mimetype) {
    const safeName = sanitizeFilename(filename);
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: "auto", // PDF/imágenes, etc.
            use_filename: true,
            filename_override: safeName,
            unique_filename: true,
        }, (err, result) => {
            if (err || !result)
                return reject(err);
            resolve({ secure_url: result.secure_url });
        });
        stream.end(buffer);
    });
}
