export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  mediaType: string;
  description: string;
}

export interface Shipment {
  id: string;
  status: string;
  destination: string;
}