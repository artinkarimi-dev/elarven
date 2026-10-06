export const moods = ['Alpine', 'Coast', 'Desert', 'Forest'] as const;
export type Mood = (typeof moods)[number];
export type Stay = {
  id: string;
  slug: string;
  name: string;
  retreat: string;
  region: string;
  country: string;
  mood: Mood;
  type: 'Cabin' | 'Villa' | 'Suite' | 'Lodge';
  tagline: string;
  description: string;
  rate: number;
  cleaning: number;
  servicePercent: number;
  taxPerAdult: number;
  capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  rating: number;
  reviews: number;
  images: { src: string; alt: string }[];
  featured: boolean;
  flexible: boolean;
  blocked: string[];
  coordinates: [number, number];
};
const regions = [
  {
    mood: 'Alpine' as const,
    region: 'Dolomites',
    country: 'Italy',
    retreat: 'Stillhaus',
    image: 'alpine',
    coordinates: [46.5, 11.8] as [number, number],
    amenities: ['Mountain view', 'Fireplace', 'Sauna', 'Kitchen', 'Wi-Fi', 'Parking'],
    intro:
      'Larch wood, warm stone and a wall of glass facing the peaks. Walk out into the pines, then return to a fire and a long, unhurried evening.',
  },
  {
    mood: 'Coast' as const,
    region: 'Mallorca',
    country: 'Spain',
    retreat: 'Casa Brisa',
    image: 'coast',
    coordinates: [39.7, 2.6] as [number, number],
    amenities: ['Sea view', 'Pool', 'Kitchen', 'Wi-Fi', 'Parking', 'Terrace'],
    intro:
      'A pale stone hideaway above the Mediterranean. Shaded terraces follow the sun, and the salt-water pool seems to meet the blue horizon.',
  },
  {
    mood: 'Desert' as const,
    region: 'Agafay',
    country: 'Morocco',
    retreat: 'Dune House',
    image: 'desert',
    coordinates: [31.4, -8.2] as [number, number],
    amenities: ['Desert view', 'Pool', 'Breakfast', 'Wi-Fi', 'Terrace', 'Parking'],
    intro:
      'Earth walls hold the cool of the morning. Beyond a quiet courtyard, the stone desert unfolds towards the Atlas Mountains. Evenings belong to the open sky.',
  },
  {
    mood: 'Forest' as const,
    region: 'Harads',
    country: 'Sweden',
    retreat: 'Pinefold',
    image: 'forest',
    coordinates: [66.1, 20.9] as [number, number],
    amenities: ['Lake view', 'Sauna', 'Fireplace', 'Kitchen', 'Wi-Fi', 'Parking'],
    intro:
      'Dark timber gives way to a warm, light-filled interior. A path through the pines leads to the lake; mornings are best spent watching the mist lift.',
  },
];
const units: {
  name: string;
  type: Stay['type'];
  rate: number;
  capacity: number;
  bedrooms: number;
  tagline: string;
}[][] = [
  [
    {
      name: 'The Ridge Cabin',
      type: 'Cabin',
      rate: 285,
      capacity: 4,
      bedrooms: 2,
      tagline: 'A front-row seat to the mountains.',
    },
    {
      name: 'The Larch Suite',
      type: 'Suite',
      rate: 225,
      capacity: 2,
      bedrooms: 1,
      tagline: 'Warm timber. Wide-open views.',
    },
    {
      name: 'The Summit Lodge',
      type: 'Lodge',
      rate: 425,
      capacity: 6,
      bedrooms: 3,
      tagline: 'Room to gather, space to breathe.',
    },
  ],
  [
    {
      name: 'The Sea Terrace',
      type: 'Villa',
      rate: 345,
      capacity: 4,
      bedrooms: 2,
      tagline: 'Follow the light to the water.',
    },
    {
      name: 'The Olive Suite',
      type: 'Suite',
      rate: 245,
      capacity: 2,
      bedrooms: 1,
      tagline: 'Slow mornings in the sea breeze.',
    },
    {
      name: 'The Horizon Villa',
      type: 'Villa',
      rate: 495,
      capacity: 6,
      bedrooms: 3,
      tagline: 'A little more room on the coast.',
    },
  ],
  [
    {
      name: 'The Courtyard',
      type: 'Suite',
      rate: 195,
      capacity: 2,
      bedrooms: 1,
      tagline: 'A softer rhythm, under open skies.',
    },
    {
      name: 'The Atlas House',
      type: 'Villa',
      rate: 325,
      capacity: 4,
      bedrooms: 2,
      tagline: 'Earth, shade and endless horizons.',
    },
    {
      name: 'The Ochre Pavilion',
      type: 'Lodge',
      rate: 265,
      capacity: 4,
      bedrooms: 2,
      tagline: 'Let the desert set the pace.',
    },
  ],
  [
    {
      name: 'The Lake Cabin',
      type: 'Cabin',
      rate: 295,
      capacity: 2,
      bedrooms: 1,
      tagline: 'Find your quiet among the pines.',
    },
    {
      name: 'The Woodland Lodge',
      type: 'Lodge',
      rate: 395,
      capacity: 6,
      bedrooms: 3,
      tagline: 'A warm welcome beyond the trees.',
    },
    {
      name: 'The Birch Cabin',
      type: 'Cabin',
      rate: 255,
      capacity: 4,
      bedrooms: 2,
      tagline: 'Less noise. More nature.',
    },
  ],
];
export const stays: Stay[] = regions.flatMap((r, ri) =>
  units[ri].map((u, i) => ({
    ...u,
    id: `${r.image}-${i}`,
    slug: `${r.retreat.toLowerCase().replaceAll(' ', '-')}-${u.name.toLowerCase().replace('the ', '').replaceAll(' ', '-')}`,
    retreat: r.retreat,
    region: r.region,
    country: r.country,
    mood: r.mood,
    description: `${r.intro} ${i === 0 ? 'This intimate stay is designed around its view, with a private sitting area and a considered collection of natural materials.' : i === 1 ? 'A sheltered corner of the retreat, with its own entrance and a reading nook for the afternoons you keep to yourself.' : 'The generous living space makes this a comfortable base for sharing meals, planning walks and spending time together.'}`,
    cleaning: ri === 2 ? 35 : 55,
    servicePercent: 0.08,
    taxPerAdult: 2.5,
    beds: u.bedrooms,
    bathrooms: Math.max(1, u.bedrooms - 1),
    amenities: r.amenities,
    rating: [4.96, 4.88, 4.92, 4.94, 4.87, 4.91, 4.89, 4.93, 4.85, 4.98, 4.9, 4.86][ri * 3 + i],
    reviews: 38 + ri * 17 + i * 11,
    images: [
      {
        src: `/images/${r.image}.webp`,
        alt: `${r.retreat}: ${r.mood.toLowerCase()} architecture in ${r.region}`,
      },
      {
        src: `/images/${r.image}-interior.webp`,
        alt: `Natural materials and a quiet sitting area inside ${r.retreat}`,
      },
    ],
    featured: i === 0,
    flexible: i !== 2,
    blocked: ['2026-12-24', '2026-12-25', '2026-12-26', '2027-01-01'],
    coordinates: [r.coordinates[0] + i * 0.08, r.coordinates[1] + i * 0.08],
  })),
);
// Replace this boundary with an API adapter when inventory becomes server-authoritative.
export const stayRepository = {
  list: () => stays,
  find: (slug: string) => stays.find((s) => s.slug === slug),
};
export const destinations = regions.map((r) => `${r.region}, ${r.country}`);
