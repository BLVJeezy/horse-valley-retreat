import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CalendarDays, Euro, RefreshCw, MapPin, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const links = [
  { to: "/admin" as const, label: "Beschikbaarheid", short: "Kalender", icon: CalendarDays },
  { to: "/admin/tarieven" as const, label: "Tarieven & seizoenen", short: "Tarieven", icon: Euro },
  { to: "/admin/kalendersync" as const, label: "Kalendersync", short: "Sync", icon: RefreshCw },
  { to: "/admin/locaties" as const, label: "Locaties", short: "Locaties", icon: MapPin },
];

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Uitgelogd");
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar: minimal on mobile (just logo + logout), full nav on desktop */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-6">
          <Link to="/" className="font-display text-xl italic text-accent">
            Horse Vally
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = path === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    active ? "bg-foreground text-white" : "hover:bg-muted"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <Button variant="outline" size="sm" onClick={signOut} className="shrink-0">
            <LogOut className="size-4 md:hidden" />
            <span className="hidden md:inline">Uitloggen</span>
          </Button>
        </div>
      </header>

      {/* Extra bottom padding on mobile so content never hides behind the fixed tab bar */}
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-10 pb-28 md:pb-10">
        <Outlet />
      </main>

      {/* Bottom tab bar — mobile only. Big tap targets, safe-area aware for iPhones. */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-4">
          {links.map((l) => {
            const active = path === l.to;
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-[11px] font-medium transition-colors ${
                  active ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                {l.short}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
