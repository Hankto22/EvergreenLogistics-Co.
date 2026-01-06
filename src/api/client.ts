// src/api/client.ts
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4545"; // where your Hono server runs

export async function searchShipment(trackingNumber: string) {
  const res = await fetch(`${BASE_URL}/api/shipments/evg/${trackingNumber}`);
  if (!res.ok) throw new Error("Failed to fetch tracking info");
  return res.json();
}

export async function getGalleryItems() {
  const res = await fetch(`${BASE_URL}/api/gallery`);
  if (!res.ok) throw new Error("Failed to fetch gallery items");
  return res.json();
}