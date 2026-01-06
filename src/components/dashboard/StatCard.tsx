"use client";

import { motion } from "framer-motion";
import { fadeRise } from "../animations/motionVariants";
import type { LucideIcon } from "lucide-react";

export function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon?: LucideIcon }) {
  return (
    <motion.div
      variants={fadeRise}
      initial="hidden"
      animate="visible"
      className="rounded-xl bg-white p-6 shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm text-gray-500">{title}</h4>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        {Icon && <Icon className="h-8 w-8 text-blue-600" />}
      </div>
    </motion.div>
  );
}