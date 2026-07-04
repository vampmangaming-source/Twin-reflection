import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";
import { AudioBus, AUDIO_EVENTS } from "@/lib/audio-bus";
import { easing } from "@/lib/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Souhayla & Ermina — A Birthday Keepsake" },
      {
        name: "description",
        content:
          "A heartfelt birthday tribute to twin sisters Souhayla and Ermina.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [loadingTo, setLoadingTo] = useState<string | null>(null);
  const router = useRouter();

  const handleBegin = (to: string) => {
    if (loadingTo) return;
    AudioBus.emit(AUDIO_EVENTS.START_BACKGROUND);
    setLoadingTo(to);
    window.setTimeout(() => {
      router.navigate({ to });
    }, 1000);
  };

  return (
    <>
      <WelcomeAnimation onFinish={() => setWelcomeDone(true)} />
      <main
        className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16"
        style={{
          background:
            "radial-gradient(ellipse at 25% 20%, #0f2a5c 0%, #0a1a36 35%, #060d1a 70%, #050a14 100%), radial-gradient(ellipse at 80% 85%, #0a2a1f 0%, transparent 55%)",
          backgroundBlendMode: "screen",
        }}
      >
        {/* subtle premium grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
        />

        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={welcomeDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1, ease: easing, delay: 0.1 }}
            className="font-body mb-12 text-center font-light italic tracking-wide text-white/60 sm:mb-16"
            style={{
              fontSize: "clamp(20px, 3.4vw, 30px)",
              lineHeight: 1.3,
              letterSpacing: "0.02em",
              textShadow: "0 2px 30px rgba(255,255,255,0.06)",
            }}
          >
            Two beautiful souls. Two unforgettable stories.
          </motion.h1>

          {/*
            Cards grid — items-stretch ensures both columns are the same height.
            Each SisterCard renders h-full so the inner glass panel fills to match.
          */}
          <div className="grid w-full grid-cols-1 items-stretch gap-8 md:grid-cols-2">
            <SisterCard
              to="/souhayla"
              name="Souhayla"
              tagline="Strong, graceful, and truly one of a kind."
              accent="#2962FF"
              primary="#0F3D91"
              bg="#08111F"
              delay={0.1}
              loading={loadingTo === "/souhayla"}
              disabled={loadingTo !== null && loadingTo !== "/souhayla"}
              onBegin={() => handleBegin("/souhayla")}
              tiltDir={-1}
            />
            <SisterCard
              to="/ermina"
              name="Ermina"
              tagline="A heart so gentle is a blessing to everyone who knows you."
              accent="#1FA971"
              primary="#0F7A52"
              bg="#07160F"
              delay={0.2}
              loading={loadingTo === "/ermina"}
              disabled={loadingTo !== null && loadingTo !== "/ermina"}
              onBegin={() => handleBegin("/ermina")}
              tiltDir={1}
            />
          </div>
        </div>

        {/* fade-out overlay when navigating */}
        <AnimatePresence>
          {loadingTo && (
            <motion.div
              key="fade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: easing, delay: 0.3 }}
              className="pointer-events-none fixed inset-0 z-[90] bg-[#050a14]"
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

type CardProps = {
  to: string;
  name: string;
  tagline: string;
  accent: string;
  primary: string;
  bg: string;
  delay: number;
  loading: boolean;
  disabled: boolean;
  onBegin: () => void;
  tiltDir?: number; // +1 or -1 for asymmetric hover tilt
};

function SisterCard({
  name,
  tagline,
  accent,
  primary,
  bg,
  delay,
  loading,
  disabled,
  onBegin,
  tiltDir = 1,
}: CardProps) {
  const [active, setActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: easing }}
      whileHover={{ y: -8, scale: 1.02, rotate: tiltDir * 1 }}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onTapStart={() => setActive(true)}
      onTap={() => setActive(false)}
      onTapCancel={() => setActive(false)}
      style={{ transformOrigin: "center" }}
      className="ease-luxury h-full"
    >
      <div
        className="ease-luxury group relative flex h-full flex-col overflow-hidden rounded-[24px] p-10 outline-none sm:p-12"
        style={{
          background: `linear-gradient(160deg, ${primary}25 0%, ${bg} 60%)`,
          border: `1px solid ${active ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.10)"}`,
          boxShadow: active
            ? `0 30px 80px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.10), 0 0 60px -20px ${accent}80`
            : "0 24px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          minHeight: "360px",
          transition:
            "border-color 350ms cubic-bezier(0.22,0.61,0.36,1), box-shadow 350ms cubic-bezier(0.22,0.61,0.36,1)",
        }}
      >
        {/* corner glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
          animate={{ opacity: active ? 0.95 : 0.5 }}
          transition={{ duration: 0.35, ease: easing }}
          style={{ background: accent }}
        />

        {/* extra floating particles on active */}
        <AnimatePresence>
          {active &&
            Array.from({ length: 6 }).map((_, i) => {
              const left = 15 + ((i * 37) % 70);
              const startY = 80 + ((i * 13) % 20);
              return (
                <motion.span
                  key={i}
                  aria-hidden
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{
                    opacity: [0, 0.9, 0],
                    y: [0, -120 - (i % 3) * 30],
                    scale: [0.6, 1, 0.7],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2.4 + (i % 3) * 0.4,
                    delay: i * 0.15,
                    ease: easing,
                    repeat: Infinity,
                  }}
                  className="pointer-events-none absolute h-1 w-1 rounded-full"
                  style={{
                    left: `${left}%`,
                    top: `${startY}%`,
                    background: accent,
                    boxShadow: `0 0 8px ${accent}, 0 0 16px ${accent}90`,
                  }}
                />
              );
            })}
        </AnimatePresence>

        <div className="relative flex flex-1 flex-col justify-between gap-12">
          <div>
            <p
              aria-hidden
              className="text-xs font-medium uppercase tracking-[0.3em]"
              style={{ color: accent }}
            >
              ✦
            </p>
            <h2
              className="font-display mt-6 text-5xl font-light leading-none sm:text-6xl"
              style={{ color: "#F4F7FF", letterSpacing: "0.02em" }}
            >
              {name}
            </h2>
            <p className="font-body mt-6 text-lg italic leading-relaxed text-white/70 sm:text-xl">
              {tagline}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={disabled}
              onClick={onBegin}
              className="ease-luxury inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-medium text-white outline-none transition focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(180deg, ${accent}, ${primary})`,
                boxShadow: loading
                  ? `0 0 40px -5px ${accent}, 0 12px 40px -8px ${accent}`
                  : active
                    ? `0 14px 40px -10px ${accent}, 0 0 24px -6px ${accent}90`
                    : `0 10px 30px -10px ${accent}90`,
                transition:
                  "box-shadow 350ms cubic-bezier(0.22,0.61,0.36,1), transform 350ms cubic-bezier(0.22,0.61,0.36,1)",
              }}
            >
              {loading ? (
                <>
                  <motion.span
                    className="inline-block h-3 w-3 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.9,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  />
                  Opening
                </>
              ) : (
                <>
                  Begin
                  <span aria-hidden>→</span>
                </>
              )}
            </button>
            <span
              className="h-px w-16 origin-right bg-white/30 transition-transform"
              style={{
                transform: active ? "scaleX(1)" : "scaleX(0.5)",
                transition:
                  "transform 350ms cubic-bezier(0.22,0.61,0.36,1)",
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
