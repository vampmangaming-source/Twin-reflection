import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import starAsset from "@/assets/star.png.asset.json";

const MESSAGES = [
  "Keep smiling. The world becomes brighter because u do.",
  "May Allah bless every step of ur journey.",
  "Stay exactly as kind as u are.",
  "Every beautiful soul deserves beautiful days.",
  "Never stop believing in ur dreams.",
  "Thank u for simply being u.",
];

function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

type Star = {
  id: number;
  size: number;
  duration: number;
  delay: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  message: string;
};

export function FloatingStars({ count = 7 }: { count?: number }) {
  const stars: Star[] = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const s = i + 1;
        return {
          id: i,
          size: 26 + rand(s * 1.3) * 22,
          duration: 22 + rand(s * 2.7) * 16,
          delay: -rand(s * 3.9) * 20,
          // FIX: cap startY to top 55vh so stars don't drift over music cards
          // which sit in the lower portion of the page (z-[20])
          startX: rand(s * 5.1) * 95,
          startY: rand(s * 7.3) * 55,
          endX: rand(s * 9.5) * 95,
          endY: rand(s * 11.7) * 55,
          message: MESSAGES[i % MESSAGES.length],
        };
      }),
    [count],
  );

  // Inject all star-drift keyframes once in a single <style> block
  const driftKeyframes = useMemo(
    () =>
      stars
        .map(
          (s) =>
            `@keyframes star-drift-${s.id} {
  0%   { transform: translate(${s.startX}vw, ${s.startY}vh) rotate(0deg); }
  100% { transform: translate(${s.endX}vw, ${s.endY}vh) rotate(${(s.id % 2 ? -1 : 1) * 20}deg); }
}`,
        )
        .join("\n"),
    [stars],
  );

  const [openId, setOpenId] = useState<number | null>(null);
  const openStar = stars.find((s) => s.id === openId);

  // Inject keyframes once on mount — avoids per-render inline <style> in loop
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.dataset.id = "star-drift-keyframes";
    styleEl.textContent = driftKeyframes;
    document.head.appendChild(styleEl);
    return () => styleEl.remove();
  }, [driftKeyframes]);

  return (
    <>
      {/*
        FIX: was z-[15] which overlapped music cards at z-[20].
        Stars now sit at z-[10] — below page content (z-[20])
        so they never block the MusicCard seek bar or play button.
        Stars remain visible in background; clicking them still works
        in the areas between / above the cards.
      */}
      <div aria-hidden={false} className="pointer-events-none fixed inset-0 z-[10]">
        {stars.map((s) => {
          const paused = openId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setOpenId(s.id)}
              aria-label="Open a hidden message"
              className="pointer-events-auto absolute cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                left: 0,
                top: 0,
                width: `${s.size}px`,
                height: `${s.size}px`,
                transform: `translate(${s.startX}vw, ${s.startY}vh)`,
                animation: paused
                  ? "star-twinkle 2s ease-in-out infinite"
                  : `star-drift-${s.id} ${s.duration}s ease-in-out ${s.delay}s infinite alternate, star-twinkle ${3 + (s.id % 3)}s ease-in-out infinite`,
                filter: paused
                  ? "drop-shadow(0 0 22px rgba(255,220,140,0.95)) drop-shadow(0 0 40px rgba(255,200,120,0.6))"
                  : "drop-shadow(0 0 10px rgba(255,220,150,0.55))",
                willChange: "transform, opacity, filter",
              }}
            >
              <img
                src={starAsset.url}
                alt=""
                draggable={false}
                className="h-full w-full select-none"
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {openStar && (
          <motion.div
            key="star-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-black/50 px-6 backdrop-blur-sm"
            onClick={() => setOpenId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 p-8 text-center sm:p-10"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 40px 80px -30px rgba(255,210,130,0.35)",
              }}
            >
              <img
                src={starAsset.url}
                alt=""
                className="mx-auto mb-4 h-12 w-12"
                style={{ filter: "drop-shadow(0 0 18px rgba(255,220,140,0.9))" }}
              />
              <p className="font-display text-lg italic leading-relaxed text-white/90 sm:text-xl">
                {openStar.message}
              </p>
              <button
                autoFocus
                onClick={() => setOpenId(null)}
                className="ease-luxury mt-6 inline-flex rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 text-sm text-white/85 transition hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
