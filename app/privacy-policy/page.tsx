import React from 'react';
import Header from '@/components/Header';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            When you use Sophi, we may collect personal information such as your name, email address, phone number, and professional details included in the CVs or resumes you upload. We also collect usage data and cookies to improve your experience.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            The information we collect is used to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our CV building service.</li>
            <li>Process your transactions securely via our payment partners (e.g., PayFast).</li>
            <li>Analyze and improve our AI algorithms to generate better resumes.</li>
            <li>Communicate with you regarding updates, support, and marketing.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Data Security and Sharing</h2>
          <p>
            We implement strong security measures to protect your personal data. We do not sell your personal information. We may share data with trusted third-party service providers (like payment gateways and cloud hosting) strictly for the purpose of operating our service.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Your Rights</h2>
          <p>
            You have the right to access, update, or request deletion of your personal information. If you wish to exercise these rights, please contact us using the details below.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:<br /><br />
            <strong>Address:</strong> A-23, Saima Luxury Homes, Bagh e Korangi, Karachi, Pakistan<br />
            <strong>Phone:</strong> +92 336 2500 595<br />
            <strong>Email:</strong> support@joinsophi.com
          </p>
        </div>
      </main>
    </div>
  );
}
