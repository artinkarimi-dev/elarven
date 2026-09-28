'use client';
import { useId, useState } from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { destinations } from '@/lib/stays';
export function DestinationInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const options = destinations.filter((d) => d.toLowerCase().includes(value.trim().toLowerCase()));
  const select = (destination: string) => {
    onChange(destination);
    setOpen(false);
    setActive(-1);
  };
  return (
    <div className="destination-picker">
      <label htmlFor={id}>
        <strong>Where to?</strong>
      </label>
      <input
        id={id}
        role="combobox"
        aria-label="Where to? Destination"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-activedescendant={open && active >= 0 ? `${id}-option-${active}` : undefined}
        autoComplete="off"
        placeholder="Somewhere extraordinary"
        value={value}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          onChange(e.target.value);
          setActive(-1);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
            if (options.length)
              setActive((current) =>
                e.key === 'ArrowDown'
                  ? (current + 1) % options.length
                  : (current - 1 + options.length) % options.length,
              );
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
            setActive(-1);
          }
          if (e.key === 'Enter' && open && active >= 0 && options[active]) {
            e.preventDefault();
            select(options[active]);
          }
        }}
      />
      <ul
        id={`${id}-options`}
        className="destination-options"
        role="listbox"
        aria-label="Destinations"
        hidden={!open}
      >
        <li className="destination-hint" role="presentation">
          {options.length ? 'A CHANGE OF SCENERY' : 'NO MATCHING REGION — TRY A DIFFERENT PLACE'}
        </li>
        {options.map((destination, i) => (
          <li
            key={destination}
            id={`${id}-option-${i}`}
            role="option"
            aria-selected={active === i}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => select(destination)}
          >
            <MapPin size={17} />
            <span>
              <b>{destination.split(',')[0]}</b>
              <small>{destination.split(',')[1].trim()}</small>
            </span>
            <ArrowUpRight size={16} />
          </li>
        ))}
      </ul>
    </div>
  );
}
