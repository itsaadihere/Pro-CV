const { Safepay } = require('@sfpy/node-sdk');

const safepay = new Safepay({
  environment: 'sandbox',
  apiKey: 'sec_ef875e6c-acdf-4e3e-aede-95a809839438',
  v1Secret: '13a9ff84e1f3ad3b25e57cf7ff00397e8ca44b60afc233c4e66ed8906d454c8f',
  webhookSecret: 'mock',
});

async function run() {
  try {
    const { token } = await safepay.payments.create({
      amount: 150000,
      currency: 'PKR'
    });
    console.log('Token:', token);

    const checkoutUrl = safepay.checkout.create({
      token: token,
      orderId: 'test1234',
      cancelUrl: 'http://localhost/cancel',
      redirectUrl: 'http://localhost/redirect',
      source: 'custom',
      webhooks: false
    });
    console.log('Checkout URL:', checkoutUrl);
  } catch (err) {
    console.error('Error:', err);
  }
}
run();
