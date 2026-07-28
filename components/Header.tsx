'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, ShieldCheck, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-900 text-white sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand Element */}
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-400" />
            <span className="text-xl font-bold tracking-tight text-white">
              LOANEXA<span className="text-emerald-400">USA</span>
            </span>
          </Link>

          {/* Core Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <Link href="#features" className="hover:text-emerald-400 transition-colors">
              How It Works
            </Link>
            <Link href="#calculator" className="hover:text-emerald-400 transition-colors">
              Loan Calculator
            </Link>
            <Link href="#track" className="hover:text-emerald-400 transition-colors">
              Track Status
            </Link>
          </nav>

          {/* Secure Access Action Portals */}
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-400/30 bg-emerald-400/5 px-3 py-1.5 rounded hover:bg-emerald-400/10 transition-all"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Underwriter Portal
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-1 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-emerald-400" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-6 space-y-3 font-medium text-sm text-slate-300">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block hover:text-emerald-400 py-1 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="#features" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block hover:text-emerald-400 py-1 transition-colors"
          >
            How It Works
          </Link>
          <Link 
            href="#calculator" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block hover:text-emerald-400 py-1 transition-colors"
          >
            Loan Calculator
          </Link>
          <Link 
            href="#track" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block hover:text-emerald-400 py-1 transition-colors"
          >
            Track Status
          </Link>
        </div>
      )}
    </header>
  );
}