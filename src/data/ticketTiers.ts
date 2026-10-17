// Ticket slots are shared per pool; group passes use their parent tier's pool.
// Limits live in api/slots.ts (the server is the source of truth).
export type SlotPool = 'general' | 'premium' | 'executive';

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

// Single list for every tier; VR experience is the last item on each card
export const ticketTiers: TicketTier[] = [
  {
    id: 'basic',
    pool: 'general',
    name: 'General Pass',
    price: 250,
    tagline: 'Basic',
    features: [...generalFeatures, vrExperience],
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
    features: [...premiumFeatures, vrExperience],
    color: 'blue',
  },
  {
    id: 'executive',
    pool: 'executive',
    name: 'Executive Pass',
    price: 1000,
    tagline: 'Deluxe',
    features: [
      'Complimentary beverages (Unlimited Drinks, Snack & Water)',
      'Access to watch padel matches',
      'Access to partner / innovation zones',
      'Access to health checks',
      'Automatic member of P4I Clubhouse',
      'Access to Champions and Investor mixer',
      '15mins recovery service by R&R Wellness',
      'P4I Lifestyle souvenir',
      vrExperience,
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
    features: ['Admits 3 people', ...generalFeatures, vrExperience],
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
    features: ['Admits 2 people', ...premiumFeatures, vrExperience],
    color: 'blue',
  },
];
