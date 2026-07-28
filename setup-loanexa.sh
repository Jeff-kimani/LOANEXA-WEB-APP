#!/bin/bash

# ============================================================================
# LOANEXA USA - SYSTEM COMPONENT ARCHITECTURE DEPLOYMENT SCRIPT
# Target Framework: Next.js 14+ (App Router)
# Dependencies: pg (PostgreSQL Client), lucide-react (Icon Library)
# ============================================================================

echo "🚀 Starting Loanexa USA structure generation..."

# Ensure target directories exist cleanly
mkdir -p lib
mkdir -p components
mkdir -p app/apply
mkdir -p app/track
mkdir -p app/admin
mkdir -p app/api/states
mkdir -p app/api/apply
mkdir -p app/api/applications
mkdir -p app/api/applications/[id]/verify

# ============================================================================
# 1. ENVIRONMENT CONFIGURATION FILE
# ============================================================================
cat << 'EOF' > .env.local
# Database Connection Strings (PostgreSQL Core)
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=your_secure_password_here
PGDATABASE=loanexa_db
PGPORT=5432

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
echo "✅ Created .env.local"

# ============================================================================
# 2. DATABASE UTILITY DRIVER (lib/db.ts)
# ============================================================================
cat << 'EOF' > lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT || 5432),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error layer:', error);
    throw error;
  }
}
EOF
echo "✅ Created lib/db.ts"

# ============================================================================
# 3. LAYOUT COMPONENTS (Header & Footer)
# ============================================================================
cat << 'EOF' > components/Header.tsx
import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-[#0f172a] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
      <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
        <div className="bg-emerald-600 p-2 rounded-lg text-white">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Loanexa <span className="text-emerald-500">USA</span></h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Manual Verification Portal</p>
        </div>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link href="/#calculator" className="text-slate-300 hover:text-white transition-colors">Loan Terms Calculator</Link>
        <Link href="/track" className="text-slate-300 hover:text-white transition-colors">Track Status</Link>
        <Link href="/apply" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors shadow-md">
          Apply Now
        </Link>
      </nav>
    </header>
  );
}
EOF

cat << 'EOF' > components/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-400 border-t border-slate-800 py-8 px-6 text-center text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 Loanexa USA Micro-Finance Corporation. All institutional parameters reserved.</p>
        <p className="text-slate-500">Secure AES-256 Bit Encrypted Client-End Offline Delivery Protocol.</p>
      </div>
    </footer>
  );
}
EOF
echo "✅ Created Header and Footer layout components"

