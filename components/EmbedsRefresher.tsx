"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function EmbedsRefresher() {
  const pathname = usePathname();

  useEffect(() => {
    // Brief timeout to ensure the new article DOM has finished rendering
    const timer = setTimeout(() => {
      // 1. Re-trigger Twitter widgets if present
      if ((window as any).twttr?.widgets) {
        (window as any).twttr.widgets.load();
      }

      // 2. Re-trigger Instagram embeds if present
      if ((window as any).instgrm?.Embeds) {
        (window as any).instgrm.Embeds.process();
      }

      // 3. Re-trigger Getty Images embeds if present on the current page
      const gettyElements = document.querySelectorAll(".getty-embed");
      if (gettyElements.length > 0) {
        const existingScript = document.getElementById("getty-widget-script");
        if (existingScript) {
          existingScript.remove();
        }
        const script = document.createElement("script");
        script.id = "getty-widget-script";
        script.src = "https://embed-cdn.gettyimages.com/widgets/e.js";
        script.async = true;
        script.charset = "utf-8";
        document.body.appendChild(script);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}