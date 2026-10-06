'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    for (const element of elements) {
      // Never hide content that is already inside the initial viewport after hydration.
      if (element.getBoundingClientRect().top <= window.innerHeight * 0.92) {
        element.classList.add('is-visible');
        continue;
      }
      element.classList.add('reveal-pending');
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
