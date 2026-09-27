import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Compass, Leaf, Sun } from 'lucide-react';
import { SearchBar } from '@/components/controls';
import { Discovery } from '@/components/discovery';
import { StayImage } from '@/components/stay-image';
export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <StayImage
          src="/images/alpine.webp"
          alt="An illuminated timber cabin framed by pines and the peaks of the Dolomites"
          fill
          preload
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
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
          <SearchBar />
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
      <Discovery />
      <section className="place-story section">
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
      <section className="principles section" id="our-way">
        <p className="eyebrow">THE ELARVEN WAY</p>
        <h2>
          Not just anywhere.
          <br />
          <em>Somewhere that stays with you.</em>
        </h2>
        <div className="principle-grid">
          <div>
            <Compass />
            <h3>A sense of place</h3>
            <p>Architecture that belongs to its landscape. Places with a point of view.</p>
          </div>
          <div>
            <Leaf />
            <h3>Room to exhale</h3>
            <p>Small retreats, thoughtful details, and space for your own kind of escape.</p>
          </div>
          <div>
            <Sun />
            <h3>Nothing in the way</h3>
            <p>Clear prices and considered choices. Less searching, more looking forward.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
