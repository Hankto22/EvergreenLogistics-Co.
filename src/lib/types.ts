export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  mediaType: string;
  description: string | null;
  mediaUrl: string;
  createdByUserId: string;
  createdAt: string;
}

export interface Shipment {
  id: string;
  status: string;
  destination: string;
}