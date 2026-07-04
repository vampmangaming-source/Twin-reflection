import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easing } from "@/lib/motion";

function EnvelopeSVG({
  isOpening,
  onAnimationComplete,
}: {
  isOpening: boolean;
  onAnimationComplete: () => void;
}) {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={72}
      height={54}
      aria-hidden
      style={{ overflow: "visible", display: "block" }}
    >
      {/* ── Body: real white envelope ── */}
      <rect x="1" y="10" width="62" height="37" rx="4" fill="#f5f0e8" />

      {/* ── Side panels (inner folds) ── */}
      <path d="M1 47 L32 29 L1 10" fill="#e8e0d0" />
      <path d="M63 47 L32 29 L63 10" fill="#e8e0d0" />

      {/* ── Bottom fold seam ── */}
      <path d="M1 47 L32 29 L63 47" fill="#ddd4c0" />

      {/* ── Outer border ── */}
      <rect x="1" y="10" width="62" height="37" rx="4" fill="none" stroke="#c8bfa8" strokeWidth="0.8" />

      {/* ── Letter slides out on open ── */}
      <motion.g
        initial={{ y: 0, opacity: 0 }}
        animate={
          isOpening
            ? {
                y: -20,
                opacity: [0, 1, 1, 0],
                transition: { duration: 0.85, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] },
              }
            : { y: 0, opacity: 0 }
        }
      >
        <rect x="18" y="6" width="28" height="22" rx="2.5" fill="#fffdf5" stroke="#d4c89a" strokeWidth="0.7" />
        <line x1="22" y1="13" x2="42" y2="13" stroke="#c4ae78" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="22" y1="17" x2="42" y2="17" stroke="#c4ae78" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="22" y1="21" x2="34" y2="21" stroke="#c4ae78" strokeWidth="0.9" strokeLinecap="round" />
        {/* tiny heart on letter */}
        <path
          d="M37 11.5 C37 10.6 37.6 10 38.4 10 C39.2 10 39.8 10.7 39.8 11.4 C39.8 12.9 38.2 14 38.2 14 C38.2 14 36.6 12.9 36.6 11.4 C36.6 10.7 37 10 37.7 10 Z"
          fill="#ff8fab"
        />
      </motion.g>

      {/* ── Flap — sealed position is the V-shape pointing down ── */}
      <motion.path
        d="M1 10 L32 30 L63 10 Z"
        fill="#ede5d4"
        stroke="#c8bfa8"
        strokeWidth="0.8"
        style={{ transformOrigin: "32px 10px", transformBox: "fill-box" }}
        initial={{ rotateX: 0 }}
        animate={
          isOpening
            ? {
                rotateX: [0, -180],
                transition: { duration: 0.5, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] },
              }
            : { rotateX: 0 }
        }
        onAnimationComplete={() => { if (isOpening) onAnimationComplete(); }}
      />
    </svg>
  );
}

export function HiddenHeart() {
  const [phase, setPhase] = useState<"idle" | "opening" | "open">("idle");
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => { if (phase === "idle") setPhase("opening"); };
  const handleAnimDone = () => { if (phase === "opening") setPhase("open"); };
  const handleClose = () => setPhase("idle");

  useEffect(() => {
    if (phase === "open") {
      closeBtnRef.current?.focus();
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [phase]);

  return (
    <>
      {/* Fixed envelope */}
      <motion.button
        type="button"
        onClick={handleClick}
        aria-label="Open a hidden message"
        whileHover={phase === "idle" ? { scale: 1.1, y: -2 } : {}}
        whileTap={phase === "idle" ? { scale: 0.94 } : {}}
        transition={{ type: "spring", stiffness: 360, damping: 24 }}
        className="fixed bottom-5 left-1/2 z-[40] -translate-x-1/2 cursor-pointer appearance-none border-0 bg-transparent p-0 outline-none sm:left-auto sm:right-5 sm:translate-x-0"
        style={{
          lineHeight: 0,
          width: 72,
          height: 54,
          animation: phase === "idle" ? "envelope-breathe 5s ease-in-out infinite" : "none",
        }}
      >
        <EnvelopeSVG isOpening={phase === "opening"} onAnimationComplete={handleAnimDone} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {phase === "open" && (
          <motion.div
            key="env-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easing }}
            className="fixed inset-0 z-[90] grid place-items-center bg-black/60 px-6 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Hidden message"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.45, ease: easing }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/12 p-8 text-center sm:p-10"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                boxShadow: "0 40px 80px -24px rgba(255,200,140,0.22), 0 0 0 1px rgba(255,220,160,0.10)",
              }}
            >
              <p className="font-body whitespace-pre-line text-lg italic leading-loose text-white/90 sm:text-xl">
                {`Thank u for taking this little journey.\nI hope it made ur birthday a little more special n brought a smile to both of ur faces.\n\nWishing u both endless happiness, beautiful memories, n a wonderful year ahead.\n\nHappy Birthday once again. 🤍`}
              </p>
              <button
                ref={closeBtnRef}
                onClick={handleClose}
                className="ease-luxury mt-7 inline-flex rounded-full border border-white/15 bg-white/[0.06] px-6 py-2 text-sm text-white/80 transition hover:bg-white/[0.12] outline-none"
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
