export function Footer() {
  return (
    <footer className="border-t border-border pt-20 pb-12 px-6 text-center">
      <div className="font-display text-4xl italic text-accent mb-6">Horse Vally</div>
      <div className="flex justify-center gap-6 text-[11px] text-muted-foreground uppercase tracking-[0.22em] mb-10">
        <span>Tongeren-Borgloon</span>
        <span aria-hidden>·</span>
        <span>Limburg, België</span>
      </div>
      <p className="text-[10px] text-muted-foreground/70 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} Horse Vally · Direct boeken bij de host
      </p>
    </footer>
  );
}
