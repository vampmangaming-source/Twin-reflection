import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { NightSky } from "@/components/NightSky";
import { FloatingBlooms } from "@/components/FloatingBlooms";
import { WishWall } from "@/components/WishWall";
import { MagicalInterlude } from "@/components/MagicalInterlude";
import { PageTransition } from "@/components/PageTransition";
import { NavBack, FooterLink } from "@/components/PageNav";
import { easing } from "@/lib/motion";
import roseImg from "@/assets/rose.png";

export const Route = createFileRoute("/souhayla")({
  head: () => ({
    meta: [
      { title: "Souhayla — Sapphire skies and moonlit grace" },
      { name: "description", content: "A birthday tribute to Souhayla." },
    ],
  }),
  component: SouhaylaPage,
});

function SouhaylaPage() {
  return (
    <PageTransition>
      <div className="page-scrollable relative min-h-dvh" style={{ background: "#08111F" }}>
        <NightSky variant="sapphire" />

        {/* moon */}
        <div
          aria-hidden
          className="pointer-events-none fixed right-[6%] top-[8%] hidden md:block"
          style={{
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, rgba(230,238,255,0.18), rgba(230,238,255,0.06) 45%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />

        <NavBack to="/" label="Back" />

        <section className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
          <FloatingBlooms src={roseImg} alt="" count={5} />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing }}
            className="font-display relative font-light"
            style={{
              color: "#E8EEF9",
              letterSpacing: "0.04em",
              fontSize: "clamp(42px, 8vw, 72px)",
              lineHeight: 1.05,
              textShadow: "0 4px 40px rgba(41,98,255,0.25)",
            }}
          >
            Souhayla
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing }}
            className="font-body relative mt-8 text-xl italic text-white/70 sm:text-2xl"
          >
            Strong, graceful, and truly one of a kind.
          </motion.p>
        </section>

        <section className="relative z-10 mx-auto max-w-5xl px-6">
          <MagicalInterlude accent="#2962FF" variant="sapphire" />
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
              /* FIX: slightly higher glass opacity + stronger border — readable on sapphire bg */
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6)",
            }}
          >
            <p className="font-body text-xl italic leading-relaxed text-white/85 sm:text-2xl">
              May Allah surround you with goodness, protect you from every
              hardship, and give you everything you have silently wished for.
            </p>
          </motion.div>
        </section>

        <div className="relative z-10">
          <WishWall
            who="souhayla"
            accent="#2962FF"
            placeholder="Every wish becomes a lantern. What's urs?"
          />
        </div>

        <FooterLink to="/together" label="Together" />
      </div>
    </PageTransition>
  );
}
