"use client";

import { useState } from "react";
import { useCreateGalleryItemMutation } from "../../store/galleryApi";

export default function GalleryUploadModal({ onClose }: { onClose: () => void }) {
  const [createItem, { isLoading }] = useCreateGalleryItemMutation();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    mediaType: "image",
    mediaUrl: ""
  });

  const submit = async () => {
    await createItem(form).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Upload Gallery Item</h2>

        <input
          placeholder="Title"
          className="input"
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <select
          className="input mt-3"
          onChange={e => setForm({ ...form, category: e.target.value })}
        >
          <option>Children's Homes</option>
          <option>Orphan Support</option>
          <option>School Support</option>
          <option>Donations</option>
          <option>Events</option>
        </select>

        <textarea
          placeholder="Description"
          className="input mt-3"
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        {/* Cloudinary placeholder */}
        <div className="mt-4 border-dashed border-2 p-6 text-center rounded-lg">
          Upload Media (Cloudinary integration here)
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}