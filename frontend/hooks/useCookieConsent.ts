"use client";

import { useEffect, useState } from "react";

type ConsentValue = "all" | "essential" | null;

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("freehunt_cookie_consent");
    const validConsent: ConsentValue = stored === "all" || stored === "essential" ? stored : null;
    setConsent(validConsent);
    setIsLoaded(true);
  }, []);

  const setConsentChoice = (choice: "all" | "essential") => {
    localStorage.setItem("freehunt_cookie_consent", choice);
    setConsent(choice);
  };

  return {
    consent,
    isLoaded,
    hasConsent: consent !== null,
    allowsTracking: consent === "all",
    setConsentChoice,
  };
}
