import React, { useCallback, useEffect, useState } from 'react';
import {
  FaCircleCheck as Pass,
  FaCircleXmark as Fail,
  FaTriangleExclamation as Warn,
  FaArrowsRotate as Refresh,
} from 'react-icons/fa6';
import { PAYSTACK_SUBACCOUNT, ROUTE_TICKET_SALES_TO_SUBACCOUNT, subaccountOptions } from '../data/paystack';

// Admin-only: confirm Paystack routes money to the right bank with a real GHS 1 payment.
// Test payments carry no ticket_tier, so they never count as ticket sales or slots.

interface Subaccount {
  code: string;
  businessName: string;
  bank: string;
  accountNumber: string;
  accountName: string | null;
  percentageCharge: number;
  active: boolean;
  verified: boolean | null;
  currency: string | null;
  schedule: string | null;
}

interface Payment {
  reference: string;
  status: string;
  gatewayResponse?: string;
  amount?: number;
  fees?: number;
  currency?: string;
  channel?: string;
  paidAt?: string;
  routedTo?: string | null;
  routedBank?: string | null;
  routedAccount?: string | null;
  split?: { toSubaccount: number; toMainAccount: number; paystackFee: number; bearer: string | null } | null;
}

const TEST_AMOUNT_GHS = 1;

const Check: React.FC<{ ok: boolean | null; children: React.ReactNode }> = ({ ok, children }) => (
  <li className="flex items-start gap-2 text-sm">
    {ok === true ? (
      <Pass className="w-4 h-4 mt-0.5 shrink-0 text-[#0ca30c]" />
    ) : ok === false ? (
      <Fail className="w-4 h-4 mt-0.5 shrink-0 text-[#d03b3b]" />
    ) : (
      <Warn className="w-4 h-4 mt-0.5 shrink-0 text-[#fab219]" />
    )}
    <span className="text-slate-200">{children}</span>
  </li>
);

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-1.5 border-t border-white/5 text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="text-white text-right font-medium">{value ?? '—'}</span>
  </div>
);

