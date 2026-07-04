import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easing } from "@/lib/motion";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: easing }}
    >
      {children}
    </motion.main>
  );
}
