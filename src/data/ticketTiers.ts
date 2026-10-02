export interface TicketTier {
  id: string;
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
    name: 'General Pass',
    price: 250,
    tagline: 'Basic',
    features: generalFeatures,
    color: 'green',
  },
  {
    id: 'standard',
    name: 'Premium Pass',
    price: 500,
    popular: true,
    badge: 'MOST POPULAR',
    tagline: 'Standard',
    features: premiumFeatures,
    color: 'blue',
  },
  {
    id: 'deluxe',
    name: 'Deluxe Pass',
    price: 950,
    tagline: 'Priority red-carpet experience, R&R wellness treat & souvenirs.',
    features: [
      'Priority check-in',
      'Complimentary beverages (Drinks & Water)',
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
    name: 'Premium Pass (Double Treat)',
    price: 950,
    admits: 2,
    badge: 'SAVE 50 GHS',
    tagline: 'One Premium Pass that admits 2 people.',
    features: ['Admits 2 people', ...premiumFeatures],
    color: 'blue',
  },
];
