// Paystack settlement routing.
// PAYSTACK_SUBACCOUNT is the subaccount (bank account) payments are routed to.
// It is not a secret: Paystack subaccount codes are meant to be sent from the browser.
export const PAYSTACK_SUBACCOUNT = 'ACCT_0kvmpct6grnec45';

// Live ticket sales only use the subaccount once this is true. Keep it false until an
// admin GHS 1 test (/dashboard → Payment test) confirms the bank details are right.
export const ROUTE_TICKET_SALES_TO_SUBACCOUNT = false;

// Who pays Paystack's fee when a subaccount is used: 'subaccount' or 'account' (main account).
export const SUBACCOUNT_FEE_BEARER: 'subaccount' | 'account' = 'subaccount';

// Extra Paystack setup options for routing a payment to the subaccount.
export const subaccountOptions = () => ({ subaccount: PAYSTACK_SUBACCOUNT, bearer: SUBACCOUNT_FEE_BEARER });
