import React from 'react';
import Header from '@/components/Header';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-8">Return, Refund, and Service Delivery Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Service Delivery (Shipping) Policy</h2>
          <p>
            Sophi is a digital service provider. Upon successful payment for our complete CV package (1500 PKR), the service is delivered instantly and electronically. There are no physical goods shipped. You will gain immediate access to generate, view, and download your CV, cover letter, and LinkedIn optimization materials as PDF or digital files directly from our web application.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Return and Refund Policy</h2>
          <p>
            Due to the immediate, digital nature of our AI-generated CV services, we generally do not offer returns or refunds once a document has been generated and accessed or downloaded.
          </p>
          
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Exceptions</h3>
          <p>
            We may issue a refund on a case-by-case basis under the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You were charged multiple times for a single transaction due to a technical error.</li>
            <li>Our service experienced a critical technical failure preventing you from generating or accessing your CV, and our support team is unable to resolve the issue within 48 hours.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3">Requesting a Refund</h3>
          <p>
            If you believe you are eligible for a refund based on the exceptions above, please contact our support team within 7 days of the original purchase. Include your payment receipt and a detailed explanation of the issue.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Contact Us</h2>
          <p>
            If you have questions about our delivery or refund practices, you can reach us at:<br /><br />
            <strong>Address:</strong> NC-24, Deh Dih, Dr. Salim Habib Road, in the Korangi Creek area of Karachi, Pakistan<br />
            <strong>Phone:</strong> +92 336 2500 595<br />
            <strong>Email:</strong> support@joinsophi.com
          </p>
        </div>
      </main>
    </div>
  );
}
