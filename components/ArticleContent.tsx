"use client";

import React, { useEffect, useRef } from 'react';

export default function ArticleContent({ html, className }: { html: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // This grabs the blocked scripts and forces the browser to execute them
    const scripts = containerRef.current.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    // Triggers Getty Images globally if present
    if (typeof window !== 'undefined' && (window as any).gie) {
      try { (window as any).gie(function() { if ((window as any).gie.widgets) { (window as any).gie.widgets.load(); } }); } catch (e) {}
    }
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}