"use client";

import { Dialog } from "@headlessui/react";
import type { GalleryItem } from "../../lib/types";

export default function GalleryModal({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: GalleryItem }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6">
            <Dialog.Title className="text-xl font-bold">{item.title}</Dialog.Title>
            <img src={item.thumbnailUrl} alt={item.title} className="w-full mt-4 rounded" />
            <p className="mt-4">{item.description}</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}