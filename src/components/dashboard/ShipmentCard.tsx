"use client";

import { motion } from "framer-motion";
import { fadeRise } from "../animations/motionVariants";
import type { Shipment } from "../../lib/types";

export function ShipmentCard({ shipment }: { shipment: Shipment }) {
  return (
    <motion.div
      variants={fadeRise}
      initial="hidden"
      animate="visible"
      className="rounded-xl bg-white p-6 shadow"
    >
      <h4 className="font-semibold">{shipment.id}</h4>
      <p className="text-sm text-gray-500">{shipment.status}</p>
      <p className="mt-2 text-sm">{shipment.destination}</p>
    </motion.div>
  );
}