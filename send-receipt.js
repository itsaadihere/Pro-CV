const nodemailer = require('nodemailer');

async function sendReceipt() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.titan.email',
    port: 465,
    secure: true,
    auth: {
      user: 'noreply@joinsophi.com',
      pass: 'JoinSophi@123'
    }
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #0f172a; margin: 0;">Sophi</h1>
        <p style="color: #64748b; margin-top: 5px;">Your AI Career Assistant</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #10b981; margin-top: 0; text-align: center;">Payment Successful!</h2>
        <p style="color: #334155; text-align: center;">Thank you for your purchase. Your CV Revamp credit has been added to your account.</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #64748b;">Order Number:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #0f172a; text-align: right; font-weight: bold;">SP-${Date.now()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #64748b;">Date:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #0f172a; text-align: right; font-weight: bold;">${new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #64748b;">Payment Method:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #0f172a; text-align: right; font-weight: bold;">Safepay Secure Checkout</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #64748b;">Item:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #0f172a; text-align: right; font-weight: bold;">1x AI CV Revamp Credit</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #0f172a;">Total Paid:</td>
          <td style="padding: 10px; font-weight: bold; color: #10b981; text-align: right; font-size: 18px;">1,500 PKR</td>
        </tr>
      </table>

      <div style="text-align: center; color: #64748b; font-size: 12px; margin-top: 30px;">
        <p>If you have any questions, please contact us at support@joinsophi.com</p>
        <p>&copy; ${new Date().getFullYear()} Sophi. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Sophi" <noreply@joinsophi.com>',
      to: 'binmusharrafsyedsaad@gmail.com',
      subject: 'Receipt for your Sophi Payment (Order #SP-' + Date.now() + ')',
      html: htmlContent,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendReceipt();
