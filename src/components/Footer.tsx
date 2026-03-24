import React from 'react';
import { Share2, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-container w-full pt-20 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="md:col-span-1">
          <div className="text-xl font-headline italic text-on-surface mb-6">
            Heritage Trust
          </div>
          <p className="font-body text-sm tracking-wide text-on-surface opacity-60">
            Trusted fiduciary counsel since 1924. Dedicated to the preservation and growth of generational wealth.
          </p>
        </div>
        <div>
          <h5 className="font-label text-xs uppercase tracking-[0.2em] mb-6 text-on-surface">Solutions</h5>
          <ul className="space-y-4 font-body text-sm tracking-wide">
            <li><a className="text-on-surface opacity-60 hover:text-primary hover:underline underline-offset-4 transition-all" href="#">Wealth Management</a></li>
            <li><a className="text-on-surface opacity-60 hover:text-primary hover:underline underline-offset-4 transition-all" href="#">Estate Planning</a></li>
            <li><a className="text-on-surface opacity-60 hover:text-primary hover:underline underline-offset-4 transition-all" href="#">Institutional Trust</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-label text-xs uppercase tracking-[0.2em] mb-6 text-on-surface">Global Offices</h5>
          <ul className="space-y-4 font-body text-sm tracking-wide">
            <li className="text-on-surface opacity-60">Houston, TX (HQ)</li>
            <li className="text-on-surface opacity-60">Dallas, TX</li>
            <li className="text-on-surface opacity-60">Austin, TX</li>
            <li className="text-on-surface opacity-60">New York, NY</li>
          </ul>
        </div>
        <div>
          <h5 className="font-label text-xs uppercase tracking-[0.2em] mb-6 text-on-surface">Resources</h5>
          <ul className="space-y-4 font-body text-sm tracking-wide">
            <li><a className="text-on-surface opacity-60 hover:text-primary hover:underline underline-offset-4 transition-all" href="#">Privacy Policy</a></li>
            <li><a className="text-on-surface opacity-60 hover:text-primary hover:underline underline-offset-4 transition-all" href="#">Terms of Service</a></li>
            <li><a className="text-on-surface opacity-60 hover:text-primary hover:underline underline-offset-4 transition-all" href="#">Disclosures</a></li>
            <li><a className="text-on-surface opacity-60 hover:text-primary hover:underline underline-offset-4 transition-all" href="#">Contact Support</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-20 px-6 md:px-12 max-w-screen-2xl mx-auto border-t border-outline-variant/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-body text-xs tracking-wide text-on-surface opacity-60 text-center md:text-left">
          © 2024 Heritage Editorial Trust. All rights reserved. Member FDIC. Equal Housing Lender.
        </p>
        <div className="flex gap-8">
          <a className="text-on-surface opacity-60 hover:opacity-100 transition-opacity" href="#"><Share2 size={18} /></a>
          <a className="text-on-surface opacity-60 hover:opacity-100 transition-opacity" href="#"><Mail size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
