// GET /api/sales — ticket sales for the internal /dashboard page.
// Lists every successful Play4Impact payment from Paystack (no database needed).
// Requires in Vercel → Settings → Environment Variables:
//   PAYSTACK_SECRET_KEY  (same key as /api/slots)
//   DASHBOARD_PASSWORD   (the dashboard sends it in the x-dashboard-key header)

import { createHash, timingSafeEqual } from 'node:crypto';

// Slot limits and tier → pool mapping. Keep in sync with api/slots.ts.
const LIMITS = { general: 50, premium: 120, executive: 40 } as const;
type Pool = keyof typeof LIMITS;

const TIER_POOLS: Record<string, { pool: Pool; admits: number }> = {
  'General Pass': { pool: 'general', admits: 1 },
  'General Pass (Triple Treat)': { pool: 'general', admits: 3 },
  'Basic Pass': { pool: 'general', admits: 1 },
  'Premium Pass': { pool: 'premium', admits: 1 },
  'Premium Pass (Double Treat)': { pool: 'premium', admits: 2 },
  'Standard Pass': { pool: 'premium', admits: 1 },
  'Executive Pass': { pool: 'executive', admits: 1 },
  'Deluxe Pass': { pool: 'executive', admits: 1 },
};

interface CustomField {
  variable_name?: string;
  value?: unknown;
}

const sameSecret = (given: string, expected: string) => {
  // hash both so the comparison is constant-time regardless of length
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
};

const fetchOrders = async (secret: string) => {
  const orders = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`https://api.paystack.co/transaction?status=success&perPage=100&page=${page}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (!res.ok) throw new Error(`Paystack responded ${res.status}`);
    const body = await res.json();

    for (const tx of body.data ?? []) {
      let meta = tx.metadata;
      if (typeof meta === 'string') {
        try {
          meta = JSON.parse(meta);
        } catch {
          meta = null;
        }
      }
      const fields: CustomField[] = Array.isArray(meta?.custom_fields) ? meta.custom_fields : [];
      const field = (name: string) => {
        const v = fields.find((f) => f.variable_name === name)?.value;
        return v === undefined || v === null || v === '' ? null : String(v);
      };

      const tierName = field('ticket_tier');
      if (!tierName) continue; // not a Play4Impact ticket
      const tier = TIER_POOLS[tierName];
      const quantity = Number(field('quantity')) || 1;

      orders.push({
        reference: tx.reference as string,
        paidAt: (tx.paid_at ?? tx.paidAt ?? tx.created_at) as string,
        amount: (tx.amount ?? 0) / 100, // GHS
        fees: (tx.fees ?? 0) / 100, // GHS, Paystack's charge
        currency: tx.currency as string,
        tier: tierName,
        pool: tier?.pool ?? null,
        quantity,
        people: Number(field('people_admitted')) || quantity * (tier?.admits ?? 1),
        promoCode: field('promo_code'),
        community: field('promo_community'),
        name: field('purchaser_name'),
        email: (tx.customer?.email as string) ?? null,
      });
    }

    if (page >= (body.meta?.pageCount ?? 1)) break;
  }
  return orders;
};

export async function GET(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const password = process.env.DASHBOARD_PASSWORD;
  const noStore = { 'Cache-Control': 'no-store' };

  if (!secret || !password) {
    return Response.json(
      { error: 'Dashboard is not configured (PAYSTACK_SECRET_KEY / DASHBOARD_PASSWORD missing)' },
      { status: 503, headers: noStore }
    );
  }
  if (!sameSecret(request.headers.get('x-dashboard-key') ?? '', password)) {
    return Response.json({ error: 'Wrong password' }, { status: 401, headers: noStore });
  }

  try {
    const orders = await fetchOrders(secret);
    return Response.json({ generatedAt: new Date().toISOString(), limits: LIMITS, orders }, { headers: noStore });
  } catch (err) {
    console.error('sales: failed to load Paystack transactions', err);
    return Response.json({ error: 'Could not load sales from Paystack' }, { status: 502, headers: noStore });
  }
}
