import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import lanternAsset from "@/assets/lantern.png.asset.json";
import { addWish, loadWishes, type Wish } from "@/lib/wishes";
import { easing } from "@/lib/motion";

type Props = {
  who: "souhayla" | "ermina";
  accent: string;
  placeholder?: string;
};

const lanternUrl = lanternAsset.url;
const DEFAULT_PLACEHOLDER = "Every wish becomes a lantern. What's yours?";

// Deterministic pseudo-random from string id — no Math.random() at render time
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function WishWall({ who, accent, placeholder = DEFAULT_PLACEHOLDER }: Props) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState<Wish | null>(null);
  const [risingId, setRisingId] = useState<string | null>(null);
  // SSR-safe: start with desktop layout, update after mount
  const [isMobile, setIsMobile] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setWishes(loadWishes(who));
  }, [who]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Focus close button when modal opens; handle Escape key
  useEffect(() => {
    if (open) {
      closeBtnRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(null);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open]);

  const lanterns = useMemo(
    () =>
      wishes.map((w, i) => {
        const h = hash(w.id);
        const cols = isMobile ? 3 : 6;
        const col = (h + i) % cols;
        const jitterX = ((h >> 3) % 8) - 4;
        const left = 6 + (col * (88 / (cols - 1))) + jitterX;
        const row = ((h >> 5) % 5);
        const top = 10 + row * 16 + ((h >> 9) % 8);
        const size = isMobile ? 42 + ((h >> 11) % 18) : 60 + ((h >> 11) % 36);
        const duration = 22 + ((h >> 13) % 18);
        const delay = -((h >> 15) % 24);
        const glowDur = 4 + ((h >> 7) % 4);
        return { wish: w, left, top, size, duration, delay, glowDur };
      }),
    [wishes, isMobile],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    const w = addWish(who, v);
    if (!w) return;
    setWishes((prev) => [...prev, w]);
    setText("");
    setRisingId(w.id);
    window.setTimeout(() => setRisingId((id) => (id === w.id ? null : id)), 2200);
  }

  const hasLanterns = lanterns.length > 0;
  const charsLeft = 280 - text.length;
  const showCounter = charsLeft <= 50;

  return (
    <section className="relative mx-auto w-full max-w-3xl px-6 py-24">
      <div className="text-center">
        <h2 className="font-display flex items-center justify-center gap-4 text-4xl tracking-wide sm:text-5xl">
          <img
            src={lanternUrl}
            alt=""
            aria-hidden
            width={48}
            height={48}
            className="h-10 w-auto sm:h-12"
            style={{ filter: `drop-shadow(0 0 12px ${accent}80)` }}
          />
          Wish Wall
        </h2>
        {hasLanterns && (
          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <img
              src={lanternUrl}
              alt=""
              aria-hidden
              width={16}
              height={16}
              className="h-4 w-auto opacity-80"
            />
            {lanterns.length} {lanterns.length === 1 ? "lantern" : "lanterns"} floating
          </p>
        )}
      </div>

      <form onSubmit={submit} className="mt-10 flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`wish-${who}`} className="sr-only">
          {placeholder}
        </label>
        <div className="relative flex-1">
          <input
            id={`wish-${who}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            maxLength={280}
            className="ease-luxury w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-white/25 focus:bg-white/[0.06]"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
          />
          {/* character counter — appears when within 50 chars of limit */}
          {showCounter && (
            <span
              className="pointer-events-none absolute bottom-3 right-4 text-xs tabular-nums transition-colors"
              style={{ color: charsLeft <= 10 ? "rgba(255,100,100,0.8)" : "rgba(255,255,255,0.35)" }}
            >
              {charsLeft}
            </span>
          )}
        </div>
        {/* Fix: w-full sm:w-auto prevents full-width stretch on mobile */}
        <button
          type="submit"
          disabled={!text.trim()}
          className="ease-luxury w-full rounded-2xl px-6 py-4 font-medium text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          style={{
            background: `linear-gradient(180deg, ${accent}, ${accent}cc)`,
            boxShadow: `0 10px 30px -10px ${accent}80`,
            outlineColor: accent,
          }}
        >
          Send
        </button>
      </form>

      {/* Rising lantern from send button — cinematic hand-off into the floating field */}
      <AnimatePresence>
        {risingId && (
          <motion.div
            key={risingId}
            aria-hidden
            className="pointer-events-none absolute left-1/2 z-10"
            style={{ top: "calc(100% - 120px)" }}
            initial={{ opacity: 0, y: 0, x: "-50%", scale: 0.7 }}
            animate={{ opacity: [0, 1, 1, 0], y: [-20, -140, -320, -520], scale: [0.7, 1, 1, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: easing, times: [0, 0.25, 0.7, 1] }}
          >
            <img
              src={lanternUrl}
              alt=""
              width={80}
              height={112}
              style={{
                width: 72,
                height: "auto",
                filter: `drop-shadow(0 0 22px ${accent}cc) drop-shadow(0 0 40px rgba(255,200,110,0.55))`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        FIX — was: position:absolute height:240vh top:-160vh
        That created phantom scroll height on mobile Safari.
        Now uses position:fixed so it occupies no layout space,
        and lantern buttons are pointer-events:auto inside.
        z-index raised from z-[5] to z-[12] so lanterns render
        above page sections (z-10) but below modals (z-50+).
      */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[12] overflow-hidden"
      >
        {lanterns.map(({ wish, left, top, size, duration, delay, glowDur }) => (
          <button
            key={wish.id}
            type="button"
            onClick={() => setOpen(wish)}
            aria-label="Open wish lantern"
            className="pointer-events-auto absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: "auto",
              animation: `lantern-drift ${duration}s ease-in-out ${delay}s infinite`,
              willChange: "transform",
            }}
          >
            <img
              src={lanternUrl}
              alt=""
              width={128}
              height={180}
              loading="lazy"
              draggable={false}
              style={{
                width: "100%",
                height: "auto",
                animation: `lantern-glow ${glowDur}s ease-in-out infinite`,
                willChange: "filter",
              }}
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easing }}
            onClick={() => setOpen(null)}
          >
            <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Wish"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 p-10 shadow-2xl"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
                backdropFilter: "blur(22px)",
                WebkitBackdropFilter: "blur(22px)",
                boxShadow: `0 50px 100px -30px ${accent}66`,
              }}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: easing }}
            >
              <div className="flex justify-center">
                <img
                  src={lanternUrl}
                  alt=""
                  aria-hidden
                  width={80}
                  height={110}
                  className="mb-4 h-20 w-auto"
                  style={{ filter: `drop-shadow(0 0 18px ${accent}99)` }}
                />
              </div>
              <p className="font-body text-center text-2xl leading-relaxed text-foreground">
                &ldquo;{open.text}&rdquo;
              </p>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {new Date(open.createdAt).toLocaleString(undefined, {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
              <div className="mt-8 flex justify-center">
                {/* autoFocus + ref so keyboard users land here on modal open */}
                <button
                  ref={closeBtnRef}
                  onClick={() => setOpen(null)}
                  className="ease-luxury rounded-2xl border border-white/15 px-5 py-2.5 text-sm text-foreground transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
