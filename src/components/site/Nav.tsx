import { Link } from "@tanstack/react-router";

export function Nav({ mode = "light" }: { mode?: "light" | "dark" }) {
  const linkClass =
    mode === "dark"
      ? "text-white/90 hover:text-white transition-colors"
      : "text-foreground/70 hover:text-foreground transition-colors";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-12 md:py-6 flex justify-between items-center ${
        mode === "dark" ? "text-white" : "text-foreground"
      }`}
      style={mode === "dark" ? { mixBlendMode: "difference" } : undefined}
    >
      <Link to="/" className="font-display text-2xl italic tracking-tight">
        Horse Vally
      </Link>
      <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.22em] font-medium">
        <a href="/#woning" className={linkClass}>De woning</a>
        <a href="/#omgeving" className={linkClass}>Omgeving</a>
        <Link to="/galerij" className={linkClass}>Galerij</Link>
        <a href="/#contact" className={linkClass}>Contact</a>
      </div>
    </nav>
  );
}
