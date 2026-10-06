'use client';
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="empty page">
      <p className="eyebrow">LET’S TRY THAT AGAIN</p>
      <h1>A pause in the journey.</h1>
      <p>We couldn’t load this view. Your saved stays are still on this device.</p>
      <button type="button" className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
