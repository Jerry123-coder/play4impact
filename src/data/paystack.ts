// Paystack settlement routing.
// PAYSTACK_SUBACCOUNT is the subaccount (bank account) payments are routed to.
// It is not a secret: Paystack subaccount codes are meant to be sent from the browser.
export const PAYSTACK_SUBACCOUNT = 'ACCT_0kvmpct6grnec45';

// All ticket sales are routed to the subaccount (nothing settles to the main account).
// Confirm the bank details any time via /dashboard → Payment test.
export const ROUTE_TICKET_SALES_TO_SUBACCOUNT = true;

// Who pays Paystack's fee when a subaccount is used: 'subaccount' or 'account' (main account).
export const SUBACCOUNT_FEE_BEARER: 'subaccount' | 'account' = 'subaccount';

// Extra Paystack setup options for routing a payment to the subaccount.
export const subaccountOptions = () => ({ subaccount: PAYSTACK_SUBACCOUNT, bearer: SUBACCOUNT_FEE_BEARER });
