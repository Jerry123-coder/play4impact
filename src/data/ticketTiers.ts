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
  'Complimentary beverages (Drinks & Water)',
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
export const ticketTiers: TicketTier[] = [
  {
    id: 'basic',
    pool: 'general',
    name: 'General Pass',
    price: 250,
    tagline: 'Basic',
    features: generalFeatures,
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
    features: premiumFeatures,
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
      'Complimentary beverages (Drinks, Water & Snacks)',
      'Priority access to watch padel matches',
      'Access to partner / innovation zones',
      'Access to health checks',
      'Priority Access to Champions and Investor mixer',
      'Automatic member of P4I Clubhouse',
      'Wellness treat by R&R',
      'P4I Lifestyle souvenir',
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
    features: ['Admits 3 people', ...generalFeatures],
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
    features: ['Admits 2 people', ...premiumFeatures],
    color: 'blue',
  },
];
