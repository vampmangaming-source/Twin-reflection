import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { AudioBus, AUDIO_EVENTS } from "@/lib/audio-bus";
import { easing } from "@/lib/motion";

type Props = {
  title: string;
  src: string;
  accent: string;
  artworkGradient?: string;
  artworkVariant?: "single" | "double";
};

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** Equalizer bars — shown while playing in status row */
function EqBars({ accent }: { accent: string }) {
  const bars = [0.5, 1, 0.7, 0.85, 0.55];
  return (
    <span aria-hidden className="flex items-end gap-[2px]" style={{ height: 12 }}>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full"
          style={{ background: accent, originY: 1 }}
          animate={{ scaleY: [h * 0.4, h * 1.5, h * 0.4, h * 1.2, h * 0.5, h] }}
          transition={{ duration: 0.7 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
          initial={{ scaleY: h * 0.4 }}
        />
      ))}
    </span>
  );
}

/** Vinyl disc with play/pause overlay */
function VinylArtwork({
  accent,
  variant,
  playing,
  onToggle,
}: {
  accent: string;
  variant: "single" | "double";
  playing: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      aria-label={playing ? "Pause" : "Play"}
      onClick={onToggle}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="relative shrink-0 cursor-pointer rounded-full outline-none"
      style={{ width: "clamp(72px, 11vw, 88px)", height: "clamp(72px, 11vw, 88px)" }}
    >
      {/* ── spinning disc ── */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={playing ? { rotate: 360 } : { rotate: 0 }}
        transition={playing ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.7 }}
        style={{
          background: `conic-gradient(
            ${accent}44 0deg, #0c0c1a 28deg,
            ${accent}28 88deg, #0c0c1a 118deg,
            ${accent}44 178deg, #0c0c1a 208deg,
            ${accent}28 268deg, #0c0c1a 298deg,
            ${accent}44 360deg
          )`,
        }}
      />

      {/* groove rings */}
      {[0.82, 0.66, 0.52].map((s, i) => (
        <div key={i} className="absolute inset-0 m-auto rounded-full"
          style={{ width: `${s * 100}%`, height: `${s * 100}%`, border: `1px solid rgba(255,255,255,${0.07 - i * 0.02})` }}
        />
      ))}

      {/* centre label */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
        style={{
          width: "34%", height: "34%",
          background: `radial-gradient(circle at 36% 36%, ${accent}ee, ${accent}66)`,
          boxShadow: playing ? `0 0 16px ${accent}99` : "none",
          transition: "box-shadow 500ms ease",
        }}
      >
        {variant === "double" ? (
          <svg viewBox="0 0 20 20" width="54%" height="54%" fill="none" aria-hidden>
            <line x1="7" y1="4" x2="16" y2="2.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="7" y1="4" x2="7" y2="13" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="16" y1="2.5" x2="16" y2="11.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
            <ellipse cx="5.5" cy="14" rx="2.4" ry="1.7" transform="rotate(-12 5.5 14)" fill="rgba(255,255,255,0.9)"/>
            <ellipse cx="14.5" cy="12.5" rx="2.4" ry="1.7" transform="rotate(-12 14.5 12.5)" fill="rgba(255,255,255,0.9)"/>
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width="54%" height="54%" fill="none" aria-hidden>
            <path d="M9 3C9 3 16 5.5 16 10c-2-2-5-2-7-1" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="9" y1="3" x2="9" y2="15.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
            <ellipse cx="7" cy="16.5" rx="2.6" ry="1.8" transform="rotate(-14 7 16.5)" fill="rgba(255,255,255,0.9)"/>
          </svg>
        )}
      </div>

      {/* sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(ellipse at 30% 26%, rgba(255,255,255,0.14) 0%, transparent 52%)" }}
      />

      {/* pulse ring while playing */}
      {playing && (
        <motion.div className="pointer-events-none absolute inset-0 rounded-full"
          animate={{ boxShadow: [`0 0 0 0px ${accent}66`, `0 0 0 14px ${accent}00`] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* ── Blur overlay + play/pause icon ── */}
      <AnimatePresence initial={false}>
        {(!playing || hovered) && (
          <motion.div
            key={playing ? "hov" : "idle"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              background: playing
                ? "rgba(0,0,0,0.35)"          // hover while playing → dim only
                : "rgba(0,0,0,0.52)",          // idle → dark blur overlay
              backdropFilter: playing ? "blur(0px)" : "blur(3px)",
              WebkitBackdropFilter: playing ? "blur(0px)" : "blur(3px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.18, ease: easing }}
              className="flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              style={{
                width: 30, height: 30,
                border: "1.5px solid rgba(255,255,255,0.55)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              {playing
                ? <Pause size={11} className="text-white" />
                : <Play size={11} className="translate-x-px text-white" />
              }
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function MusicCard({ title, src, accent, artworkGradient: _g, artworkVariant = "double" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idRef = useRef(`mc-${Math.random().toString(36).slice(2)}`);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = "metadata";
    audio.volume = 1;
    audioRef.current = audio;

    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => { setPlaying(false); AudioBus.emit(AUDIO_EVENTS.FADE_IN_BACKGROUND); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);

    const off = AudioBus.on(AUDIO_EVENTS.CARD_PLAY, (id: unknown) => {
      if (id !== idRef.current && !audio.paused) { audio.pause(); setPlaying(false); }
    });

    return () => {
      off?.(); audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : 1;
  }, [muted]);

  const play = useCallback(() => {
    const a = audioRef.current; if (!a) return;
    AudioBus.emit(AUDIO_EVENTS.CARD_PLAY, idRef.current);
    AudioBus.emit(AUDIO_EVENTS.FADE_OUT_BACKGROUND);
    a.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const pause = useCallback(() => {
    const a = audioRef.current; if (!a) return;
    a.pause(); setPlaying(false);
    AudioBus.emit(AUDIO_EVENTS.FADE_IN_BACKGROUND);
  }, []);

  const restart = useCallback(() => {
    const a = audioRef.current; if (!a) return;
    a.currentTime = 0;
    if (!playing) play();
  }, [playing, play]);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current; if (!a || !duration) return;
    a.currentTime = (Number(e.target.value) / 100) * duration;
    setCurrent(a.currentTime);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space" && document.activeElement === cardRef.current) {
      e.preventDefault(); playing ? pause() : play();
    }
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <motion.div
      ref={cardRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -3, scale: 1.006 }}
      className="relative rounded-2xl outline-none"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: `1px solid ${playing ? `${accent}55` : hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"}`,
        boxShadow: playing
          ? `0 0 0 1px ${accent}18, 0 20px 60px -20px ${accent}77, inset 0 1px 0 rgba(255,255,255,0.10)`
          : `0 8px 32px -14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
        transition: "border-color 350ms ease, box-shadow 350ms ease",
      }}
    >
      {/* accent glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-600"
        style={{ background: `radial-gradient(ellipse at 5% 50%, ${accent}14 0%, transparent 60%)`, opacity: playing ? 1 : 0 }}
      />
      {/* top shimmer */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent 8%, ${accent}77 40%, ${accent}bb 60%, transparent 92%)`,
          opacity: playing ? 1 : 0, transition: "opacity 400ms ease",
        }}
      />

      {/* ── Card body ── */}
      <div className="relative flex flex-1 items-center gap-4 p-4 sm:gap-5 sm:p-5">

        {/* ── Vinyl with play/pause on it ── */}
        <VinylArtwork
          accent={accent}
          variant={artworkVariant}
          playing={playing}
          onToggle={playing ? pause : play}
        />

        {/* ── Right side ── */}
        <div className="min-w-0 flex-1 flex flex-col gap-2">

          {/* status + title */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300"
                style={{ color: playing ? `${accent}dd` : "rgba(255,255,255,0.30)" }}>
                {playing ? "Now Playing" : "Ready"}
              </span>
              {playing && <EqBars accent={accent} />}
            </div>
            <h3 className="font-display mt-0.5 truncate text-base font-light text-white sm:text-lg"
              style={{ letterSpacing: "0.015em" }}>
              {title}
            </h3>
          </div>

          {/* progress bar */}
          <div className="relative"
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
            onTouchStart={() => setDragging(true)}
            onTouchEnd={() => setDragging(false)}
          >
            <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${accent}cc, rgba(255,255,255,0.65))`,
                  boxShadow: playing ? `0 0 8px ${accent}88` : "none",
                  transition: dragging ? "none" : "width 200ms linear",
                }}
              />
            </div>
            {/* thumb */}
            <div aria-hidden className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white"
              style={{
                left: `${progress}%`,
                width: hovered || dragging ? 9 : 5,
                height: hovered || dragging ? 9 : 5,
                boxShadow: `0 0 5px ${accent}88`,
                opacity: progress > 0 ? 1 : 0,
                transition: "width 150ms ease, height 150ms ease",
              }}
            />
            <input type="range" min={0} max={100} value={progress} onChange={seek}
              aria-label={`Seek ${title}`}
              className="absolute left-0 top-1/2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
              style={{ height: 36, opacity: 0 }}
            />
          </div>

          {/* ── Bottom controls row ── */}
          <div className="flex items-center gap-2">

            {/* restart */}
            <motion.button
              onClick={restart}
              aria-label={`Restart ${title}`}
              whileHover={{ scale: 1.12, rotate: -25 }}
              whileTap={{ scale: 0.86, rotate: -50 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
              className="grid shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white/50 outline-none transition-colors hover:border-white/22 hover:bg-white/10 hover:text-white/90"
              style={{ width: 32, height: 32 }}
            >
              <RotateCcw size={12} />
            </motion.button>

            {/* time elapsed */}
            <span className="tabular-nums text-[11px] text-white/40 w-8 text-right shrink-0">
              {formatTime(current)}
            </span>

            {/* spacer */}
            <div className="flex-1" />

            {/* time total */}
            <span className="tabular-nums text-[11px] text-white/25 w-8 shrink-0">
              {formatTime(duration)}
            </span>

            {/* mute / unmute */}
            <motion.button
              onClick={() => setMuted(m => !m)}
              aria-label={muted ? "Unmute" : "Mute"}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.86 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="grid shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white/45 outline-none transition-colors hover:border-white/22 hover:bg-white/10 hover:text-white/90"
              style={{ width: 32, height: 32 }}
            >
              {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </motion.button>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
