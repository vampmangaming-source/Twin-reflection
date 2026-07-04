import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import finaleHeart from "@/assets/finale-heart.jpg.asset.json";
import lanternAsset from "@/assets/lantern.png.asset.json";
import { easing } from "@/lib/motion";

export const Route = createFileRoute("/finale")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Souhayla & Ermina" },
      {
        name: "description",
        content: "A quiet, magical ending for Souhayla and Ermina.",
      },
    ],
  }),
  component: FinalePage,
});

const FINALE_SEEN_KEY = "finale-seen";

function LivingBackground() {
  // deterministic particle positions so SSR/CSR match
  const particles = Array.from({ length: 26 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    size: 2 + ((i * 7) % 3),
    dur: 14 + ((i * 3) % 10),
    delay: -((i * 5) % 18),
  }));
  const stars = Array.from({ length: 34 }, (_, i) => ({
    left: (i * 29 + 7) % 100,
    top: (i * 41 + 13) % 100,
    dur: 3 + ((i * 2) % 5),
    delay: -((i * 3) % 6),
    size: 1 + ((i * 5) % 2),
  }));
  const shootingStars = [
    { top: "18%", left: "8%", delay: 6, sx: 520, sy: 240 },
    { top: "62%", left: "72%", delay: 18, sx: -420, sy: 180 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* mist */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 80%, rgba(120,170,255,0.10), transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(90,220,190,0.08), transparent 55%)",
          filter: "blur(30px)",
        }}
      />
      {/* moving light rays */}
      <div
        className="absolute -inset-x-40 top-0 h-[60vh]"
        style={{
          background:
            "linear-gradient(115deg, transparent 40%, rgba(255,220,150,0.06) 50%, transparent 60%)",
          animation: "light-ray-drift 26s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -inset-x-40 bottom-0 h-[60vh]"
        style={{
          background:
            "linear-gradient(295deg, transparent 40%, rgba(120,170,255,0.05) 50%, transparent 60%)",
          animation: "light-ray-drift 34s ease-in-out -8s infinite",
        }}
      />

      {/* twinkling stars */}
      {stars.map((s, i) => (
        <span
          key={`s${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: 0.85,
            boxShadow: "0 0 6px rgba(255,255,255,0.7)",
            animation: `star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* floating glowing particles */}
      {particles.map((p, i) => (
        <span
          key={`p${i}`}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: "rgba(255,225,170,0.85)",
            boxShadow: "0 0 8px rgba(255,220,150,0.7)",
            animation: `particle-rise ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* rare shooting stars */}
      {shootingStars.map((sh, i) => (
        <span
          key={`sh${i}`}
          className="absolute h-[2px] w-24 rounded-full"
          style={
            {
              top: sh.top,
              left: sh.left,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0))",
              filter: "drop-shadow(0 0 6px rgba(255,255,255,0.7))",
              animation: `shooting-star 3.6s ease-out ${sh.delay}s infinite`,
              "--sx": `${sh.sx}px`,
              "--sy": `${sh.sy}px`,
              "--sa": "-20deg",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function FinalePage() {
  const sparkles = Array.from({ length: 12 }, (_, i) => i);
  const trailParticles = Array.from({ length: 10 }, (_, i) => i);

  // FIX: on first visit play the full cinematic sequence (5.2s h1 delay).
  // On revisit (sessionStorage flag set) skip to a shorter 2.6s delay so
  // users don't sit through 5+ seconds of blank screen a second time.
  const [revisit, setRevisit] = useState(false);
  useEffect(() => {
    const seen = sessionStorage.getItem(FINALE_SEEN_KEY) === "1";
    if (seen) {
      setRevisit(true);
    } else {
      sessionStorage.setItem(FINALE_SEEN_KEY, "1");
    }
  }, []);

  const h1Delay = revisit ? 2.6 : 5.2;
  const btnDelay = revisit ? 3.4 : 6;

  return (
    <PageTransition>
      <div
        className="relative min-h-dvh overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, #0a1a36 0%, #060d1a 60%, #050a14 100%)",
        }}
      >
        <LivingBackground />

        <section className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
          {/* orbs converging + golden bloom */}
          <div
            className="relative mx-auto mb-16"
            style={{ width: "min(560px, 90vw)", height: "220px" }}
          >
            {/* blue orb */}
            <motion.div
              className="absolute top-1/2 h-20 w-20 -translate-y-1/2 rounded-full"
              initial={{ left: "0%", x: "-20%", opacity: 0, scale: 0.8 }}
              animate={{
                left: ["0%", "0%", "50%"],
                x: ["-20%", "-20%", "-50%"],
                opacity: [0, 1, 1],
                scale: [0.8, 1, 0.9],
              }}
              transition={{ duration: 4.5, times: [0, 0.35, 1], ease: easing }}
              style={{
                background:
                  "radial-gradient(circle, #E8EEF9 0%, #2962FF 40%, rgba(15,61,145,0) 75%)",
                boxShadow: "0 0 60px rgba(41,98,255,0.7)",
              }}
            />
            {/* green orb */}
            <motion.div
              className="absolute top-1/2 h-20 w-20 -translate-y-1/2 rounded-full"
              initial={{ right: "0%", x: "20%", opacity: 0, scale: 0.8 }}
              animate={{
                right: ["0%", "0%", "50%"],
                x: ["20%", "20%", "50%"],
                opacity: [0, 1, 1],
                scale: [0.8, 1, 0.9],
              }}
              transition={{ duration: 4.5, times: [0, 0.35, 1], ease: easing, delay: 0.4 }}
              style={{
                background:
                  "radial-gradient(circle, #EAF7EF 0%, #1FA971 40%, rgba(15,122,82,0) 75%)",
                boxShadow: "0 0 60px rgba(31,169,113,0.7)",
              }}
            />
            {/* golden bloom — descends slightly then fades toward the message */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 0, 1, 0.9, 0],
                scale: [0.4, 0.4, 1.2, 1.1, 0.95],
                y: [0, 0, 0, 40, 90],
              }}
              transition={{ duration: 7, times: [0, 0.55, 0.7, 0.88, 1], ease: easing }}
              style={{
                background:
                  "radial-gradient(circle, #FFF3C4 0%, #FFD070 40%, rgba(255,180,80,0) 75%)",
                boxShadow: "0 0 80px rgba(255,210,130,0.85)",
              }}
            />
            {/* shimmering descent trail */}
            {trailParticles.map((i) => (
              <motion.span
                key={`t${i}`}
                aria-hidden
                className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-[#FFE9A8]"
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 0, 0.9, 0],
                  x: [0, 0, (i - 5) * 5, (i - 5) * 8],
                  y: [0, 0, 40 + i * 6, 120 + i * 10],
                }}
                transition={{
                  duration: 7,
                  times: [0, 0.7, 0.86, 1],
                  ease: "easeOut",
                  delay: 0.05 * i,
                }}
                style={{ boxShadow: "0 0 6px rgba(255,220,140,0.9)" }}
              />
            ))}
            {/* sparkles */}
            {sparkles.map((i) => {
              const angle = (i / sparkles.length) * Math.PI * 2;
              const distance = 90 + (i % 3) * 20;
              return (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#FFE9A8]"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 0, 1, 0],
                    x: [0, 0, Math.cos(angle) * distance, Math.cos(angle) * distance * 1.6],
                    y: [0, 0, Math.sin(angle) * distance, Math.sin(angle) * distance * 1.6 - 40],
                  }}
                  transition={{ duration: 6, times: [0, 0.55, 0.75, 1], ease: "easeOut", delay: i * 0.05 }}
                  style={{ boxShadow: "0 0 10px rgba(255,220,140,0.9)" }}
                />
              );
            })}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: h1Delay, ease: easing }}
            className="font-display flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-light text-white"
            style={{
              fontSize: "clamp(26px, 5vw, 46px)",
              lineHeight: 1.2,
              letterSpacing: "0.02em",
            }}
          >
            <span>Happy Birthday, Souhayla &amp; Ermina</span>
            <img
              src={finaleHeart.url}
              alt=""
              aria-hidden
              draggable={false}
              className="inline-block h-8 w-8 rounded-full object-cover align-middle sm:h-10 sm:w-10"
              style={{
                filter:
                  "drop-shadow(0 0 12px rgba(120,180,255,0.55)) drop-shadow(0 0 22px rgba(90,220,190,0.35))",
              }}
            />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: btnDelay, ease: easing }}
            className="mt-12"
          >
            <Link
              to="/"
              className="group ease-luxury relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border px-7 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 active:translate-y-0"
              style={{
                borderColor: "rgba(255,220,150,0.35)",
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                /* FIX: soft-breathe only animates box-shadow, not transform.
                   Previously animating transform here conflicted with Framer's
                   whileHover y-transform. Now breathing is shadow-only. */
                animation: "soft-breathe 4.5s ease-in-out infinite",
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,220,140,0.28), transparent 70%)",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-active:animate-[button-ripple_0.7s_ease-out]"
                style={{ background: "rgba(255,230,170,0.5)" }}
              />
              <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="absolute h-1 w-1 rounded-full"
                    style={{
                      left: `${18 + i * 20}%`,
                      top: `${25 + (i % 2) * 50}%`,
                      background: "#FFE9A8",
                      boxShadow: "0 0 8px rgba(255,220,140,0.9)",
                      animation: `star-twinkle ${1.6 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </span>
              <span className="relative" aria-hidden>↺</span>
              <span className="relative">Begin Again</span>
            </Link>
          </motion.div>
        </section>

        {/* Final lantern — plays once, ~7s after content settles */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 z-[15] -translate-x-1/2"
          style={{
            animation: "final-lantern-rise 14s ease-out 7s 1 forwards",
            opacity: 0,
          }}
        >
          <img
            src={lanternAsset.url}
            alt=""
            width={72}
            height={100}
            draggable={false}
            style={{
              width: 72,
              height: "auto",
              filter:
                "drop-shadow(0 0 20px rgba(255,200,110,0.7)) drop-shadow(0 0 40px rgba(255,150,60,0.35))",
            }}
          />
        </div>
      </div>
    </PageTransition>
  );
}
