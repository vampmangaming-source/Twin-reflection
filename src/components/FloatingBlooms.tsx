import { useMemo } from "react";

type Props = {
  src: string;
  count?: number;
  alt: string;
};

/**
 * Slow-floating decorative blooms placed at deterministic positions that
 * avoid the central text column.
 */
export function FloatingBlooms({ src, count = 5, alt }: Props) {
  const items = useMemo(() => {
    const slots = [
      { top: 10, left: 4, size: 90, dur: 11, delay: 0, rot: -8 },
      { top: 26, left: 84, size: 72, dur: 14, delay: 1.5, rot: 12 },
      { top: 58, left: 3, size: 84, dur: 13, delay: 0.8, rot: 6 },
      { top: 72, left: 85, size: 100, dur: 16, delay: 2.2, rot: -10 },
      { top: 42, left: 88, size: 64, dur: 12, delay: 3, rot: 4 },
      { top: 84, left: 8, size: 70, dur: 15, delay: 1.1, rot: -4 },
    ];
    return slots.slice(0, count);
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it, i) => (
        <img
          key={i}
          src={src}
          alt={alt}
          loading="lazy"
          width={128}
          height={128}
          className="absolute opacity-90 select-none"
          style={{
            top: `${it.top}%`,
            left: `${it.left}%`,
            width: `${it.size}px`,
            height: "auto",
            transform: `rotate(${it.rot}deg)`,
            animation: `float-soft ${it.dur}s ease-in-out ${it.delay}s infinite`,
            willChange: "transform",
            filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.35))",
          }}
        />
      ))}
    </div>
  );
}
