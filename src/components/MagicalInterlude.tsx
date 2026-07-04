import lanternAsset from "@/assets/lantern.png.asset.json";

type Props = {
  accent: string;
  variant?: "sapphire" | "emerald";
};

const lanternUrl = lanternAsset.url;

// Deterministic pseudo-random so the layout is stable per render
function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function MagicalInterlude({ accent, variant = "sapphire" }: Props) {
  const lanterns = Array.from({ length: 3 }).map((_, i) => {
    const seed = i + 1;
    const left = 18 + rand(seed * 3.1) * 64;
    const top = 20 + rand(seed * 5.7) * 55;
    const size = 34 + Math.floor(rand(seed * 7.3) * 18);
    const duration = 18 + rand(seed * 9.1) * 10;
    const delay = -rand(seed * 11.7) * 20;
    const glowDur = 5 + rand(seed * 13.5) * 3;
    return { left, top, size, duration, delay, glowDur, key: i };
  });

  const stars = Array.from({ length: 22 }).map((_, i) => {
    const seed = i + 100;
    const left = rand(seed * 2.3) * 100;
    const top = rand(seed * 4.9) * 100;
    const size = 1 + rand(seed * 6.1) * 1.6;
    const duration = 3 + rand(seed * 8.3) * 4;
    const delay = -rand(seed * 10.9) * 5;
    return { left, top, size, duration, delay, key: i };
  });

  const particles = Array.from({ length: 10 }).map((_, i) => {
    const seed = i + 300;
    const left = rand(seed * 3.7) * 100;
    const size = 2 + rand(seed * 5.3) * 2;
    const duration = 22 + rand(seed * 7.9) * 14;
    const delay = -rand(seed * 9.5) * 30;
    return { left, size, duration, delay, key: i };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto w-full max-w-4xl overflow-hidden"
      style={{ height: "clamp(220px, 34vh, 360px)" }}
    >
      {/* soft central glow */}
      <div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          animation: "interlude-pulse 7s ease-in-out infinite",
        }}
      />

      {/* twinkling stars */}
      {stars.map((s) => (
        <span
          key={`star-${s.key}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: 0.6,
            boxShadow: "0 0 4px rgba(255,255,255,0.7)",
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* drifting particles rising upward */}
      {particles.map((p) => (
        <span
          key={`p-${p.key}`}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background:
              variant === "emerald"
                ? "rgba(180, 240, 200, 0.85)"
                : "rgba(200, 220, 255, 0.85)",
            boxShadow:
              variant === "emerald"
                ? "0 0 8px rgba(120, 220, 160, 0.7)"
                : "0 0 8px rgba(140, 180, 255, 0.7)",
            animation: `particle-rise ${p.duration}s linear ${p.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* softly swaying lanterns */}
      {lanterns.map((l) => (
        <img
          key={`l-${l.key}`}
          src={lanternUrl}
          alt=""
          width={64}
          height={90}
          loading="lazy"
          draggable={false}
          className="absolute"
          style={{
            left: `${l.left}%`,
            top: `${l.top}%`,
            width: `${l.size}px`,
            height: "auto",
            animation: `lantern-sway ${l.duration}s ease-in-out ${l.delay}s infinite, lantern-glow ${l.glowDur}s ease-in-out infinite`,
            willChange: "transform, filter",
          }}
        />
      ))}
    </div>
  );
}
