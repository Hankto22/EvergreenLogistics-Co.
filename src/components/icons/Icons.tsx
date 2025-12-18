"use client";
import {
  Ship,
  Truck,
  Box,
  Shield,
  Eye,
  Target,
  Handshake,
  Settings,
  Leaf,
  Globe,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

export const IconShip = (props: LucideProps) => <Ship {...props} />;
export const IconTruck = (props: LucideProps) => <Truck {...props} />;
export const IconBox = (props: LucideProps) => <Box {...props} />;
export const IconShield = (props: LucideProps) => <Shield {...props} />;
export const IconEye = (props: LucideProps) => <Eye {...props} />;
export const IconTarget = (props: LucideProps) => <Target {...props} />;
export const IconHandshake = (props: LucideProps) => <Handshake {...props} />;
export const IconSettings = (props: LucideProps) => <Settings {...props} />;
export const IconLeaf = (props: LucideProps) => <Leaf {...props} />;
export const IconGlobe = (props: LucideProps) => <Globe {...props} />;

export default {
  IconShip,
  IconTruck,
  IconBox,
  IconShield,
  IconEye,
  IconTarget,
  IconHandshake,
  IconSettings,
  IconLeaf,
  IconGlobe,
};
