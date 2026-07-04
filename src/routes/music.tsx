import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { MusicCard } from "@/components/MusicCard";
import { FloatingStars } from "@/components/FloatingStars";
import { HiddenHeart } from "@/components/HiddenHeart";
import { easing } from "@/lib/motion";
import celebrate from "@/assets/celebrate-today.mp3.asset.json";
import smile from "@/assets/smile-all-day.mp3.asset.json";
import musicNote from "@/assets/music-note.png.asset.json";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "A Melody for Souhayla & Ermina" },
      {
        name: "description",
        content: "A quiet melody crafted just for Souhayla and Ermina.",
      },
    ],
  }),
  component: MusicPage,
});

/** Decorative animated waveform — purely visual */
function WaveformDecor({ accent }: { accent: string }) {
  const bars = [0.3, 0.55, 0.8, 1, 0.75, 0.5, 0.85, 0.6, 0.4, 0.7, 0.95, 0.45];
  return (
    <div aria-hidden className="flex items-center justify-center gap-[3px]" style={{ height: 28 }}>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="rounded-full"
          style={{ width: 3, background: accent, opacity: 0.45 }}
          animate={{ scaleY: [h * 0.6, h, h * 0.5, h * 1.1, h * 0.7, h] }}
          transition={{
            duration: 2.4 + i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
            repeatType: "mirror",
          }}
          initial={{ scaleY: h * 0.6, originY: 0.5 }}
        />
      ))}
    </div>
  );
}

function MusicPage() {
  return (
    <PageTransition>
      <div
        className="page-locked relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse at 20% 15%, #12234a 0%, #0a1530 42%, #060d1a 78%, #050a14 100%)",
            "radial-gradient(ellipse at 80% 90%, #0d2a1e 0%, transparent 55%)",
            "radial-gradient(ellipse at 55% 55%, #0f1a38 0%, transparent 65%)",
          ].join(", "),
          backgroundBlendMode: "screen, screen, normal",
        }}
      >
        {/* Subtle film grain overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
        />

        <FloatingStars count={7} />
        <HiddenHeart />

        <section className="relative z-[20] mx-auto flex h-dvh max-w-3xl flex-col items-center justify-center px-6 py-8 sm:py-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easing }}
            className="flex flex-col items-center gap-2 text-center"
          >
            {/* Waveform above title */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: easing }}
            >
              <WaveformDecor accent="#6ea8fe" />
            </motion.div>

            <h1
              className="font-display flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-light text-white"
              style={{
                fontSize: "clamp(22px, 4vw, 42px)",
                lineHeight: 1.15,
                letterSpacing: "0.02em",
                textShadow: "0 4px 48px rgba(255,255,255,0.09)",
              }}
            >
              <img
                src={musicNote.url}
                alt=""
                aria-hidden
                draggable={false}
                className="inline-block h-8 w-auto sm:h-10"
                style={{ filter: "drop-shadow(0 0 18px rgba(255,220,140,0.6))" }}
              />
              <span>A Melody Made Just for Both of You</span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: easing }}
              className="font-body max-w-lg text-sm italic leading-relaxed text-white/50 sm:text-base"
            >
              Press play, let the music fill the moment — this one's yours.
            </motion.p>

            {/* Decorative divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.65, ease: easing }}
              className="h-px w-32 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.28) 60%, transparent)",
              }}
            />
          </motion.div>

          {/* Music cards */}
          <div className="mt-6 flex w-full flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: easing }}
            >
              <MusicCard
                title="Celebrate Today!"
                src={celebrate.url}
                accent="#2962FF"
                artworkGradient="linear-gradient(135deg, #1a3a8f 0%, #2962FF 45%, #7ab3ff 100%)"
                artworkVariant="double"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.78, ease: easing }}
            >
              <MusicCard
                title="Smile All Day"
                src={smile.url}
                accent="#1FA971"
                artworkGradient="linear-gradient(135deg, #0a3d25 0%, #1FA971 45%, #6ed8a8 100%)"
                artworkVariant="double"
              />
            </motion.div>
          </div>

          {/* Continue button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: easing }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <Link
              to="/finale"
              className="group ease-luxury relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/25 px-7 py-2.5 text-sm font-medium text-white transition-all hover:border-white/40 hover:bg-white/[0.08] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              {/* ripple */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-active:animate-[button-ripple_0.7s_ease-out]"
                style={{ background: "rgba(255,255,255,0.4)" }}
              />
              <span className="relative text-white">Continue to the finale</span>
              <span className="relative text-white/60 transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
            </Link>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6, ease: easing }}
              className="text-xs italic text-white/25"
            >
              One last surprise awaits
            </motion.p>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
}
