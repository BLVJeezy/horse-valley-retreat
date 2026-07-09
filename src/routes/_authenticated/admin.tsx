import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Uitgelogd");
    navigate({ to: "/auth" });
  }

  const links = [
    { to: "/admin", label: "Beschikbaarheid" },
    { to: "/admin/tarieven", label: "Tarieven & seizoenen" },
    { to: "/admin/kalendersync", label: "Kalendersync" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="font-display text-xl italic text-accent">
            Horse Vally
          </Link>
          <nav className="flex items-center gap-1">
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
          <Button variant="outline" size="sm" onClick={signOut}>
            Uitloggen
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
