'use client';
import { useState } from 'react';
import type { Stay } from '@/lib/stays';
import { money, type Trip } from '@/lib/domain';
import { StayCard } from './stay-card';
export default function StayMap({ stays, trip }: { stays: Stay[]; trip: Trip }) {
  const [selected, setSelected] = useState(stays[0].id);
  const current = stays.find((s) => s.id === selected) || stays[0];
  return (
    <div className="map-layout">
      <div className="map-surface" aria-label="Illustrative region map">
        <svg viewBox="0 0 600 500" aria-hidden="true">
          <defs>
            <pattern id="map-grid" width="35" height="35" patternUnits="userSpaceOnUse">
              <path d="M35 0H0V35" stroke="#a4b6ac" strokeWidth=".4" fill="none" />
            </pattern>
          </defs>
          <rect width="600" height="500" fill="#d9e6e1" />
          <path
            d="M130 10L240 5 250 60 210 100 240 135 180 180 195 230 230 245 210 280 250 320 285 315 310 365 350 390 355 350 310 300 330 265 410 245 440 300 530 295 580 210 560 100 460 60 360 80 330 20 290 5Z"
            fill="#eef0df"
            stroke="#a8b6a2"
          />
          <path
            d="M70 370L175 350 250 365 325 405 475 410 600 450V500H60Z"
            fill="#e5dfc8"
            stroke="#b9b9a2"
          />
          <rect width="600" height="500" fill="url(#map-grid)" />
          <g fill="#6b7e74" fontSize="12" fontFamily="sans-serif" letterSpacing="3">
            <text x="90" y="275">
              ATLANTIC
            </text>
            <text x="175" y="470">
              NORTH AFRICA
            </text>
            <text x="380" y="175">
              EUROPE
            </text>
          </g>
        </svg>
        {stays.map((s, i) => {
          const left = 16 + ((s.coordinates[1] + 9) / 31) * 60;
          const top = 70 - ((s.coordinates[0] - 30) / 38) * 70;
          return (
            <button
              key={s.id}
              className={`map-pin ${current.id === s.id ? 'selected' : ''}`}
              style={{ left: `${left + (i % 3) * 2}%`, top: `${top + (i % 3) * 14}%` }}
              onClick={() => setSelected(s.id)}
              aria-label={`${s.name}, ${s.region}, ${money(s.rate)} per night`}
              aria-pressed={current.id === s.id}
            >
              {money(s.rate)}
            </button>
          );
        })}
        <p className="map-caption">Illustrative map · approximate locations</p>
      </div>
      <div className="map-selection">
        <p className="eyebrow">YOUR PLACE ON THE MAP</p>
        <StayCard stay={current} trip={trip} />
        <div className="map-list" role="group" aria-label="Choose a stay on the map">
          {stays.map((s) => (
            <button key={s.id} onClick={() => setSelected(s.id)} aria-pressed={s.id === current.id}>
              {s.retreat} · {s.name}
              <span>{money(s.rate)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
