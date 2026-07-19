import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import logo from "../assets/misaq-logo.png.asset.json";
import { MisaqProviders } from "@/components/misaq/providers";
import { Toaster } from "@/components/ui/sonner";
import { useCmsConfig } from "@/lib/cms-config";

function CmsStyleInjector() {
  const [config] = useCmsConfig();
  
  useEffect(() => {
    let styleEl = document.getElementById("cms-theme-colors") as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "cms-theme-colors";
      document.head.appendChild(styleEl);
    }
    
    styleEl.innerHTML = `
      :root {
        --primary: ${config.primaryColor} !important;
        --secondary: ${config.secondaryColor} !important;
        --accent: ${config.accentColor} !important;
        --ring: ${config.primaryColor} !important;
      }
    `;
  }, [config.primaryColor, config.secondaryColor, config.accentColor]);

  return null;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-primary">404</h1>
        <p className="mt-4 text-muted-foreground">This page doesn't exist.</p>
        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-primary-foreground"
        >
          Return to Misaq
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "root" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-foreground">Something interrupted the moment</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-full bg-primary px-6 py-3 text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
      },
      { title: "Misaq — Islamic Matrimonial Platform" },
      {
        name: "description",
        content:
          "Misaq is a premium Islamic matrimonial platform where marriage is conducted with dignity, family involvement, and the values of the deen.",
      },
      { name: "theme-color", content: "#6B121F" },
      { property: "og:title", content: "Misaq — Islamic Matrimonial Platform" },
      {
        property: "og:description",
        content:
          "A trusted matrimonial platform built on Islamic values, with families at the centre.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Misaq" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: logo.url },
      { rel: "apple-touch-icon", href: logo.url },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Misaq ServiceWorker registered successfully:", reg.scope))
        .catch((err) => console.log("Misaq ServiceWorker registration failed:", err));
    }
  }, []);

  return (
    <html lang="en">
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
      <MisaqProviders>
        <CmsStyleInjector />
        <Outlet />
        <Toaster />
      </MisaqProviders>
    </QueryClientProvider>
  );
}
