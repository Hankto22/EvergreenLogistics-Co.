"use client";

import { motion } from "framer-motion";
import { fadeScale } from "../animations/motionVariants";
import type { GalleryItem } from "../../lib/types";

export default function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <motion.div
      variants={fadeScale}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03 }}
      className="overflow-hidden rounded-xl shadow bg-white cursor-pointer"
    >
      {item.mediaType === "video" ? (
        <video
          src={item.thumbnailUrl}
          className="h-48 w-full object-cover"
          controls
          muted
        />
      ) : (
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>
      </div>
    </motion.div>
  );
}