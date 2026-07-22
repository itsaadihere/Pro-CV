import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Sophi</h3>
            <p className="text-sm text-slate-400 max-w-xs">
              AI-powered CV builder for professionals in Pakistan. Optimize your resume for ATS and get hired faster.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-primary transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <address className="not-italic text-sm space-y-2 text-slate-400">
              <p>A-23, Saima Luxury Homes,</p>
              <p>Bagh e Korangi, Karachi, Pakistan</p>
              <p className="pt-2">
                <a href="tel:+923362500595" className="hover:text-primary transition-colors">+92 336 2500 595</a>
              </p>
              <p>
                <a href="mailto:support@joinsophi.com" className="hover:text-primary transition-colors">support@joinsophi.com</a>
              </p>
            </address>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Sophi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
