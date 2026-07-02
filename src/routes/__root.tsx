import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl italic text-accent">404</h1>
        <h2 className="mt-4 font-display text-2xl">Pagina niet gevonden</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Deze pagina bestaat niet meer, of is verhuisd naar een rustiger plekje.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-foreground/90"
          >
            Terug naar de woning
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Er ging iets mis</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Probeer het opnieuw, of stuur ons een berichtje als het blijft haperen.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-foreground/90"
          >
            Opnieuw proberen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Naar de startpagina
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Horse Vally — Vakantiewoning in Tongeren-Borgloon" },
      {
        name: "description",
        content:
          "Stijlvolle vakantiewoning voor 8 gasten in Tongeren-Borgloon. Rustige tuin met trampoline, overdekte lounge en volledig uitgeruste keuken. Direct boeken bij de host.",
      },
      { name: "author", content: "Horse Vally" },
      { property: "og:title", content: "Horse Vally — Vakantiewoning in Tongeren-Borgloon" },
      {
        property: "og:description",
        content:
          "Stijlvolle vakantiewoning voor 8 gasten in Belgisch Limburg. Rust, ruimte en dichtbij Tongeren.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "nl_BE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Horse Vally — Vakantiewoning in Tongeren-Borgloon" },
      { name: "description", content: "Book a stylish, private holiday home in Belgium for groups and families. Enjoy direct booking for a countryside escape." },
      { property: "og:description", content: "Book a stylish, private holiday home in Belgium for groups and families. Enjoy direct booking for a countryside escape." },
      { name: "twitter:description", content: "Book a stylish, private holiday home in Belgium for groups and families. Enjoy direct booking for a countryside escape." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7675c1cc-b902-49e5-900c-ca7c704c2ad5/id-preview-de7d3726--f9e1f40c-0144-4ed6-8bf6-f8b01afae71d.lovable.app-1783003384661.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7675c1cc-b902-49e5-900c-ca7c704c2ad5/id-preview-de7d3726--f9e1f40c-0144-4ed6-8bf6-f8b01afae71d.lovable.app-1783003384661.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

