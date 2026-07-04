import { useEffect, useRef } from "react";
import bgAsset from "@/assets/bg-music.mp3.asset.json";
import { AudioBus, AUDIO_EVENTS } from "@/lib/audio-bus";

const TARGET_VOLUME = 0.22;

/**
 * Global soundtrack. Silent until the visitor presses "Begin" on the
 * landing page. Fades out when a music card plays, fades back after.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(bgAsset.url);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    const clearFade = () => {
      if (fadeRef.current) {
        window.clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    };

    const fadeTo = (target: number, ms = 1000) => {
      clearFade();
      const start = audio.volume;
      const startTime = performance.now();
      fadeRef.current = window.setInterval(() => {
        const t = Math.min(1, (performance.now() - startTime) / ms);
        audio.volume = start + (target - start) * t;
        if (t >= 1) {
          clearFade();
          // Do NOT pause when reaching 0 — keep playing silently so
          // fadeIn never needs to call play() again (avoids autoplay block)
        }
      }, 30);
    };

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      audio.play().then(() => fadeTo(TARGET_VOLUME, 1400)).catch(() => {
        // autoplay might still be blocked; retry on next user gesture
        const retry = () => {
          audio.play().then(() => fadeTo(TARGET_VOLUME, 1400)).catch(() => {});
          window.removeEventListener("pointerdown", retry);
        };
        window.addEventListener("pointerdown", retry, { once: true });
      });
    };

    const fadeOut = () => fadeTo(0, 900);
    const fadeIn = () => {
      if (!startedRef.current) return;
      // Resume play if somehow paused, then fade back in
      if (audio.paused) {
        audio.play().catch(() => {});
      }
      fadeTo(TARGET_VOLUME, 1200);
    };

    const offs = [
      AudioBus.on(AUDIO_EVENTS.START_BACKGROUND, start),
      AudioBus.on(AUDIO_EVENTS.FADE_OUT_BACKGROUND, fadeOut),
      AudioBus.on(AUDIO_EVENTS.FADE_IN_BACKGROUND, fadeIn),
    ];

    return () => {
      offs.forEach((off) => off?.());
      clearFade();
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  return null;
}
