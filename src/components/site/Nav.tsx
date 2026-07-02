import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

export function Nav({ mode = "light" }: { mode?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#woning", label: "De woning" },
    { href: "/#omgeving", label: "Omgeving" },
    { href: "/galerij", label: "Galerij", isRoute: true },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="px-6 py-4 md:px-12 md:py-5 flex justify-between items-center text-foreground">
        <Link to="/" className="font-display text-2xl italic tracking-tight" onClick={() => setOpen(false)}>
          Horse Vally
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.22em] font-medium">
          {links.map((l) =>
            l.isRoute ? (
              <Link key={l.href} to={l.href} className="text-foreground/70 hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href} className="text-foreground/70 hover:text-foreground transition-colors">
                {l.label}
              </a>
            )
          )}
        </div>

        {/* Hamburger (mobiel) */}
        <button
          type="button"
          aria-label={open ? "Sluit menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-foreground"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobiel dropdown menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-black/5 px-6 py-6 flex flex-col gap-5 text-sm uppercase tracking-[0.2em] font-medium">
          {links.map((l) =>
            l.isRoute ? (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            )
          )}
        </div>
      )}
    </nav>
  );
}
