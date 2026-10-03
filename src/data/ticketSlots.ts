import { useEffect, useState } from 'react';
import { peopleAdmitted, type SlotPool, type TicketTier } from './ticketTiers';

export interface PoolAvailability {
  limit: number;
  sold: number;
  remaining: number; // people
}

export type Availability = Record<SlotPool, PoolAvailability>;

// Live availability from the /api/slots Vercel function. Returns null when it can't be
// loaded (e.g. local `vite` dev, or the function errors); sales then stay open rather
// than the site refusing to sell tickets because of a config problem.
export const fetchAvailability = async (fresh = false): Promise<Availability | null> => {
  try {
    const res = await fetch(`/api/slots${fresh ? '?fresh=1' : ''}`);
    if (!res.ok) return null;
    const body = await res.json();
    return body?.pools ?? null;
  } catch {
    return null;
  }
};

export const useAvailability = (enabled = true) => {
  const [availability, setAvailability] = useState<Availability | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetchAvailability().then((a) => !cancelled && setAvailability(a));
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return [availability, setAvailability] as const;
};

// How many of this pass can still be bought (a group pass needs room for the whole group).
// null = unknown (availability not loaded), so don't limit.
export const passesLeft = (tier: TicketTier, availability: Availability | null): number | null => {
  const pool = availability?.[tier.pool];
  return pool ? Math.floor(pool.remaining / peopleAdmitted(tier)) : null;
};

// Show "Only N left" once a pass is running low
export const LOW_STOCK_THRESHOLD = 15;
