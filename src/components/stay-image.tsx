'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
export function StayImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="image-fallback" role="img" aria-label={props.alt}>
      Elarven<span>A place worth picturing</span>
    </div>
  ) : (
    <Image {...props} alt={props.alt} onError={() => setFailed(true)} />
  );
}
