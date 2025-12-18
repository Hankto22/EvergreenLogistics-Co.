"use client";

import { useState } from "react";
import GalleryCard from "./GalleryCard";
import { mockGallery } from "../../lib/mockData";
import images from "../../lib/images";

const categories = [
  "All",
  "Children's Homes",
  "Orphan Support",
  "School Support",
  "Donations",
  "Events",
  "Projects",
  "Achievements",
  "Team"
];

export default function GalleryGrid() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? mockGallery
      : mockGallery.filter(i => i.category === active);

  // Replace local/mock thumbnail paths with curated remote images where available
  const mapped = filtered.map((item, idx) => {
    const cat = item.category.toLowerCase();
    let remote = item.thumbnailUrl;

    if (cat.includes("children")) remote = images.gallerySamples.children?.[idx % (images.gallerySamples.children.length || 1)] || remote;
    else if (cat.includes("orphan")) remote = images.gallerySamples.orphan?.[idx % (images.gallerySamples.orphan.length || 1)] || remote;
    else if (cat.includes("school")) remote = images.gallerySamples.school?.[idx % (images.gallerySamples.school.length || 1)] || remote;
    else if (cat.includes("donat")) remote = images.gallerySamples.donations?.[idx % (images.gallerySamples.donations.length || 1)] || remote;

    return { ...item, thumbnailUrl: remote };
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center my-10">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-full ${
              active === c ? "bg-green-600 text-white" : "bg-gray-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mapped.map(item => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}