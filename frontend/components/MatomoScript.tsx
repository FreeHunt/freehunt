'use client';

import { useCookieConsent } from "@/hooks/useCookieConsent";
import Script from 'next/script';

export default function MatomoScript() {
  const { allowsTracking, isLoaded } = useCookieConsent();
  const matomoUrl =
    process.env.NEXT_PUBLIC_MATOMO_URL || "http://localhost:8090/";

  if (!isLoaded || !allowsTracking) {
    return null;
  }

  return (
    <Script id="matomo" strategy="afterInteractive">
      {`
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u='${matomoUrl}';
          _paq.push(['setTrackerUrl', u + 'matomo.php']);
          _paq.push(['setSiteId', '${process.env.NEXT_PUBLIC_MATOMO_SITE_ID || '1'}']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src=u + 'matomo.js'; s.parentNode.insertBefore(g, s);
        })();
      `}
    </Script>
  );
}
