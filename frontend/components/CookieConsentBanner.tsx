"use client";

import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import Link from "next/link";

export default function CookieConsentBanner() {
  const { hasConsent, isLoaded, setConsentChoice } = useCookieConsent();

  if (!isLoaded || hasConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg animate-in slide-in-from-bottom-full duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-foreground mb-2">
              Nous utilisons des cookies pour améliorer votre expérience et
              analyser notre trafic.
            </p>
            <p className="text-xs text-muted-foreground">
              Consultez notre{" "}
              <Link href="/cookies" className="text-primary hover:underline">
                politique des cookies
              </Link>{" "}
              pour plus d&apos;informations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConsentChoice("essential")}
              className="text-foreground border-border hover:bg-muted"
            >
              Cookies essentiels uniquement
            </Button>
            <Button
              size="sm"
              onClick={() => setConsentChoice("all")}
              className="bg-foreground hover:bg-foreground/90 text-background"
            >
              Accepter tous les cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
