import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { NightSky } from "@/components/NightSky";
import { FloatingBlooms } from "@/components/FloatingBlooms";
import { WishWall } from "@/components/WishWall";
import { MagicalInterlude } from "@/components/MagicalInterlude";
import { PageTransition } from "@/components/PageTransition";
import { NavBack, FooterLink } from "@/components/PageNav";
import { easing } from "@/lib/motion";
import tulipAsset from "@/assets/tulip.png.asset.json";

const tulipImg = tulipAsset.url;

export const Route = createFileRoute("/ermina")({
  head: () => ({
    meta: [
      { title: "Ermina — Emerald light and gentle warmth" },
      { name: "description", content: "A birthday tribute to Ermina." },
    ],
  }),
  component: ErminaPage,
});

function ErminaPage() {
  return (
    <PageTransition>
      <div className="page-scrollable relative min-h-dvh" style={{ background: "#07160F" }}>
        <NightSky variant="emerald" />

        {/* soft green rays */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(31,169,113,0.07) 45%, transparent 55%), linear-gradient(95deg, transparent 60%, rgba(31,169,113,0.05) 72%, transparent 82%)",
          }}
        />

        {/* forest silhouettes */}
        <svg
          aria-hidden
          className="pointer-events-none fixed bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
          style={{ height: "180px", opacity: 0.55 }}
        >
          <path
            d="M0,200 L60,160 L80,180 L120,120 L150,160 L200,100 L240,160 L300,140 L350,80 L400,140 L460,120 L520,180 L580,140 L640,90 L700,150 L760,120 L820,170 L880,100 L940,150 L1000,130 L1060,170 L1120,110 L1180,150 L1240,90 L1300,150 L1360,130 L1440,180 L1440,240 L0,240 Z"
            fill="#04100A"
          />
          <path
            d="M0,220 L80,180 L160,210 L240,170 L320,200 L400,160 L480,200 L560,170 L640,200 L720,160 L800,200 L880,170 L960,200 L1040,160 L1120,200 L1200,170 L1280,200 L1360,180 L1440,210 L1440,240 L0,240 Z"
            fill="#020A06"
          />
        </svg>

        <NavBack to="/" label="Back" />

        <section className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
          <FloatingBlooms src={tulipImg} alt="" count={5} />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing }}
            className="font-display relative font-light"
            style={{
              color: "#EAF7EF",
              letterSpacing: "0.04em",
              fontSize: "clamp(42px, 8vw, 72px)",
              lineHeight: 1.05,
              textShadow: "0 4px 40px rgba(31,169,113,0.25)",
            }}
          >
            Ermina
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing }}
            className="font-body relative mt-8 text-xl italic text-white/70 sm:text-2xl"
          >
            A heart full of kindness, a soul that blooms with love. Happy Birthday.
          </motion.p>

          {/* FIX: mt-4 → mt-6 for clear typographic separation between subtitle lines */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: easing }}
            className="font-body relative mt-6 text-base italic text-white/45 sm:text-lg"
          >
            Kindness that blossoms wherever you go.
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4, ease: easing }}
            aria-hidden
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1.5 text-white/25"
            >
              <span className="text-xs tracking-widest uppercase" style={{ letterSpacing: "0.2em" }}>scroll</span>
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.div>
        </section>

        <section className="relative z-10 mx-auto max-w-5xl px-6">
          <MagicalInterlude accent="#1FA971" variant="emerald" />
        </section>

        <section className="relative z-10 mx-auto max-w-3xl px-6 pb-16 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easing }}
            className="mx-auto"
            style={{
              maxWidth: "700px",
              padding: "40px",
              borderRadius: "20px",
              /* FIX: emerald bg (#07160F) is very dark — raised glass opacity and border
                 so the card is clearly visible against the deep green background */
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6)",
            }}
          >
              <p className="font-body text-xl italic leading-relaxed text-white/85 sm:text-2xl">
                A heart so gentle is a blessing to everyone who knows you.
              </p>
          </motion.div>
        </section>

        <div className="relative z-10">
          <WishWall
            who="ermina"
            accent="#1FA971"
            placeholder="Write a wish and let your lantern brighten the forest..."
          />
        </div>

        <FooterLink to="/together" label="Together" />
      </div>
    </PageTransition>
  );
}
