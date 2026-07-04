import { Link } from "@tanstack/react-router";

type NavBackProps = { to: string; label: string };
type FooterLinkProps = { to: string; label: string };

export function NavBack({ to, label }: NavBackProps) {
  return (
    <Link
      to={to}
      className="ease-luxury fixed left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      <span aria-hidden>←</span> {label}
    </Link>
  );
}

export function FooterLink({ to, label }: FooterLinkProps) {
  return (
    <div className="relative z-10 flex justify-center pb-16">
      <Link
        to={to}
        className="ease-luxury inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {label}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
