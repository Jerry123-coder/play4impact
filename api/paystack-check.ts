// GET /api/paystack-check — admin payment-routing check for /dashboard.
//   ?subaccount=ACCT_...   → that subaccount's bank details and split settings
//   &reference=P4I-TEST-…  → verifies a test payment and how it was split
// Requires PAYSTACK_SECRET_KEY and DASHBOARD_PASSWORD (x-dashboard-key header).

import { createHash, timingSafeEqual } from 'node:crypto';

const sameSecret = (given: string, expected: string) =>
  timingSafeEqual(createHash('sha256').update(given).digest(), createHash('sha256').update(expected).digest());

const mask = (n: unknown) => {
  const s = String(n ?? '');
  return s.length > 4 ? `••••${s.slice(-4)}` : s;
};

const paystack = async (path: string, secret: string) => {
  const res = await fetch(`https://api.paystack.co${path}`, { headers: { Authorization: `Bearer ${secret}` } });
  const body = await res.json().catch(() => null);
  return { ok: res.ok && body?.status === true, status: res.status, message: body?.message as string | undefined, data: body?.data };
};

export async function GET(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const password = process.env.DASHBOARD_PASSWORD;
  const noStore = { 'Cache-Control': 'no-store' };
  if (!secret || !password) {
    return Response.json({ error: 'PAYSTACK_SECRET_KEY / DASHBOARD_PASSWORD missing in Vercel' }, { status: 503, headers: noStore });
  }
  if (!sameSecret(request.headers.get('x-dashboard-key') ?? '', password)) {
    return Response.json({ error: 'Wrong password' }, { status: 401, headers: noStore });
  }

  const params = new URL(request.url).searchParams;
  const code = params.get('subaccount') ?? '';
  const reference = params.get('reference');
  if (!/^ACCT_[A-Za-z0-9]+$/.test(code)) {
    return Response.json({ error: 'Invalid subaccount code' }, { status: 400, headers: noStore });
  }

  try {
    const sub = await paystack(`/subaccount/${encodeURIComponent(code)}`, secret);
    const subaccount = sub.ok
      ? {
          code: sub.data.subaccount_code,
          businessName: sub.data.business_name,
          bank: sub.data.settlement_bank,
          accountNumber: mask(sub.data.account_number),
          accountName: sub.data.account_name ?? null,
          percentageCharge: sub.data.percentage_charge, // % the main account keeps
          active: sub.data.active !== false,
          verified: sub.data.is_verified ?? null,
          currency: sub.data.currency ?? null,
          schedule: sub.data.settlement_schedule ?? null,
        }
      : null;

    let payment = null;
    if (reference) {
      if (!/^[A-Za-z0-9_-]{4,100}$/.test(reference)) {
        return Response.json({ error: 'Invalid reference' }, { status: 400, headers: noStore });
      }
      const tx = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`, secret);
      if (tx.ok) {
        const d = tx.data;
        const split = d.fees_split ?? null;
        payment = {
          reference: d.reference,
          status: d.status,
          gatewayResponse: d.gateway_response,
          amount: (d.amount ?? 0) / 100,
          fees: (d.fees ?? 0) / 100,
          currency: d.currency,
          channel: d.channel,
          paidAt: d.paid_at,
          routedTo: d.subaccount?.subaccount_code ?? null,
          routedBank: d.subaccount?.settlement_bank ?? null,
          routedAccount: d.subaccount?.account_number ? mask(d.subaccount.account_number) : null,
          split: split
            ? {
                toSubaccount: (split.subaccount ?? 0) / 100,
                toMainAccount: (split.integration ?? 0) / 100,
                paystackFee: (split.paystack ?? 0) / 100,
                bearer: split.params?.bearer ?? null,
              }
            : null,
        };
      } else {
        payment = { reference, status: 'not_found', gatewayResponse: tx.message ?? `Paystack responded ${tx.status}` };
      }
    }

    return Response.json(
      { subaccount, subaccountError: sub.ok ? null : sub.message ?? `Paystack responded ${sub.status}`, payment },
      { headers: noStore }
    );
  } catch (err) {
    console.error('paystack-check failed', err);
    return Response.json({ error: 'Could not reach Paystack' }, { status: 502, headers: noStore });
  }
}
