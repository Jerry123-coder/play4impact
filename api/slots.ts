// GET /api/slots — live ticket availability per slot pool.
// Counts people admitted on every successful Paystack payment, so no database is needed.
// Requires PAYSTACK_SECRET_KEY in Vercel → Settings → Environment Variables.
// ?fresh=1 skips the CDN cache (used right before opening payment).

const LIMITS = { general: 50, premium: 100, executive: 40 } as const;
type Pool = keyof typeof LIMITS;

// Tier names exactly as recorded in Paystack metadata, including names used before renames.
// Group passes draw from their parent tier's pool.
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

const countSold = async (secret: string) => {
  const sold: Record<Pool, number> = { general: 0, premium: 0, executive: 0 };

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
      const field = (name: string) => fields.find((f) => f.variable_name === name)?.value;

      const tier = TIER_POOLS[String(field('ticket_tier') ?? '')];
      if (!tier) continue; // not a Play4Impact ticket

      const people = Number(field('people_admitted')) || (Number(field('quantity')) || 1) * tier.admits;
      sold[tier.pool] += people;
    }

    if (page >= (body.meta?.pageCount ?? 1)) break;
  }

  return sold;
};

export async function GET(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return Response.json({ error: 'PAYSTACK_SECRET_KEY is not configured' }, { status: 503 });
  }

  const fresh = new URL(request.url).searchParams.has('fresh');

  try {
    const sold = await countSold(secret);
    const pools = Object.fromEntries(
      (Object.keys(LIMITS) as Pool[]).map((pool) => [
        pool,
        { limit: LIMITS[pool], sold: sold[pool], remaining: Math.max(0, LIMITS[pool] - sold[pool]) },
      ])
    );
    return Response.json(
      { pools },
      { headers: { 'Cache-Control': fresh ? 'no-store' : 's-maxage=15, stale-while-revalidate=30' } }
    );
  } catch (err) {
    console.error('slots: failed to count Paystack sales', err);
    return Response.json({ error: 'Could not load ticket availability' }, { status: 502 });
  }
}
