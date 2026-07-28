#!/bin/bash

echo "🧱 Initializing Loanexa Shared UI Component Engine..."
echo "--------------------------------------------------------"

# 1. Create the target components folder
mkdir -p components
echo "📁 Root component container generated layout successfully."

# 2. Populate the global Header component
echo "📝 Generating components/Header.tsx..."
cat << 'EOF' > components/Header.tsx
import React from 'react';
import Link from 'next/link';
import { Shield, Menu, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900 text-white sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand Element */}
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-400" />
            <span className="text-xl font-bold tracking-tight text-white">
              LOANEXA<span className="text-emerald-400">USA</span>
            </span>
          </div>

          {/* Core Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <Link href="#calculator" className="hover:text-emerald-400 transition-colors">Loan Calculator</Link>
            <Link href="#apply" className="hover:text-emerald-400 transition-colors">Apply Now</Link>
            <Link href="#status" className="hover:text-emerald-400 transition-colors">Track Status</Link>
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
            <button className="md:hidden p-1 text-slate-400 hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
EOF

# 3. Populate the global Footer component
echo "📝 Generating components/Footer.tsx..."
cat << 'EOF' > components/Footer.tsx
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
            Loanexa USA provides high-speed enterprise loan underwriting processing architecture. All submitted documentation parameters are encrypted and compiled securely under strict credit validation matrix metrics[cite: 4, 9].
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p>&copy; 2026 Loanexa USA Financial Systems. All systemic infrastructure assets reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Compliance Framework</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Infrastructure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
EOF

echo "--------------------------------------------------------"
echo "🎉 SUCCESS: Header & Footer layout elements written cleanly!"
echo "🚀 Execute 'npm run dev' to boot the fully compiled landing deck structure."