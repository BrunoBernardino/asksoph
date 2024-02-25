import 'std/dotenv/load.ts';

const STRIPE_API_KEY = Deno.env.get('STRIPE_API_KEY') || '';

interface StripeCustomer {
  id: string;
  object: 'customer';
  balance: number;
  created: number;
  currency?: string | null;
  deleted?: void;
  delinquent?: boolean | null;
  email: string | null;
  name?: string | null;
}

interface StripeCheckoutSession {
  id: string;
  object: 'checkout.session';
  created: number;
  currency: string;
  customer: StripeCustomer;
  payment_status:
    | 'paid'
    | 'unpaid'
    | 'no_payment_required';
  status: 'open' | 'complete' | 'expired';
  url: string;
  line_items: {
    object: 'list';
    data: StripeCheckoutSessionLineItem[];
  };
}

interface StripeCheckoutSessionLineItem {
  id: string;
  object: 'subscription_item';
  created: number;
  deleted?: void;
  price: {
    id: string;
  };
}

interface StripeResponse {
  object: 'list';
  url: string;
  has_more: boolean;
  data: any[];
}

function getApiRequestHeaders() {
  return {
    'Authorization': `Bearer ${STRIPE_API_KEY}`,
    'Accept': 'application/json; charset=utf-8',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

export async function getCheckoutSessions() {
  const searchParams = new URLSearchParams();

  searchParams.set('expand[]', 'data.customer');
  searchParams.set('limit', '100');

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions?${searchParams.toString()}`, {
    method: 'GET',
    headers: getApiRequestHeaders(),
  });

  const result = (await response.json()) as StripeResponse;

  const checkoutSessions = result.data as StripeCheckoutSession[];

  if (!checkoutSessions) {
    console.log(JSON.stringify({ result }, null, 2));
    throw new Error(`Failed to make API request: "${result}"`);
  }

  return checkoutSessions;
}
