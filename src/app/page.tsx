import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Compass, Leaf, Sun } from 'lucide-react';
import { SearchBar } from '@/components/controls';
import { Discovery } from '@/components/discovery';
import { StayImage } from '@/components/stay-image';
import { HeroImage } from '@/components/hero-image';
import { defaultTrip } from '@/lib/domain';

const marqueeItems = [
  'GO A LITTLE FURTHER',
  'STAY SOMEWHERE WITH A POINT OF VIEW',
  'TRAVEL SLOWER',
  'LEAVE ROOM FOR THE UNPLANNED',
];

export const revalidate = 3600;

export default function Home() {
  const trip = defaultTrip();

  return (
    <main id="main">
      <section className="hero">
        <HeroImage />
        <div className="hero-shade" />
        <div className="hero-frame" aria-hidden="true">
          <span>ELARVEN / EDIT 01</span>
          <span>46°32′N · 11°50′E</span>
        </div>
        <div className="hero-content">
          <p className="eyebrow">
            <span /> EXTRAORDINARY PLACES. A DIFFERENT PACE.
          </p>
          <h1>
            A little further
            <br />
            from <em>ordinary.</em>
          </h1>
          <p className="hero-description">
            Beautiful places to disappear into.
            <br />
            And come back to yourself.
          </p>
        </div>
        <Link href="/stays/stillhaus-ridge-cabin" className="hero-location">
          <span className="location-cross">+</span>
          <span>
            STILLHAUS
            <br />
            <strong>Dolomites, Italy</strong>
          </span>
          <ArrowUpRight size={20} />
        </Link>
        <div className="hero-search">
          <SearchBar initial={trip} />
        </div>
        <div className="hero-bottom">
          <a href="#discover">
            FIND YOUR SOMEWHERE <ArrowDown size={15} />
          </a>
          <span>
            01 / 04 <span className="hero-line" /> THE ALPINE EDIT
          </span>
        </div>
      </section>

      <div className="brand-strip">
        <span>For the feeling of being somewhere else.</span>
        <span>
          Considered architecture <i /> Remarkable settings <i /> Room to slow down
        </span>
      </div>

      <div className="editorial-marquee" aria-hidden="true">
        <div className="editorial-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`}>
              {item} <i>✳</i>
            </span>
          ))}
        </div>
      </div>

      <Discovery />

      <section className="cinematic-break" data-reveal>
        <div className="cinematic-media">
          <StayImage
            src="/images/coast.webp"
            alt="A calm Mediterranean retreat set into the rocky coast of Mallorca"
            fill
            sizes="(max-width: 900px) 100vw, 92vw"
          />
        </div>
        <div className="cinematic-shade" />
        <div className="cinematic-copy">
          <p className="eyebrow">THE LONG WAY IS OFTEN BETTER</p>
          <h2>
            Leave room for
            <br />
            <em>the unplanned.</em>
          </h2>
          <p>
            A morning with no agenda. A road you did not mean to take. A place worth arriving at
            slowly.
          </p>
          <Link className="cinematic-link" href="/stays?mood=Coast">
            Follow the coast <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="cinematic-meta" aria-hidden="true">
          <span>39°41′N 2°59′E</span>
          <span>MALLORCA / SPAIN</span>
        </div>
      </section>

      <section className="place-story section" data-reveal>
        <div className="story-image">
          <StayImage
            src="/images/forest.webp"
            alt="Warm light from a timber retreat reflected in a quiet forest lake"
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
          />
          <span>66°06′N 20°54′E · HARADS, SWEDEN</span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">FIELD NOTES / 001</p>
          <h2>
            Some places
            <br />
            ask you to
            <br />
            <em>do less.</em>
          </h2>
          <p>
            A path through the pines. A lake with nowhere to be. A cabin that holds the warmth long
            after sunset.
          </p>
          <p>In Harads, the best part of the day is the part you didn’t plan.</p>
          <Link className="text-link" href="/stays?mood=Forest">
            Find your forest retreat <ArrowUpRight size={20} />
          </Link>
        </div>
      </section>

      <section className="principles section" id="our-way" data-reveal>
        <p className="eyebrow">THE ELARVEN WAY</p>
        <h2>
          Not just anywhere.
          <br />
          <em>Somewhere that stays with you.</em>
        </h2>
        <div className="principle-grid">
          <div className="principle-card">
            <span className="principle-index">01</span>
            <Compass />
            <h3>A sense of place</h3>
            <p>Architecture that belongs to its landscape. Places with a point of view.</p>
          </div>
          <div className="principle-card">
            <span className="principle-index">02</span>
            <Leaf />
            <h3>Room to exhale</h3>
            <p>Small retreats, thoughtful details, and space for your own kind of escape.</p>
          </div>
          <div className="principle-card">
            <span className="principle-index">03</span>
            <Sun />
            <h3>Nothing in the way</h3>
            <p>Clear prices and considered choices. Less searching, more looking forward.</p>
          </div>
        </div>
      </section>

      <section className="collection-stats" aria-label="Elarven collection" data-reveal>
        <div>
          <strong>12</strong>
          <span>considered stays</span>
        </div>
        <div>
          <strong>04</strong>
          <span>distinct landscapes</span>
        </div>
        <div>
          <strong>01</strong>
          <span>reason to go</span>
        </div>
      </section>
    </main>
  );
}
