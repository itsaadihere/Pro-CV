import crypto from 'crypto';

const BASE_URL = process.env.DIRECTPAY_BASE_URL || 'https://payin-pwa.directpay.pro/pay';
const CLIENT_ID = process.env.DIRECTPAY_CLIENT_ID || '';
const CLIENT_SECRET = process.env.DIRECTPAY_CLIENT_SECRET || '';

/**
 * Calculates HMACSHA256 checksum for DirectPay Payin PWA.
 * Formula: plainText = "DirectPay:{client_transaction_id}:{description}:{amount}"
 * checksum = HMACSHA256(plainText, client_secret)
 */
export function generateChecksum(
  clientTransactionId: string,
  description: string,
  amountInPaisas: string,
  secret: string = CLIENT_SECRET
): string {
  const plainText = `DirectPay:${clientTransactionId}:${description}:${amountInPaisas}`;
  return crypto
    .createHmac('sha256', secret)
    .update(plainText)
    .digest('hex');
}

export interface DirectPayUrlParams {
  clientTransactionId: string;
  amountInPKR: number;
  description: string;
  payerName: string;
  email: string;
  msisdn: string;
  currency?: string;
  successRedirectUrl?: string;
  failedRedirectUrl?: string;
}

/**
 * Generates full payment URL for DirectPay Payin PWA landing page.
 */
export function generateDirectPayUrl(params: DirectPayUrlParams): string {
  const clientId = CLIENT_ID;
  const clientSecret = CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('DirectPay credentials (DIRECTPAY_CLIENT_ID, DIRECTPAY_CLIENT_SECRET) are missing.');
  }

  // Amount in paisas (1 PKR = 100 paisas)
  const amountInPaisas = Math.round(params.amountInPKR * 100).toString();

  // Generate checksum using original unencoded description
  const checksum = generateChecksum(
    params.clientTransactionId,
    params.description,
    amountInPaisas,
    clientSecret
  );

  const url = new URL(BASE_URL);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('client_transaction_id', params.clientTransactionId);
  url.searchParams.set('amount', amountInPaisas);
  url.searchParams.set('description', params.description);
  url.searchParams.set('payer_name', params.payerName);
  url.searchParams.set('email', params.email);
  url.searchParams.set('msisdn', params.msisdn);
  url.searchParams.set('checksum', checksum);
  url.searchParams.set('currency', params.currency || 'PKR');

  if (params.successRedirectUrl) {
    url.searchParams.set('success_redirect_url', params.successRedirectUrl);
  }
  if (params.failedRedirectUrl) {
    url.searchParams.set('failed_redirect_url', params.failedRedirectUrl);
  }

  return url.toString();
}
