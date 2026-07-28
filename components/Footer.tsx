import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-900 pb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            <span className="text-lg font-bold tracking-tight text-white">
              LOANEXA<span className="text-emerald-500">USA</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 text-center md:text-right max-w-md leading-relaxed">
            Loanexa USA provides high-speed enterprise loan underwriting processing architecture. All submitted documentation parameters are encrypted and compiled securely under strict credit validation matrix metrics.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Loanexa USA Financial Systems. All systemic infrastructure assets reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Compliance Framework</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Infrastructure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}