'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, FileText, Users, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Application {
  id: string;
  income: number;
  loan_amount: number;
  loan_term_months: number;
  loan_purpose: string;
  status: string;
  created_at: string;
  users: {
    full_name: string;
    email: string;
    phone: string;
    state: string;
  };
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending');

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch('/api/admin/applications');
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (err) {
        console.error('Failed to load applications queue:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const filteredApps = applications.filter((app) => 
    selectedTab === 'all' ? true : app.status === selectedTab
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl text-slate-950">
            <Shield className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">LOANEXA <span className="text-emerald-400">ADMIN PORTAL</span></h1>
            <p className="text-xs text-slate-400">Secure Manual Underwriting & Operations</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-3 py-1 rounded-full">
            Cleared: Admin Clearance
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pending Review</span>
            <div className="text-3xl font-black text-amber-400">
              {applications.filter(a => a.status === 'pending').length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Approved Loans</span>
            <div className="text-3xl font-black text-emerald-400">
              {applications.filter(a => a.status === 'approved').length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Volume Requested</span>
            <div className="text-3xl font-black text-white font-mono">
              ${applications.reduce((acc, curr) => acc + Number(curr.loan_amount), 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Borrowers</span>
            <div className="text-3xl font-black text-indigo-400">
              {new Set(applications.map(a => a.users?.email)).size}
            </div>
          </div>
        </div>

        {/* Applications Queue Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Underwriting Queue</h2>
              <p className="text-xs text-slate-400">Review incoming submissions and manage verification logs.</p>
            </div>
            
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {['pending', 'approved', 'rejected', 'all'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                    selectedTab === tab 
                      ? 'bg-emerald-600 text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Reference / Date</th>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Loan Request</th>
                  <th className="p-4">Annual Income</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">Loading live database queue...</td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">No applications found in this queue.</td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono">
                        <span className="font-bold text-emerald-400 block">{app.id}</span>
                        <span className="text-[11px] text-slate-500">{new Date(app.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{app.users?.full_name || 'Unknown'}</div>
                        <div className="text-slate-400 text-xs">{app.users?.email} • {app.users?.state}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        ${Number(app.loan_amount).toLocaleString()}
                        <span className="block text-[11px] text-slate-400 font-normal">{app.loan_term_months} mos ({app.loan_purpose})</span>
                      </td>
                      <td className="p-4 font-mono text-slate-300">
                        ${Number(app.income).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          app.status === 'approved' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : app.status === 'rejected'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3.5 py-2 rounded-lg transition-colors border border-slate-700"
                        >
                          Review File
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}














































































































// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Shield, Search, FileText, Send, Link as LinkIcon, Loader2 } from 'lucide-react';

// interface Application {
//   id: string;
//   fullName: string;
//   state: string;
//   loanAmount: number;
//   loanPurpose: string;
//   status: 'pending' | 'reviewing' | 'verified' | 'disbursed' | 'declined';
//   ssnLast4: string;
//   externalVerifyLink?: string;
//   createdAt: string;
// }

// export default function UnderwriterAdmin() {
//   const [applications, setApplications] = useState<Application[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [syncTime, setSyncTime] = useState<string>('');
//   const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});
//   const [submittingId, setSubmittingId] = useState<string | null>(null);

//   const fetchQueue = async () => {
//     try {
//       const res = await fetch('/api/applications');
//       if (res.ok) {
//         const data = await res.json();
//         setApplications(data);
//         setSyncTime(new Date().toLocaleTimeString());
//       }
//     } catch (err) {
//       console.error("Administrative database polling sync mismatch:", err);
//     }
//   };

//   // 4-Second High-Frequency Synchronization Loop Engine
//   useEffect(() => {
//     fetchQueue();
//     const pulse = setInterval(fetchQueue, 4000);
//     return () => clearInterval(pulse);
//   }, []);

//   const handleLinkDispatch = async (appId: string) => {
//     const urlToSend = linkInputs[appId];
//     if (!urlToSend || !urlToSend.trim()) return;

//     setSubmittingId(appId);
//     try {
//       const res = await fetch(`/api/applications/${appId}/verify`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ externalVerifyLink: urlToSend }),
//       });
//       if (res.ok) {
//         // Optimistic UI updates
//         setApplications(prev => prev.map(app => app.id === appId ? { ...app, externalVerifyLink: urlToSend } : app));
//         setLinkInputs(prev => ({ ...prev, [appId]: '' }));
//       } else {
//         alert("Verification route error dispatching payload.");
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSubmittingId(null);
//     }
//   };

//   const filtered = applications.filter(app => 
//     app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     app.id.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
//       {/* Admin Operations Top Navbar */}
//       <header className="bg-[#0b0f19] px-6 py-4 flex items-center justify-between border-b border-slate-800">
//         <div className="flex items-center space-x-3">
//           <div className="bg-emerald-600 p-2 rounded-lg text-white">
//             <Shield className="w-5 h-5" />
//           </div>
//           <div>
//             <h1 className="text-md font-bold tracking-tight">Loanexa <span className="text-emerald-500">USA</span></h1>
//             <p className="text-[10px] text-slate-400 font-mono">AUTHORIZED OPERATOR COMMAND PANEL</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-4 font-mono text-[11px]">
//           <div className="flex items-center space-x-2 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
//             <span className="flex h-1.5 w-1.5 relative">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
//             </span>
//             <span className="text-slate-300">Sync Pipeline Active (4s)</span>
//           </div>
//           <span className="text-slate-400">Refreshed: {syncTime || 'Syncing...'}</span>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
//         {/* Search Control HUD */}
//         <div className="bg-[#0b0f19] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
//           <div className="relative w-80">
//             <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
//             <input 
//               type="text" placeholder="Filter queue by ID or Name..."
//               value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
//             />
//           </div>
//           <span className="text-xs font-mono text-slate-400">File Matrix Capacity: {filtered.length} records</span>
//         </div>

//         {/* Master Queue Data Table */}
//         <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-800/50 border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
//                 <th className="px-4 py-3">Application ID</th>
//                 <th className="px-4 py-3">Client Identity</th>
//                 <th className="px-4 py-3">Requested / Purpose</th>
//                 <th className="px-4 py-3">SSN Last 4</th>
//                 <th className="px-4 py-3">Verification Link Registry</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-800/60 text-xs">
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">
//                     No active transaction logs streaming inside lookup limits.
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((app) => (
//                   <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
//                     <td className="px-4 py-4 font-mono font-bold text-emerald-400">{app.id}</td>
//                     <td className="px-4 py-4">
//                       <p className="font-semibold text-white">{app.fullName}</p>
//                       <span className="text-[10px] font-mono text-slate-400">{app.state}</span>
//                     </td>
//                     <td className="px-4 py-4">
//                       <p className="font-bold text-slate-200">${app.loanAmount.toLocaleString()}</p>
//                       <span className="text-[10px] text-slate-400 block font-mono">{app.loanPurpose}</span>
//                     </td>
//                     <td className="px-4 py-4 font-mono text-slate-400">***-**-{app.ssnLast4}</td>
                    
//                     {/* Link Dispatcher Control Interface */}
//                     <td className="px-4 py-4 w-96">
//                       {app.externalVerifyLink ? (
//                         <div className="flex items-center space-x-2 text-emerald-400 font-mono text-[11px] bg-emerald-950/40 p-2 rounded border border-emerald-900/60">
//                           <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
//                           <span className="truncate max-w-[300px]">{app.externalVerifyLink}</span>
//                         </div>
//                       ) : (
//                         <div className="flex space-x-2">
//                           <input 
//                             type="url" placeholder="https://verify.loanexa-usa.org/..."
//                             value={linkInputs[app.id] || ''}
//                             onChange={(e) => setLinkInputs({ ...linkInputs, [app.id]: e.target.value })}
//                             className="flex-grow bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500"
//                           />
//                           <button 
//                             onClick={() => handleLinkDispatch(app.id)}
//                             disabled={submittingId === app.id}
//                             className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 transition-colors disabled:opacity-50"
//                           >
//                             {submittingId === app.id ? (
//                               <Loader2 className="w-3 h-3 animate-spin" />
//                             ) : (
//                               <>
//                                 <Send className="w-3 h-3" />
//                                 <span>Inject</span>
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// }
