"use client";

import { useEffect, useState } from "react";

type ConsentValue = "all" | "essential" | null;

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(
      "freehunt_cookie_consent",
    ) as ConsentValue;
    setConsent(stored);
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