export const PaymentTestPanel: React.FC<{ dashboardKey: string }> = ({ dashboardKey }) => {
  const [subaccount, setSubaccount] = useState<Subaccount | null>(null);
  const [subError, setSubError] = useState<string | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState<'lookup' | 'pay' | 'verify' | null>(null);

  const check = useCallback(
    async (reference?: string): Promise<Payment | null> => {
      const qs = new URLSearchParams({ subaccount: PAYSTACK_SUBACCOUNT, ...(reference ? { reference } : {}) });
      const res = await fetch(`/api/paystack-check?${qs}`, { headers: { 'x-dashboard-key': dashboardKey } });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? `Check failed (${res.status})`);
      setSubaccount(body.subaccount);
      setSubError(body.subaccountError);
      if (reference) setPayment(body.payment);
      return body.payment ?? null;
    },
    [dashboardKey]
  );

  const lookup = useCallback(async () => {
    setBusy('lookup');
    try {
      await check();
    } catch (e) {
      setSubError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }, [check]);

  useEffect(() => {
    lookup();
  }, [lookup]);

  const verify = async (reference: string) => {
    setBusy('verify');
    try {
      // Paystack can take a moment to finalise; retry a few times
      for (let attempt = 0; attempt < 4; attempt++) {
        const result = await check(reference);
        if (result?.status === 'success' || result?.status === 'failed') break;
        await new Promise((r) => setTimeout(r, 2500));
      }
    } catch (e) {
      setPayment({ reference, status: 'error', gatewayResponse: (e as Error).message });
    } finally {
      setBusy(null);
    }
  };

  const pay = () => {
    const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!key || !window.PaystackPop) {
      setPayment({ reference: '-', status: 'error', gatewayResponse: 'Paystack is not loaded or the public key is missing.' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    const reference = `P4I-TEST-${Date.now().toString(36).toUpperCase()}`;
    setPayment(null);
    setBusy('pay');
    window.PaystackPop.setup({
      key,
      email,
      amount: TEST_AMOUNT_GHS * 100,
      currency: 'GHS',
      ref: reference,
      ...subaccountOptions(),
      metadata: {
        payment_type: 'admin_test',
        custom_fields: [{ display_name: 'Payment Type', variable_name: 'payment_type', value: 'Admin routing test (not a ticket)' }],
      },
      callback: (response) => verify(response.reference || reference),
      onClose: () => setBusy((b) => (b === 'pay' ? null : b)),
    }).openIframe();
  };

  const keepsAll = subaccount ? Number(subaccount.percentageCharge) === 0 : null;
  const paid = payment?.status === 'success';
  const routedOk = paid ? payment?.routedTo === PAYSTACK_SUBACCOUNT : null;

  return (
    <section className="rounded-2xl bg-[#10324B] border border-white/10 p-5 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white">Payment test</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Make a real GHS {TEST_AMOUNT_GHS} payment to confirm money reaches the right bank account. Test payments are not counted as ticket sales.
          </p>
        </div>
        <button
          onClick={lookup}
          disabled={busy !== null}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white border border-white/15 rounded-lg px-2.5 py-1.5 disabled:opacity-50 cursor-pointer"
        >
          <Refresh className={`w-3 h-3 ${busy === 'lookup' ? 'animate-spin' : ''}`} /> Recheck
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1: where the money goes */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#83D318] mb-2">1 · Destination account</p>
          {subError ? (
            <ul className="space-y-1.5">
              <Check ok={false}>
                Paystack could not find subaccount <span className="font-mono">{PAYSTACK_SUBACCOUNT}</span>: {subError}
              </Check>
            </ul>
          ) : !subaccount ? (
            <p className="text-sm text-slate-400">Looking up {PAYSTACK_SUBACCOUNT}…</p>
          ) : (
            <>
              <Row label="Subaccount" value={<span className="font-mono">{subaccount.code}</span>} />
              <Row label="Business name" value={subaccount.businessName} />
              <Row label="Bank" value={subaccount.bank} />
              <Row label="Account number" value={<span className="font-mono">{subaccount.accountNumber}</span>} />
              {subaccount.accountName && <Row label="Account name" value={subaccount.accountName} />}
              <Row label="Main account keeps" value={`${subaccount.percentageCharge}%`} />
              {subaccount.schedule && <Row label="Settlement schedule" value={subaccount.schedule} />}
              <ul className="space-y-1.5 mt-3">
                <Check ok={subaccount.active}>{subaccount.active ? 'Subaccount is active' : 'Subaccount is inactive'}</Check>
                <Check ok={subaccount.verified}>
                  {subaccount.verified === null ? 'Bank verification status not reported' : subaccount.verified ? 'Bank account verified by Paystack' : 'Bank account not verified yet'}
                </Check>
                <Check ok={keepsAll ? true : null}>
                  {keepsAll
                    ? 'All of each payment (minus Paystack fee) goes to this account'
                    : `The main Paystack account keeps ${subaccount.percentageCharge}% of each payment`}
                </Check>
              </ul>
            </>
          )}
        </div>

        {/* Step 2: real test payment */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#83D318] mb-2">2 · GHS {TEST_AMOUNT_GHS} test payment</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              pay();
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              required
              placeholder="Your email (for the receipt)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg bg-[#0A1F2E] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#83D318]"
            />
            <button
              type="submit"
              disabled={busy !== null || !subaccount}
              className="rounded-lg bg-[#83D318] text-[#10324B] font-bold px-4 py-2 text-sm disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {busy === 'pay' ? 'Waiting for Paystack…' : busy === 'verify' ? 'Verifying…' : `Pay GHS ${TEST_AMOUNT_GHS}`}
            </button>
          </form>

          {payment && (
            <div className="mt-4">
              <Row label="Reference" value={<span className="font-mono text-xs">{payment.reference}</span>} />
              <Row label="Status" value={payment.status} />
              {payment.gatewayResponse && <Row label="Paystack says" value={payment.gatewayResponse} />}
              {paid && (
                <>
                  <Row label="Amount" value={`${payment.currency} ${payment.amount?.toFixed(2)}`} />
                  <Row label="Channel" value={payment.channel} />
                  {payment.split && (
                    <>
                      <Row label="To this account" value={`GHS ${payment.split.toSubaccount.toFixed(2)}`} />
                      <Row label="To main account" value={`GHS ${payment.split.toMainAccount.toFixed(2)}`} />
                      <Row label="Paystack fee" value={`GHS ${payment.split.paystackFee.toFixed(2)}`} />
                    </>
                  )}
                </>
              )}
              <ul className="space-y-1.5 mt-3">
                <Check ok={paid}>{paid ? 'Payment succeeded' : 'Payment did not succeed'}</Check>
                {paid && (
                  <Check ok={routedOk}>
                    {routedOk
                      ? `Routed to ${payment.routedBank ?? 'the subaccount'} ${payment.routedAccount ?? ''}`
                      : 'Payment was NOT routed to the subaccount'}
                  </Check>
                )}
                {paid && routedOk && (
                  <Check ok={null}>
                    Final step: check the bank account after Paystack's next settlement (usually the next business day).
                  </Check>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 border-t border-white/10 pt-4">
        Ticket sales routing: {ROUTE_TICKET_SALES_TO_SUBACCOUNT ? (
          <span className="text-[#83D318] font-semibold">ON, ticket payments go to {PAYSTACK_SUBACCOUNT}</span>
        ) : (
          <span className="text-[#fab219] font-semibold">OFF, ticket payments still settle to the main Paystack account</span>
        )}
      </p>
    </section>
  );
};

export default PaymentTestPanel;
