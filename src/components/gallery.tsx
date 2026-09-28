'use client';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import type { Stay } from '@/lib/stays';
import { StayImage } from './stay-image';
import { trapDialogFocus } from '@/lib/dialog';
export function Gallery({ stay }: { stay: Stay }) {
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  function open(i: number) {
    setIndex(i);
    setOpened(true);
    dialog.current?.showModal();
  }
  return (
    <>
      <div className="property-gallery">
        <button
          className="gallery-main"
          aria-label={`Open gallery: ${stay.images[0].alt}`}
          onClick={() => open(0)}
        >
          <StayImage
            src={stay.images[0].src}
            alt={stay.images[0].alt}
            fill
            preload
            sizes="(max-width: 600px) 100vw, 65vw"
          />
        </button>
        <button
          className="gallery-side"
          aria-label={`Open gallery: ${stay.images[1].alt}`}
          onClick={() => open(1)}
        >
          <StayImage
            src={stay.images[1].src}
            alt={stay.images[1].alt}
            fill
            sizes="(max-width: 600px) 40vw, 30vw"
          />
          <span>
            <Expand size={16} /> Open gallery
          </span>
        </button>
      </div>
      <dialog
        className="gallery-dialog"
        ref={dialog}
        aria-label={`${stay.retreat} photo gallery`}
        onClose={() => setOpened(false)}
        onKeyDown={(e) => {
          trapDialogFocus(e);
          if (e.key === 'ArrowRight') setIndex((index + 1) % stay.images.length);
          if (e.key === 'ArrowLeft')
            setIndex((index + stay.images.length - 1) % stay.images.length);
        }}
      >
        <div className="gallery-top">
          <p>
            {stay.retreat} <span> / {String(index + 1).padStart(2, '0')}</span>
          </p>
          <button
            className="icon-button"
            aria-label="Close gallery"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <div className="gallery-stage">
          {opened && (
            <StayImage
              key={index}
              src={stay.images[index].src}
              alt={stay.images[index].alt}
              fill
              sizes="90vw"
            />
          )}
        </div>
        <div className="gallery-bottom">
          <button
            className="icon-button"
            aria-label="Previous photo"
            onClick={() => setIndex((index + stay.images.length - 1) % stay.images.length)}
          >
            <ChevronLeft />
          </button>
          <p>{stay.images[index].alt}</p>
          <button
            className="icon-button"
            aria-label="Next photo"
            onClick={() => setIndex((index + 1) % stay.images.length)}
          >
            <ChevronRight />
          </button>
        </div>
      </dialog>
    </>
  );
}
