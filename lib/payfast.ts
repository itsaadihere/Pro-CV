import crypto from 'crypto';

const BASE_URL = process.env.PAYFAST_BASE_URL || 'https://sandbox.gopayfast.com';
const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || '';
const SECURED_KEY = process.env.PAYFAST_SECURED_KEY || '';

export async function getAccessToken(ip: string = '127.0.0.1') {
  const params = new URLSearchParams({
    merchant_id: MERCHANT_ID,
    secured_key: SECURED_KEY,
    grant_type: 'client_credentials',
    customer_ip: ip
  });

  const res = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!res.ok) {
    throw new Error(`Failed to get access token: ${await res.text()}`);
  }

  return res.json();
}

export async function getBanks(token: string, ip: string = '127.0.0.1') {
  const res = await fetch(`${BASE_URL}/list/banks?customer_ip=${ip}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch banks: ${await res.text()}`);
  }

  return res.json();
}

export async function validateCustomer(
  token: string,
  data: {
    basket_id: string;
    txnamt: string;
    customer_mobile_no: string;
    customer_email_address: string;
    bank_code: string;
    account_number: string;
    cnic_number: string;
    order_date: string;
    ip: string;
  }
) {
  const params = new URLSearchParams({
    basket_id: data.basket_id,
    txnamt: data.txnamt,
    customer_mobile_no: data.customer_mobile_no,
    customer_email_address: data.customer_email_address,
    account_type_id: '3', // Bank Account
    bank_code: data.bank_code,
    account_number: data.account_number,
    cnic_number: data.cnic_number,
    order_date: data.order_date,
    customer_ip: data.ip,
    merCatCode: '0000', // Typically required, defaulting to '0000' or provided value
  });

  const res = await fetch(`${BASE_URL}/customer/validate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
    },
    body: params.toString()
  });

  if (!res.ok) {
    throw new Error(`Customer validation failed: ${await res.text()}`);
  }

  return res.json();
}

export async function processTransaction(
  token: string,
  data: {
    basket_id: string;
    txnamt: string;
    customer_mobile_no: string;
    customer_email_address: string;
    bank_code: string;
    account_number: string;
    cnic_number: string;
    order_date: string;
    ip: string;
    otp: string;
    transaction_id: string;
  }
) {
  const params = new URLSearchParams({
    basket_id: data.basket_id,
    txnamt: data.txnamt,
    customer_mobile_no: data.customer_mobile_no,
    customer_email_address: data.customer_email_address,
    account_type_id: '3', // Bank Account
    bank_code: data.bank_code,
    account_number: data.account_number,
    cnic_number: data.cnic_number,
    order_date: data.order_date,
    customer_ip: data.ip,
    otp: data.otp,
    transaction_id: data.transaction_id,
    eci: 'true', // Usually required
    merCatCode: '0000',
  });

  const res = await fetch(`${BASE_URL}/transaction`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
    },
    body: params.toString()
  });

  if (!res.ok) {
    throw new Error(`Transaction failed: ${await res.text()}`);
  }

  return res.json();
}
