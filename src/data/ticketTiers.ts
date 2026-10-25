// Ticket slots are shared per pool; group passes use their parent tier's pool.
// Limits live in api/slots.ts (the server is the source of truth).
export type SlotPool = 'teaser' | 'general' | 'premium' | 'executive';

export interface TicketTier {
  id: string;
  pool: SlotPool;
  name: string;
  price: number; // in GHS, per pass (a group pass is priced for the whole group)
  tagline: string;
  badge?: string;
  features: string[];
  popular?: boolean;
  color?: 'green' | 'blue' | 'red' | 'amber' | string;
  admits?: number; // people admitted per pass; defaults to 1
}

export const peopleAdmitted = (tier: TicketTier) => tier.admits ?? 1;

// Look up a tier by id (never by list position)
export const tierById = (id: string) => ticketTiers.find((t) => t.id === id)!;

const generalFeatures = [
  'Complimentary beverages (Unlimited Drinks & Water)',
  'Access to watch padel matches',
  'Access to partner / innovation zones',
  'Access to health checks',
];

const premiumFeatures = [
  ...generalFeatures,
  'Automatic member of P4I Clubhouse',
  'Access to Champions and Investor mixer',
];

// Single source of truth for ticket tiers (landing page + checkout modal)
const vrExperience = 'Access to VR/ Immersive experiences on African cultural content';
const sponsorGift = 'Sponsor gift'; // every tier except the Teaser Pass

// Single list for every tier; VR experience is the last item on each card
export const ticketTiers: TicketTier[] = [
  {
    id: 'teaser',
    pool: 'teaser',
    name: 'Teaser Pass',
    price: 150,
    tagline: 'Entry',
    features: [
      'Complimentary beverages (Unlimited Drinks & Water)',
      'Access to watch padel matches',
      'Access to partner / innovation zones',
      vrExperience,
    ],
    color: 'green',
  },
  {
    id: 'basic',
    pool: 'general',
    name: 'General Pass',
    price: 250,
    tagline: 'Basic',
    features: [...generalFeatures, vrExperience, sponsorGift],
    color: 'green',
  },
  {
    id: 'standard',
    pool: 'premium',
    name: 'Premium Pass',
    price: 500,
    popular: true,
    badge: 'MOST POPULAR',
    tagline: 'Standard',
    features: [...premiumFeatures, vrExperience, sponsorGift],
    color: 'blue',
  },
  {
    id: 'executive',
    pool: 'executive',
    name: 'Executive Pass',
    price: 1000,
    tagline: 'Deluxe',
    features: [
      'Priority check-in',
      'Complimentary beverages (Unlimited Drinks, Snack & Water)',
      'Access to watch padel matches',
      'Access to partner / innovation zones',
      'Access to health checks',
      'Automatic member of P4I Clubhouse',
      'Access to Champions and Investor mixer',
      '15mins recovery service by R&R Wellness',
      'P4I Lifestyle souvenir',
      vrExperience,
      sponsorGift,
    ],
    color: 'amber',
  },
  // Group passes
  {
    id: 'general-triple',
    pool: 'general',
    name: 'General Pass (Triple Treat)',
    price: 700,
    admits: 3,
    badge: 'SAVE 50 GHS',
    tagline: 'One General Pass that admits 3 people.',
    features: ['Admits 3 people', ...generalFeatures, vrExperience, sponsorGift],
    color: 'green',
  },
  {
    id: 'premium-double',
    pool: 'premium',
    name: 'Premium Pass (Double Treat)',
    price: 950,
    admits: 2,
    badge: 'SAVE 50 GHS',
    tagline: 'One Premium Pass that admits 2 people.',
    features: ['Admits 2 people', ...premiumFeatures, vrExperience, sponsorGift],
    color: 'blue',
  },
];
