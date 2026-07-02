import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: "admin@horsevally.local",
      password,
    });
    if (error) {
      toast.error("Onjuist wachtwoord");
      setLoading(false);
      return;
    }
    toast.success("Welkom terug");
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center font-display text-2xl italic text-accent">
          Horse Vally
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-display text-2xl mb-1">Admin</h1>
          <p className="text-sm text-muted-foreground mb-6">Voer het wachtwoord in om verder te gaan.</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Bezig…" : "Inloggen"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

