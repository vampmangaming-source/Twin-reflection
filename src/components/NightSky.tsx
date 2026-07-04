import { useMemo } from "react";

type Props = {
  variant: "sapphire" | "emerald";
};

/** Deterministic pseudo-random from seed — avoids SSR/CSR hydration mismatch. */
function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Subtle atmospheric backdrop: radial gradient + tiny twinkling stars +
 * faint glow accent. GPU-friendly: only opacity animates.
 */
export function NightSky({ variant }: Props) {
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        top: rand(i * 1.7 + 0.3) * 100,
        left: rand(i * 3.1 + 0.7) * 100,
        size: rand(i * 5.3 + 1.1) * 1.6 + 0.4,
        delay: rand(i * 7.9 + 2.3) * 6,
        duration: 3 + rand(i * 9.1 + 4.7) * 5,
      })),
    [],
  );

  const isSapphire = variant === "sapphire";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* base radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isSapphire
            ? "radial-gradient(ellipse at 30% 20%, #122a5a 0%, #0a1530 35%, #08111F 70%)"
            : "radial-gradient(ellipse at 70% 80%, #0f3a28 0%, #0a2418 35%, #07160F 70%)",
        }}
      />

      {/* soft accent glow */}
      <div
        className="absolute"
        style={{
          top: isSapphire ? "-10%" : "60%",
          right: isSapphire ? "-5%" : "auto",
          left: isSapphire ? "auto" : "-10%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: isSapphire
            ? "radial-gradient(circle, rgba(220,230,255,0.12) 0%, rgba(220,230,255,0) 60%)"
            : "radial-gradient(circle, rgba(120,220,160,0.10) 0%, rgba(120,220,160,0) 60%)",
          filter: "blur(20px)",
        }}
      />

      {/* haze */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* stars */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            willChange: "opacity",
          }}
        />
      ))}
    </div>
  );
}
