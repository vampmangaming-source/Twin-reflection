import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import lanternAsset from "@/assets/lantern.png.asset.json";
import { easing } from "@/lib/motion";

const SESSION_KEY = "welcome-animation-played";

// Dev flag: set to `true` to always play the welcome animation.
// When `false`, the animation only plays once per browsing session.
export const showWelcomeAnimation = false;

type Props = { onFinish: () => void };

export function WelcomeAnimation({ onFinish }: Props) {
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setVisible(false);
      onFinish();
      return;
    }
    const played = window.sessionStorage.getItem(SESSION_KEY) === "1";
    if (!showWelcomeAnimation && played) {
      setVisible(false);
      onFinish();
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      window.sessionStorage.setItem(SESSION_KEY, "1");
      onFinish();
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: easing }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background:
              "radial-gradient(ellipse at center, #0a1a36 0%, #060d1a 60%, #050a14 100%)",
          }}
        >
          {/* sparkles */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const radius = 90 + (i % 3) * 30;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <motion.span
                key={i}
                aria-hidden
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, x],
                  y: [0, y],
                  scale: [0, 1, 0.6],
                }}
                transition={{
                  duration: 1.8,
                  delay: 0.5 + (i % 5) * 0.08,
                  ease: easing,
                }}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{
                  background: "rgba(255,210,140,0.95)",
                  boxShadow:
                    "0 0 12px rgba(255,200,110,0.9), 0 0 24px rgba(255,160,70,0.6)",
                }}
              />
            );
          })}

          <motion.img
            src={lanternAsset.url}
            alt=""
            aria-hidden
            width={140}
            height={200}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.6, 1, 1.02, 0.95],
              y: [20, 0, -20, -160],
              filter: [
                "drop-shadow(0 0 6px rgba(255,180,80,0.2))",
                "drop-shadow(0 0 22px rgba(255,200,110,0.7)) drop-shadow(0 0 42px rgba(255,150,60,0.4))",
                "drop-shadow(0 0 28px rgba(255,210,120,0.85)) drop-shadow(0 0 56px rgba(255,160,70,0.5))",
                "drop-shadow(0 0 10px rgba(255,180,80,0.2))",
              ],
            }}
            transition={{
              duration: 2.6,
              times: [0, 0.25, 0.6, 1],
              ease: easing,
            }}
            style={{ height: "auto", width: "140px" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
