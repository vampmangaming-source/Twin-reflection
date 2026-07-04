import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { easing } from "@/lib/motion";

export const Route = createFileRoute("/together")({
  head: () => ({
    meta: [
      { title: "Souhayla & Ermina — Forever Sisters" },
      {
        name: "description",
        content:
          "Different souls. One beautiful bond. A blessing for Souhayla and Ermina.",
      },
    ],
  }),
  component: TogetherPage,
});

function TogetherPage() {
  const sparkles = Array.from({ length: 14 }, (_, i) => i);

  return (
    <PageTransition>
      <div
        className="relative min-h-dvh overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #08111F 0%, #0a1a2e 35%, #08201c 65%, #07160F 100%)",
        }}
      >
        {/* nav back links */}
        <div className="fixed left-6 top-6 z-20 flex gap-2">
          <Link
            to="/souhayla"
            className="ease-luxury inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span aria-hidden>←</span> Souhayla
          </Link>
          <Link
            to="/ermina"
            className="ease-luxury inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Ermina <span aria-hidden>→</span>
          </Link>
        </div>

        <section className="relative mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-6 py-32 text-center">
          {/* Converging orbs — plays once on mount.
              FIX: added overflow:hidden + tighter max-width clamp so orbs
              don't clip awkwardly on narrow viewports */}
          <div
            className="relative mb-14 w-full overflow-hidden"
            style={{ maxWidth: "min(560px, 85vw)", height: "200px" }}
          >
            {/* blue orb from left */}
            <motion.div
              className="absolute top-1/2 h-24 w-24 -translate-y-1/2 rounded-full"
              initial={{ left: "-10%", opacity: 0, scale: 0.7 }}
              animate={{
                left: ["-10%", "50%", "50%"],
                x: ["0%", "-90%", "-70%"],
                opacity: [0, 1, 1],
                scale: [0.7, 1, 0.95],
              }}
              transition={{ duration: 3.4, times: [0, 0.7, 1], ease: easing }}
              style={{
                background:
                  "radial-gradient(circle, #E8EEF9 0%, #2962FF 40%, rgba(15,61,145,0) 78%)",
                boxShadow: "0 0 70px rgba(41,98,255,0.75)",
              }}
            />
            {/* green orb from right */}
            <motion.div
              className="absolute top-1/2 h-24 w-24 -translate-y-1/2 rounded-full"
              initial={{ right: "-10%", opacity: 0, scale: 0.7 }}
              animate={{
                right: ["-10%", "50%", "50%"],
                x: ["0%", "90%", "70%"],
                opacity: [0, 1, 1],
                scale: [0.7, 1, 0.95],
              }}
              transition={{ duration: 3.4, times: [0, 0.7, 1], ease: easing, delay: 0.25 }}
              style={{
                background:
                  "radial-gradient(circle, #EAF7EF 0%, #1FA971 40%, rgba(15,122,82,0) 78%)",
                boxShadow: "0 0 70px rgba(31,169,113,0.75)",
              }}
            />
            {/* golden bloom */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0, 1, 0.9], scale: [0.3, 0.3, 1.2, 1] }}
              transition={{ duration: 4.2, times: [0, 0.6, 0.82, 1], ease: easing }}
              style={{
                background:
                  "radial-gradient(circle, #FFF3C4 0%, #FFD070 40%, rgba(255,180,80,0) 75%)",
                boxShadow: "0 0 80px rgba(255,210,130,0.9)",
              }}
            />
            {/* golden sparkles */}
            {sparkles.map((i) => {
              const angle = (i / sparkles.length) * Math.PI * 2;
              const distance = 80 + (i % 3) * 18;
              return (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#FFE9A8]"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 0, 1, 0],
                    x: [0, 0, Math.cos(angle) * distance, Math.cos(angle) * distance * 1.5],
                    y: [0, 0, Math.sin(angle) * distance, Math.sin(angle) * distance * 1.5],
                  }}
                  transition={{
                    duration: 4.2,
                    times: [0, 0.6, 0.82, 1],
                    ease: "easeOut",
                    delay: 0.04 * i,
                  }}
                  style={{ boxShadow: "0 0 8px rgba(255,220,140,0.9)" }}
                />
              );
            })}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2, ease: easing }}
            className="font-display font-light text-white"
            style={{
              letterSpacing: "0.03em",
              fontSize: "clamp(34px, 6vw, 56px)",
              lineHeight: 1.1,
            }}
          >
            Different souls. One beautiful bond.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.8, ease: easing }}
            className="font-body mt-10 max-w-2xl text-lg italic leading-relaxed text-white/80 sm:text-xl"
          >
            May this new year of ur lives be filled with happiness, answered
            prayers, endless smiles, n beautiful memories. Happy Birthday,
            Souhayla &amp; Ermina. <span aria-hidden>🤍</span>
          </motion.p>

          {/* Continue to the melody — premium glass, golden glow, ripple, sparkles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.4, ease: easing }}
            className="mt-14 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/music"
              className="group ease-luxury relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition hover:-translate-y-1 hover:border-white/35 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow:
                  "0 12px 44px -14px rgba(255,220,140,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,220,140,0.30), transparent 68%)",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-active:animate-[button-ripple_0.7s_ease-out]"
                style={{ background: "rgba(255,230,170,0.55)" }}
              />
              <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="absolute h-1 w-1 rounded-full"
                    style={{
                      left: `${15 + i * 22}%`,
                      top: `${20 + (i % 2) * 55}%`,
                      background: "#FFE9A8",
                      boxShadow: "0 0 8px rgba(255,220,140,0.9)",
                      animation: `star-twinkle ${1.6 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </span>
              <span className="relative" aria-hidden>🎵</span>
              <span className="relative">Continue to the melody</span>
            </Link>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
}
