// src/api/client.ts
const BASE_URL = "http://localhost:8787"; // where your Hono server runs

export async function searchShipment(trackingNumber: string) {
  const res = await fetch(`${BASE_URL}/api/shipments/${trackingNumber}`);
  if (!res.ok) throw new Error("Failed to fetch tracking info");
  return res.json();
}