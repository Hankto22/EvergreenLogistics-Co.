// src/api/cloudinary.ts
export const CLOUDINARY_UPLOAD_PRESET = "YOUR_UNSIGNED_PRESET";
export const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME";

export async function uploadToCloudinary(file: File) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: form
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json(); // contains secure_url, etc.
}