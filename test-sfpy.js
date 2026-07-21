const { Safepay } = require('@sfpy/node-sdk');

const safepay = new Safepay({
  environment: 'sandbox',
  apiKey: 'sec_99204c45-e3a2-4c81-b94e-e4c0e7e27464',
  v1Secret: '39b62af41e2a0b4ce5c2640939b6d03f6ebfbe97b4e00bed1eddc408136ad189',
  webhookSecret: 'dummy-secret-for-sdk-to-work',
});

async function run() {
  try {
    const { token } = await safepay.payments.create({
      amount: 150000,
      currency: 'PKR',
    });

    const url = safepay.checkout.create({
      token,
      orderId: 'TEST_ORDER_123',
      cancelUrl: 'http://localhost:3000/cancel',
      redirectUrl: 'http://localhost:3000/success',
      source: 'custom',
      webhooks: false,
    });
    console.log('Success:', url);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
        console.error('Response data:', error.response.data);
    }
  }
}

run();
