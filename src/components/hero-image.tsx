'use client';
import { getImageProps } from 'next/image';
import { useState } from 'react';
const alt = 'An illuminated timber cabin framed by pines and the peaks of the Dolomites';
export function HeroImage() {
  const [failed, setFailed] = useState(false);
  const { props: desktop } = getImageProps({
    src: '/images/alpine.webp',
    alt,
    fill: true,
    sizes: '100vw',
    loading: 'eager',
    fetchPriority: 'high',
  });
  const { props: mobile } = getImageProps({
    src: '/images/alpine-portrait.webp',
    alt,
    width: 576,
    height: 1024,
    sizes: '100vw',
  });
  if (failed) return <div className="image-fallback hero-image" role="img" aria-label={alt} />;
  // Next's documented art-direction pattern keeps both crops optimized without double preloads.
  return (
    <picture>
      <source media="(max-width: 600px)" srcSet={mobile.srcSet} sizes="100vw" />
      <img
        {...desktop}
        alt={alt}
        className="hero-image"
        ref={(node) => {
          // A failed eager request can finish before React attaches onError.
          if (node?.complete && node.naturalWidth === 0) setFailed(true);
        }}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
