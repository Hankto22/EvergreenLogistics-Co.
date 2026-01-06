"use client";

import { useEffect, useState } from "react";
import GalleryCard from "./GalleryCard";
import { getGalleryItems } from "../../api/client";
import images from "../../lib/images";
import projectVideo from "../../assets/project video.mp4";
import achievementsMain from "../../assets/achievements.jpeg";
import achievementsTwo from "../../assets/achievements 2.jpeg";
import project1 from "../../assets/project 1.jpeg";
import project2 from "../../assets/project 2.jpeg";
import project4 from "../../assets/project 4.jpeg";
import project5 from "../../assets/project 5.jpeg";
import project7 from "../../assets/project 7.jpeg";
import team from "../../assets/team.jpeg";
import type { GalleryItem } from "../../lib/types";

const categories = [
  "All",
  "Children's Homes",
  "Orphan Support",
  "School Support",
  "Donations",
  "Team Development",
  "Projects",
  "Achievements",
  "Team"
];

const reserveAsset = (used: Set<string>, ...candidates: Array<string | undefined>) => {
  for (const candidate of candidates) {
    if (candidate && !used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }

  const fallback = candidates.find(Boolean);
  if (fallback) used.add(fallback);
  return fallback || "";
};

export default function GalleryGrid() {
  const [active, setActive] = useState("All");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGalleryItems();
        setGalleryItems(data.data || []);
      } catch (error) {
        console.error("Failed to fetch gallery items:", error);
        // Fallback to empty array
        setGalleryItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filtered =
    active === "All"
      ? galleryItems
      : galleryItems.filter(i => i.category === active);

  const usedAssets = new Set<string>();
  let communitySupportCount = 0;
  let teamConverted = false;

  const regularItems: GalleryItem[] = [];
  const teamItems: GalleryItem[] = [];

  filtered.forEach((item, idx) => {
    const titleLower = (item.title || "").toLowerCase();
    const categoryLower = (item.category || "").toLowerCase();

    let mediaType = item.mediaType || "image";
    let mappedItem: GalleryItem = { ...item };

    const thumbnailUrl = (() => {
      if (titleLower.includes("achievement award")) {
        mediaType = "image";
        return reserveAsset(usedAssets, achievementsMain, item.thumbnailUrl, item.mediaUrl);
      }

      if (titleLower.includes("community support")) {
        communitySupportCount += 1;
        mediaType = "image";

        if (communitySupportCount === 1) {
          return reserveAsset(usedAssets, achievementsTwo, item.thumbnailUrl, item.mediaUrl);
        }

        if (!teamConverted) {
          mappedItem = { ...mappedItem, title: "Team Development Event", category: "Team Development" };
          teamConverted = true;
          return reserveAsset(usedAssets, project1, item.thumbnailUrl, item.mediaUrl);
        }

        return reserveAsset(usedAssets, item.thumbnailUrl, item.mediaUrl, project2, project4);
      }

      if (titleLower.includes("community donation drive") || titleLower.includes("donation drive")) {
        mediaType = "image";
        return reserveAsset(usedAssets, project2, item.thumbnailUrl, item.mediaUrl);
      }

      if (titleLower.includes("children") && titleLower.includes("home")) {
        mediaType = "image";
        return reserveAsset(usedAssets, project7, item.thumbnailUrl, item.mediaUrl);
      }

      if (titleLower.includes("school support") || categoryLower.includes("school support") || categoryLower.includes("school")) {
        mediaType = "image";
        return reserveAsset(usedAssets, project5, images.gallerySamples.school?.[0], item.thumbnailUrl, item.mediaUrl);
      }

      if (titleLower.includes("team development") || categoryLower.includes("team development")) {
        mediaType = "image";
        return reserveAsset(usedAssets, project1, item.thumbnailUrl, item.mediaUrl);
      }

      if (categoryLower.includes("achieve") || titleLower.includes("achieve")) {
        mediaType = "image";
        return reserveAsset(usedAssets, achievementsMain, item.thumbnailUrl, item.mediaUrl);
      }

      if (categoryLower.includes("donat")) {
        mediaType = "image";
        return reserveAsset(usedAssets, project2, images.gallerySamples.donations?.[0], item.thumbnailUrl, item.mediaUrl);
      }

      if (categoryLower.includes("children")) {
        mediaType = "image";
        return reserveAsset(
          usedAssets,
          project7,
          images.gallerySamples.children?.[idx % (images.gallerySamples.children?.length || 1)],
          item.thumbnailUrl,
          item.mediaUrl
        );
      }

      if (categoryLower.includes("school")) {
        mediaType = "image";
        return reserveAsset(usedAssets, project5, images.gallerySamples.school?.[0], item.thumbnailUrl, item.mediaUrl);
      }

      if (categoryLower.includes("team")) {
        mediaType = "image";
        return reserveAsset(usedAssets, team, item.thumbnailUrl, item.mediaUrl);
      }

      if (categoryLower.includes("project")) {
        mediaType = "image";
        return reserveAsset(
          usedAssets,
          project4,
          project2,
          project5,
          project7,
          images.gallerySamples.children?.[idx % (images.gallerySamples.children?.length || 1)],
          item.thumbnailUrl,
          item.mediaUrl
        );
      }

      if (item.mediaType === "video") {
        mediaType = "video";
        return reserveAsset(usedAssets, item.thumbnailUrl, item.mediaUrl, projectVideo);
      }

      mediaType = item.mediaType || "image";
      return reserveAsset(usedAssets, item.thumbnailUrl, item.mediaUrl, images.gallerySamples.orphan?.[0], project4);
    })();

    mappedItem = { ...mappedItem, thumbnailUrl, mediaType };

    const isTeamItem =
      (mappedItem.category || "").toLowerCase().includes("team") ||
      (mappedItem.title || "").toLowerCase().includes("team");

    if (isTeamItem) {
      teamItems.push(mappedItem);
    } else {
      regularItems.push(mappedItem);
    }
  });

  const overflowAssets = [
    project4,
    achievementsMain,
    achievementsTwo,
    project1,
    project2,
    project5,
    project7,
    images.gallerySamples.children?.[0],
    images.gallerySamples.orphan?.[0],
    images.gallerySamples.school?.[0]
  ].filter((src): src is string => Boolean(src) && !usedAssets.has(src));

  const spillover =
    active === "All"
      ? overflowAssets.map((src, idx) => ({
          id: `unassigned-${idx}`,
          title: "Gallery Highlight",
          category: "Projects",
          description: "Additional highlight image",
          mediaType: "image",
          mediaUrl: src,
          thumbnailUrl: src,
          createdByUserId: "system",
          createdAt: new Date().toISOString()
        }))
      : [];

  const mapped = [...regularItems, ...teamItems, ...spillover];

  if (loading) {
    return <div className="text-center py-10">Loading gallery...</div>;
  }

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
