import React from 'react';
import Header from '@/components/Header';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Sophi ("we," "our," or "us"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
          <p>
            Sophi is an AI-powered CV and resume builder that provides automated document creation and optimization services for a flat fee. We provide digital services including resume generation, ATS scoring, and cover letter creation.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. User Responsibilities</h2>
          <p>
            You agree to provide accurate and truthful information when using our platform to generate your CV. You are solely responsible for the content of the resumes generated using our service. We are not liable for any employment outcomes resulting from the use of documents created on Sophi.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Payment and Pricing</h2>
          <p>
            Our service is offered at a single subscription/package rate of 1500 PKR. All payments are securely processed through our authorized payment gateways (including DirectPay). Prices are subject to change, but you will only be charged the price explicitly stated at checkout.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            The technology, AI algorithms, templates, and website design of Sophi are our exclusive property. Your generated CV containing your personal data is yours to use freely.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            Sophi provides its services "as is" and without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from the use of our service.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Contact Information</h2>
          <p>
            For any questions or concerns regarding these Terms and Conditions, please contact us at:<br /><br />
            <strong>Address:</strong> A-23, Saima Luxury Homes, Bagh e Korangi, Karachi, Pakistan<br />
            <strong>Phone:</strong> +92 336 2500 595<br />
            <strong>Email:</strong> support@joinsophi.com
          </p>
        </div>
      </main>
    </div>
  );
}
