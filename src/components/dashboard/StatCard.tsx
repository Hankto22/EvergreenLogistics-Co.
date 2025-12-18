"use client";

import { motion } from "framer-motion";
import { fadeRise } from "../animations/motionVariants";

export function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <motion.div
      variants={fadeRise}
      initial="hidden"
      animate="visible"
      className="rounded-xl bg-white p-6 shadow"
    >
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </motion.div>
  );
}