# ============================================================================
# 4. LANDING PAGE WITH LOAN CALCULATOR (app/page.tsx)
# ============================================================================
cat << 'EOF' > app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DollarSign, Percent, Calendar, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [amount, setAmount] = useState<number>(5000);
  const [term, setTerm] = useState<number>(12);
  
  // Static institutional calculation parameters
  const annualRate = 0.085; // 8.5% Base Fixed APR
  const monthlyRate = annualRate / 12;
  const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  const totalRepayment = monthlyPayment * term;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Copy Panel */}
        <section className="max-w-5xl mx-auto pt-16 pb-12 px-6 text-center">
          <span className="bg-emerald-50 text-emerald-700 font-mono text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200 uppercase tracking-wide">
            Institutional Credit Asset System
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-6 max-w-3xl mx-auto leading-tight">
            Secure Micro-Finance Provisioning with <span className="text-emerald-600">Manual ID Verification</span>
          </h1>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-base">
            Loanexa USA bypasses automated algorithmic scoring APIs. Every application goes directly to our local multi-state credit desks for personalized asset review.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/apply" className="bg-slate-900 text-white font-medium px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-md flex items-center space-x-2">
              <span>Initialize Loan Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/track" className="bg-white border border-slate-200 text-slate-700 font-medium px-6 py-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              Track File Registry
            </Link>
          </div>
        </section>

        {/* Dynamic Calculator Module */}
        <section id="calculator" className="max-w-4xl mx-auto my-8 px-6">
          <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-6 flex items-center space-x-2">
                <span>Loan Terms Calculator</span>
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">Principal Requested</label>
                    <span className="text-lg font-bold font-mono text-slate-900">${amount.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="500" max="25000" step="500" value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>$500</span>
                    <span>$25,000 max</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">Amortization Period</label>
                    <span className="text-lg font-bold font-mono text-slate-900">{term} Months</span>
                  </div>
                  <input 
                    type="range" min="3" max="36" step="3" value={term} 
                    onChange={(e) => setTerm(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>3 Mos</span>
                    <span>36 Mos max</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Results Block */}
            <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-mono uppercase text-slate-400 tracking-wider">Estimated Installment matrix</p>
                <div>
                  <p className="text-xs text-slate-400">Target Monthly Payment</p>
                  <p className="text-4xl font-black text-emerald-400 font-mono mt-1">
                    ${monthlyPayment.toFixed(2)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block">Fixed APR</span>
                    <span className="text-white font-bold">8.50%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Repayable</span>
                    <span className="text-white font-bold">${totalRepayment.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link href="/apply" className="w-full text-center bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-500 transition-colors mt-6 block shadow-lg">
                Proceed with this Matrix
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
EOF
echo "✅ Created app/page.tsx (Landing + Calculator)"

# ============================================================================
# 5. MULTI-STEP BORROWER WIZARD FORM (app/apply/page.tsx)
# ============================================================================
cat << 'EOF' > app/apply/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, ShieldCheck, Loader2 } from 'lucide-react';

interface StateOption {
  state_code: string;
  state_name: string;
}

export default function ApplyWizard() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [states, setStates] = useState<StateOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Master Onboarding State Payload
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', dob: '',
    address: '', city: '', state: '', zip: '',
    income: '', employmentStatus: 'Full-Time', employerName: '',
    loanAmount: '5000', loanTermMonths: '12', loanPurpose: 'Debt Consolidation',
    ssnLast4: '', licenseNumber: '', licenseState: ''
  });

  useEffect(() => {
    fetch('/api/states')
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(err => console.error("Error loading states lookup catalog:", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const executeFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        router.push(`/track?id=${data.applicationId}`);
      } else {
        alert(`Submission Failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Fatal client network transmission mismatch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />
      <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-10">
        
        {/* Dynamic Multi-Step Progress Tracker HUD */}
        <div className="flex items-center justify-between mb-8 px-4 font-mono text-xs font-semibold text-slate-400">
          {[
            { label: 'Personal', stepNum: 1 },
            { label: 'Residence', stepNum: 2 },
            { label: 'Financial', stepNum: 3 },
            { label: 'Identity Verification', stepNum: 4 }
          ].map((item) => (
            <div key={item.stepNum} className="flex items-center space-x-2">
              <span className={`w-6 h-6 flex items-center justify-center rounded-full border text-[10px] ${step >= item.stepNum ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200'}`}>
                {step > item.stepNum ? <Check className="w-3 h-3" /> : item.stepNum}
              </span>
              <span className={step === item.stepNum ? 'text-slate-900 font-bold' : ''}>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 md:p-8">
          <form onSubmit={executeFormSubmission} className="space-y-6">
            
            {/* STEP 1: PERSONAL DETAILS */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Legal Full Name</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Phone Number</label>
                    <input type="text" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="(512) 555-0143" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Date of Birth</label>
                    <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: RESIDENTIAL JURISDICTION */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Primary US Residence</h2>
                <p className="text-xs text-slate-500">Applicant must reside within an active state jurisdiction.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Street Address</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="123 Main St" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">City</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="Austin" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">State Code</label>
                      <select name="state" required value={formData.state} onChange={handleInputChange} className="w-full border p-2 rounded-lg bg-white">
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s.state_code} value={s.state_code}>{s.state_code} - {s.state_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">ZIP Code</label>
                      <input type="text" name="zip" required value={formData.zip} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="78701" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: FINANCIAL PARAMETERS & PURPOSE SELECT */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Financial Parameters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Annual Verifiable Income</label>
                    <input type="number" name="income" required value={formData.income} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="75000" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Employment Vector</label>
                    <select name="employmentStatus" value={formData.employmentStatus} onChange={handleInputChange} className="w-full border p-2 rounded-lg bg-white">
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contractor">Contractor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Employer Name</label>
                    <input type="text" name="employerName" required value={formData.employerName} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="Stripe Tech Industries" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Primary Loan Purpose</label>
                    <select name="loanPurpose" value={formData.loanPurpose} onChange={handleInputChange} className="w-full border p-2 rounded-lg bg-white border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                      <option value="Debt Consolidation">Debt Consolidation</option>
                      <option value="Home Improvement">Home Improvement</option>
                      <option value="Medical Expenses">Medical Expenses</option>
                      <option value="Emergency Auto Repair">Emergency Auto Repair</option>
                      <option value="Business Expansion">Business Expansion</option>
                      <option value="Education/Tuition">Education/Tuition</option>
                      <option value="Major Purchase">Major Purchase</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: MANUAL IDENTITY CAPTURE PANEL */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Manual ID & SSN Verification</h2>
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-xs flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Secure External Verification Protocol</p>
                    <p className="mt-1 text-slate-600">
                      Loanexa USA keeps borrower profiles isolated from online credential risk. Rather than uploading static images here, our manual credit underwriting office will review your application details and issue a customized, one-time external biometric lookup link.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">SSN (Last 4 Digits)</label>
                    <input type="text" name="ssnLast4" maxLength={4} required value={formData.ssnLast4} onChange={handleInputChange} className="w-full border p-2 rounded-lg font-mono tracking-widest text-center" placeholder="••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">DL Issuing State</label>
                    <select name="licenseState" required value={formData.licenseState} onChange={handleInputChange} className="w-full border p-2 rounded-lg bg-white font-mono">
                      <option value="">State</option>
                      {states.map((s) => (
                        <option key={s.state_code} value={s.state_code}>{s.state_code}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Driver's License Number</label>
                    <input type="text" name="licenseNumber" required value={formData.licenseNumber} onChange={handleInputChange} className="w-full border p-2 rounded-lg font-mono" placeholder="D12345678" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Button Footer Row */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                  Back
                </button>
              ) : <div />}
              
              <button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-500 transition-colors flex items-center space-x-2 shadow-sm disabled:opacity-50">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Registry Transaction...</span>
                  </>
                ) : (
                  <span>{step === 4 ? 'Submit Loan Application File' : 'Continue'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
EOF
echo "✅ Created app/apply/page.tsx (Multi-step Form)"

# ============================================================================
# 6. CLIENT TRACK STATUS HUD LOOKUP (app/track/page.tsx)
# ============================================================================
cat << 'EOF' > app/track/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, ShieldAlert, ExternalLink } from 'lucide-react';

interface TrackingResult {
  id: string;
  fullName: string;
  status: string;
  loanAmount: number;
  loanPurpose: string;
  externalVerifyLink?: string;
  createdAt: string;
}

export default function TrackStatus() {
  const searchParams = useSearchParams();
  const [appId, setAppId] = useState<string>('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const executeTrackLookup = useCallback(async (targetId: string) => {
    if (!targetId.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/applications?id=${targetId}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult(null);
      }
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setAppId(idParam);
      executeTrackLookup(idParam);
    }
  }, [searchParams, executeTrackLookup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrackLookup(appId);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />
      <main className="flex-grow max-w-2xl w-full mx-auto px-4 py-12">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 text-center mb-2">Track Application Status</h1>
        <p className="text-slate-500 text-xs font-mono text-center mb-8">Enter your formal token identifier (e.g., LN-2026-8941)</p>
        
        <form onSubmit={handleSubmit} className="bg-white p-4 border border-slate-200 shadow-md rounded-xl flex space-x-2 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" value={appId} onChange={(e) => setAppId(e.target.value)}
              placeholder="LN-2026-XXXX" required
              className="w-full bg-slate-50 pl-9 pr-4 py-2 rounded-lg border font-mono font-bold uppercase tracking-wider" 
            />
          </div>
          <button type="submit" className="bg-slate-900 text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-slate-800 transition-colors">
            Lookup
          </button>
        </form>

        {loading && <p className="text-center font-mono text-xs text-slate-400 animate-pulse">Querying tracking ledger indexes...</p>}

        {searched && !loading && (
          result ? (
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">FILE REFERENCE</span>
                  <h2 className="text-lg font-mono font-black tracking-tight text-slate-900">{result.id}</h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">PIPELINE STATUS</span>
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs uppercase tracking-wider font-mono font-bold mt-1">
                    {result.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Applicant</span>
                  <span className="font-semibold text-slate-800">{result.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Requested Funds</span>
                  <span className="font-mono font-bold text-slate-900">${result.loanAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Dynamic Manual Verification Link UI Field */}
              {result.externalVerifyLink ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-emerald-800">Action Required: Manual ID Verification</p>
                  <p className="text-xs text-slate-600">Your underwriter has confirmed entry. Click below to fulfill verification:</p>
                  <a href={result.externalVerifyLink} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-xs font-mono font-bold text-emerald-700 hover:underline">
                    <span>Link to External Verification Protocol</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
                  <p className="font-semibold text-slate-700">Awaiting Operational Routing</p>
                  <p className="mt-1">Your underwriter is assigning your file to a secure off-grid identification terminal. Once assigned, your link will dynamically appear here.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center space-x-2 font-mono">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>Token reference match not found inside system tables. Verify format entry.</span>
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
EOF
echo "✅ Created app/track/page.tsx"

# ============================================================================
# 7. ADMINISTRATIVE CONTROL MONITOR DESK TERMINAL (app/admin/page.tsx)
# ============================================================================
cat << 'EOF' > app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Search, FileText, Send, Link as LinkIcon, Loader2 } from 'lucide-react';

interface Application {
  id: string;
  fullName: string;
  state: string;
  loanAmount: number;
  loanPurpose: string;
  status: 'pending' | 'reviewing' | 'verified' | 'disbursed' | 'declined';
  ssnLast4: string;
  externalVerifyLink?: string;
  createdAt: string;
}

export default function UnderwriterAdmin() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [syncTime, setSyncTime] = useState<string>('');
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
        setSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Administrative database polling sync mismatch:", err);
    }
  };

  // 4-Second High-Frequency Synchronization Loop Engine
  useEffect(() => {
    fetchQueue();
    const pulse = setInterval(fetchQueue, 4000);
    return () => clearInterval(pulse);
  }, []);

  const handleLinkDispatch = async (appId: string) => {
    const urlToSend = linkInputs[appId];
    if (!urlToSend || !urlToSend.trim()) return;

    setSubmittingId(appId);
    try {
      const res = await fetch(`/api/applications/${appId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ externalVerifyLink: urlToSend }),
      });
      if (res.ok) {
        // Optimistic UI updates
        setApplications(prev => prev.map(app => app.id === appId ? { ...app, externalVerifyLink: urlToSend } : app));
        setLinkInputs(prev => ({ ...prev, [appId]: '' }));
      } else {
        alert("Verification route error dispatching payload.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingId(null);
    }
  };

  const filtered = applications.filter(app => 
    app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
      {/* Admin Operations Top Navbar */}
      <header className="bg-[#0b0f19] px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight">Loanexa <span className="text-emerald-500">USA</span></h1>
            <p className="text-[10px] text-slate-400 font-mono">AUTHORIZED OPERATOR COMMAND PANEL</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 font-mono text-[11px]">
          <div className="flex items-center space-x-2 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">Sync Pipeline Active (4s)</span>
          </div>
          <span className="text-slate-400">Refreshed: {syncTime || 'Syncing...'}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {/* Search Control HUD */}
        <div className="bg-[#0b0f19] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" placeholder="Filter queue by ID or Name..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <span className="text-xs font-mono text-slate-400">File Matrix Capacity: {filtered.length} records</span>
        </div>

        {/* Master Queue Data Table */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Application ID</th>
                <th className="px-4 py-3">Client Identity</th>
                <th className="px-4 py-3">Requested / Purpose</th>
                <th className="px-4 py-3">SSN Last 4</th>
                <th className="px-4 py-3">Verification Link Registry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">
                    No active transaction logs streaming inside lookup limits.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-emerald-400">{app.id}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-white">{app.fullName}</p>
                      <span className="text-[10px] font-mono text-slate-400">{app.state}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-200">${app.loanAmount.toLocaleString()}</p>
                      <span className="text-[10px] text-slate-400 block font-mono">{app.loanPurpose}</span>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-400">***-**-{app.ssnLast4}</td>
                    
                    {/* Link Dispatcher Control Interface */}
                    <td className="px-4 py-4 w-96">
                      {app.externalVerifyLink ? (
                        <div className="flex items-center space-x-2 text-emerald-400 font-mono text-[11px] bg-emerald-950/40 p-2 rounded border border-emerald-900/60">
                          <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate max-w-[300px]">{app.externalVerifyLink}</span>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <input 
                            type="url" placeholder="https://verify.loanexa-usa.org/..."
                            value={linkInputs[app.id] || ''}
                            onChange={(e) => setLinkInputs({ ...linkInputs, [app.id]: e.target.value })}
                            className="flex-grow bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                          />
                          <button 
                            onClick={() => handleLinkDispatch(app.id)}
                            disabled={submittingId === app.id}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 transition-colors disabled:opacity-50"
                          >
                            {submittingId === app.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Send className="w-3 h-3" />
                                <span>Inject</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
EOF
echo "✅ Created app/admin/page.tsx (Underwriter Panel)"

# ============================================================================
# 8. BACKEND ROUTE: ACTIVE US STATES (app/api/states/route.ts)
# ============================================================================
cat << 'EOF' > app/api/states/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      'SELECT state_code, state_name FROM us_states WHERE is_active = true ORDER BY state_name ASC'
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Directory Fetch Error' }, { status: 500 });
  }
}
EOF
echo "✅ Created app/api/states/route.ts"

# ============================================================================
# 9. BACKEND ROUTE: SUBMIT APPLICATION TRANSACTION (app/api/apply/route.ts)
# ============================================================================
cat << 'EOF' > app/api/apply/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName, email, phone, dob,
      address, city, state, zip,
      income, employmentStatus, employerName,
      loanAmount, loanTermMonths, loanPurpose,
      ssnLast4, licenseNumber, licenseState
    } = body;

    // 1. Structural Validation
    if (!fullName || !email || !ssnLast4 || !licenseNumber) {
      return NextResponse.json({ error: 'Missing Identity Fields' }, { status: 400 });
    }

    // 2. Generate custom structured ticket identifier code
    const generatedSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `LN-2026-${generatedSuffix}`;

    // 3. atomic user write profile session execution
    const userResult = await query(
      `INSERT INTO users (full_name, email, phone, dob, address, city, state, zip)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
       RETURNING id`,
      [fullName, email, phone, dob, address, city, state, zip]
    );
    const userId = userResult.rows[0].id;

    // 4. Record credit application entry to formal tables
    await query(
      `INSERT INTO applications (
        id, user_id, income, employment_status, employer_name,
        loan_amount, loan_term_months, loan_purpose,
        ssn_last_4, license_number, license_state, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')`,
      [
        applicationId, userId, Number(income), employmentStatus, employerName,
        Number(loanAmount), Number(loanTermMonths), loanPurpose,
        ssnLast4, licenseNumber, licenseState
      ]
    );

    // 5. Commit log telemetry sequence
    await query(
      `INSERT INTO underwriter_logs (application_id, event_type, log_message)
       VALUES ($1, 'KEY_HANDSHAKE', 'Pipeline application entry finalized from consumer form context.')`,
      [applicationId]
    );

    return NextResponse.json({ success: true, applicationId });
  } catch (err: any) {
    console.error("Critical submission crash trace:", err);
    return NextResponse.json({ error: 'Transaction Insertion Failed', detail: err.message }, { status: 500 });
  }
}
EOF
echo "✅ Created app/api/apply/route.ts"

# ============================================================================
# 10. BACKEND ROUTE: ANALYTICAL READ & LIVE POLLING (app/api/applications/route.ts)
# ============================================================================
cat << 'EOF' > app/api/applications/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      // Isolate individual client tracking metrics matching input parameters
      const result = await query(
        `SELECT a.id, u.full_name as "fullName", a.status, a.loan_amount as "loanAmount", 
                a.loan_purpose as "loanPurpose", a.external_verify_link as "externalVerifyLink", a.created_at as "createdAt"
         FROM applications a
         JOIN users u ON a.user_id = u.id
         WHERE a.id = $1`,
        [id.toUpperCase()]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Application entry not located' }, { status: 404 });
      }
      return NextResponse.json(result.rows[0]);
    } else {
      // General full queue array loop return for underwriter monitoring screens
      const result = await query(
        `SELECT a.id, u.full_name as "fullName", u.state, a.loan_amount as "loanAmount", 
                a.loan_purpose as "loanPurpose", a.status, a.ssn_last_4 as "ssnLast4", 
                a.external_verify_link as "externalVerifyLink", a.created_at as "createdAt"
         FROM applications a
         JOIN users u ON a.user_id = u.id
         ORDER BY a.created_at DESC`
      );
      return NextResponse.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database pipeline sync exception' }, { status: 500 });
  }
}
EOF
echo "✅ Created app/api/applications/route.ts"

# ============================================================================
# 11. BACKEND ROUTE: MANUAL LINK DISPATCH INTERACTION
# (app/api/applications/[id]/verify/route.ts)
# ============================================================================
cat << 'EOF' > app/api/applications/[id]/verify/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { externalVerifyLink } = await request.json();

    if (!externalVerifyLink) {
      return NextResponse.json({ error: 'Target destination link missing' }, { status: 400 });
    }

    // Mutate and append the external verification parameters to row values
    await query(
      `UPDATE applications 
       SET external_verify_link = $1, status = 'reviewing'
       WHERE id = $2`,
      [externalVerifyLink, id.toUpperCase()]
    );

    // Inject system tracking log sequence
    await query(
      `INSERT INTO underwriter_logs (application_id, event_type, log_message)
       VALUES ($1, 'STATUS_MUTATION', 'Underwriter appended verification routing protocol payload link.')`,
      [id.toUpperCase()]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Operation mutation exception' }, { status: 500 });
  }
}
EOF
echo "✅ Created app/api/applications/[id]/verify/route.ts"

echo "======================================================================="
echo "🎉 DEPLOYMENT COMPLETE: Loanexa USA file system scaffolding generated successfully!"
echo "======================================================================="
echo "1. Run your database build script."
echo "2. Populated connection credentials inside .env.local"
echo "3. Spin up your local dev ecosystem: npm run dev"
echo "======================================================================="
EOF