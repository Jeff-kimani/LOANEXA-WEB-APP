// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import { Check, ShieldCheck, Loader2 } from 'lucide-react';

// interface StateOption {
//   state_code: string;
//   state_name: string;
// }

// export default function ApplyWizard() {
//   const router = useRouter();
//   const [step, setStep] = useState<number>(1);
//   const [states, setStates] = useState<StateOption[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
//   // Master Onboarding State Payload
//   const [formData, setFormData] = useState({
//     fullName: '', email: '', phone: '', dob: '',
//     address: '', city: '', state: '', zip: '',
//     income: '', employmentStatus: 'Full-Time', employerName: '',
//     loanAmount: '5000', loanTermMonths: '12', loanPurpose: 'Debt Consolidation',
//     ssnLast4: '', licenseNumber: '', licenseState: ''
//   });

//   useEffect(() => {
//     fetch('/api/states')
//       .then(res => res.json())
//       .then(data => setStates(data))
//       .catch(err => console.error("Error loading states lookup catalog:", err));
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const executeFormSubmission = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (step < 4) {
//       setStep(step + 1);
//       return;
//     }
    
//     setIsSubmitting(true);
//     try {
//       const response = await fetch('/api/apply', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         router.push(`/track?id=${data.applicationId}`);
//       } else {
//         alert(`Submission Failed: ${data.error}`);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Fatal client network transmission mismatch.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
//       <Header />
//       <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-10">
        
//         {/* Dynamic Multi-Step Progress Tracker HUD */}
//         <div className="flex items-center justify-between mb-8 px-4 font-mono text-xs font-semibold text-slate-400">
//           {[
//             { label: 'Personal', stepNum: 1 },
//             { label: 'Residence', stepNum: 2 },
//             { label: 'Financial', stepNum: 3 },
//             { label: 'Identity Verification', stepNum: 4 }
//           ].map((item) => (
//             <div key={item.stepNum} className="flex items-center space-x-2">
//               <span className={`w-6 h-6 flex items-center justify-center rounded-full border text-[10px] ${step >= item.stepNum ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200'}`}>
//                 {step > item.stepNum ? <Check className="w-3 h-3" /> : item.stepNum}
//               </span>
//               <span className={step === item.stepNum ? 'text-slate-900 font-bold' : ''}>{item.label}</span>
//             </div>
//           ))}
//         </div>

//         <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 md:p-8">
//           <form onSubmit={executeFormSubmission} className="space-y-6">
            
//             {/* STEP 1: PERSONAL DETAILS */}
//             {step === 1 && (
//               <div className="space-y-4">
//                 <h2 className="text-xl font-bold tracking-tight text-slate-900">Personal Information</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Legal Full Name</label>
//                     <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="John Doe" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Email Address</label>
//                     <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="john@example.com" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Phone Number</label>
//                     <input type="text" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="(512) 555-0143" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Date of Birth</label>
//                     <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 2: RESIDENTIAL JURISDICTION */}
//             {step === 2 && (
//               <div className="space-y-4">
//                 <h2 className="text-xl font-bold tracking-tight text-slate-900">Primary US Residence</h2>
//                 <p className="text-xs text-slate-500">Applicant must reside within an active state jurisdiction.</p>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Street Address</label>
//                     <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="123 Main St" />
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">City</label>
//                       <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="Austin" />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">State Code</label>
//                       <select name="state" required value={formData.state} onChange={handleInputChange} className="w-full border p-2 rounded-lg bg-white">
//                         <option value="">Select State</option>
//                         {states.map((s) => (
//                           <option key={s.state_code} value={s.state_code}>{s.state_code} - {s.state_name}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">ZIP Code</label>
//                       <input type="text" name="zip" required value={formData.zip} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="78701" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 3: FINANCIAL PARAMETERS & PURPOSE SELECT */}
//             {step === 3 && (
//               <div className="space-y-4">
//                 <h2 className="text-xl font-bold tracking-tight text-slate-900">Financial Parameters</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Annual Verifiable Income</label>
//                     <input type="number" name="income" required value={formData.income} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="75000" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Employment Vector</label>
//                     <select name="employmentStatus" value={formData.employmentStatus} onChange={handleInputChange} className="w-full border p-2 rounded-lg bg-white">
//                       <option value="Full-Time">Full-Time</option>
//                       <option value="Part-Time">Part-Time</option>
//                       <option value="Contractor">Contractor</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Employer Name</label>
//                     <input type="text" name="employerName" required value={formData.employerName} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="Stripe Tech Industries" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Primary Loan Purpose</label>
//                     <select name="loanPurpose" value={formData.loanPurpose} onChange={handleInputChange} className="w-full border p-2 rounded-lg bg-white border-emerald-500 focus:ring-1 focus:ring-emerald-500">
//                       <option value="Debt Consolidation">Debt Consolidation</option>
//                       <option value="Home Improvement">Home Improvement</option>
//                       <option value="Medical Expenses">Medical Expenses</option>
//                       <option value="Emergency Auto Repair">Emergency Auto Repair</option>
//                       <option value="Business Expansion">Business Expansion</option>
//                       <option value="Education/Tuition">Education/Tuition</option>
//                       <option value="Major Purchase">Major Purchase</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 4: MANUAL IDENTITY CAPTURE PANEL */}
//             {step === 4 && (
//               <div className="space-y-4">
//                 <h2 className="text-xl font-bold tracking-tight text-slate-900">Manual ID & SSN Verification</h2>
//                 <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-xs flex items-start space-x-3">
//                   <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="font-bold">Secure External Verification Protocol</p>
//                     <p className="mt-1 text-slate-600">
//                       Loanexa USA keeps borrower profiles isolated from online credential risk. Rather than uploading static images here, our manual credit underwriting office will review your application details and issue a customized, one-time external biometric lookup link.
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">SSN (Last 4 Digits)</label>
//                     <input type="text" name="ssnLast4" maxLength={4} required value={formData.ssnLast4} onChange={handleInputChange} className="w-full border p-2 rounded-lg font-mono tracking-widest text-center" placeholder="••••" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">DL Issuing State</label>
//                     <select name="licenseState" required value={formData.licenseState} onChange={handleInputChange} className="w-full border p-2 rounded-lg bg-white font-mono">
//                       <option value="">State</option>
//                       {states.map((s) => (
//                         <option key={s.state_code} value={s.state_code}>{s.state_code}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-mono font-semibold text-slate-500 mb-1 uppercase">Driver's License Number</label>
//                     <input type="text" name="licenseNumber" required value={formData.licenseNumber} onChange={handleInputChange} className="w-full border p-2 rounded-lg font-mono" placeholder="D12345678" />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Navigation Button Footer Row */}
//             <div className="flex justify-between items-center pt-6 border-t border-slate-100">
//               {step > 1 ? (
//                 <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
//                   Back
//                 </button>
//               ) : <div />}
              
//               <button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-500 transition-colors flex items-center space-x-2 shadow-sm disabled:opacity-50">
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     <span>Executing Registry Transaction...</span>
//                   </>
//                 ) : (
//                   <span>{step === 4 ? 'Submit Loan Application File' : 'Continue'}</span>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

























































// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Shield,
//   User,
//   MapPin,
//   Briefcase,
//   ShieldCheck,
//   FileText,
//   Check,
//   ArrowRight,
//   ArrowLeft,
//   Calendar,
// } from 'lucide-react';

// interface StateOption {
//   state_code: string;
//   state_name: string;
// }

// export default function ApplicationPage() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submittedId, setSubmittedId] = useState<string | null>(null);

//   const [usStates, setUsStates] = useState<StateOption[]>([]);
//   const [isLoadingStates, setIsLoadingStates] = useState(true);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     dob: '',
//     email: '',
//     phone: '',
//     streetAddress: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     employmentStatus: '',
//     employerName: '',
//     annualIncome: '',
//     loanPurpose: '',
//     ssnLast4: '',
//     dlState: '',
//     driverLicenseNumber: '',
//     loanAmount: '5000',
//     loanTerm: '12 Months',
//   });

//   useEffect(() => {
//     async function fetchDbStates() {
//       try {
//         const res = await fetch('/api/states');
//         if (res.ok) {
//           const data = await res.json();
//           setUsStates(data);
//         }
//       } catch (err) {
//         console.error('Error fetching states:', err);
//       } finally {
//         setIsLoadingStates(false);
//       }
//     }
//     fetchDbStates();
//   }, []);

//   const updateField = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleNext = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (currentStep < 5) {
//       setCurrentStep((prev) => prev + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const res = await fetch('/api/applications', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok && data.id) {
//         setSubmittedId(data.id);
//       } else {
//         alert(data.error || 'Failed to submit application. Please try again.');
//       }
//     } catch (err) {
//       console.error('Submission error:', err);
//       alert('An unexpected error occurred while saving your application.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const steps = [
//     { id: 1, label: 'Personal', icon: User },
//     { id: 2, label: 'Address', icon: MapPin },
//     { id: 3, label: 'Employment', icon: Briefcase },
//     { id: 4, label: 'Verification', icon: ShieldCheck },
//     { id: 5, label: 'Review', icon: FileText },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-900 font-sans text-slate-800 antialiased flex flex-col">
//       <header className="bg-slate-950 border-b border-slate-800 py-3 px-4 sm:px-8">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="bg-emerald-500 p-1.5 rounded-lg text-slate-950">
//               <Shield className="h-5 w-5 fill-current" />
//             </div>
//             <span className="text-lg font-bold text-white tracking-tight">
//               LOANEXA <span className="text-emerald-400">USA</span>
//             </span>
//           </Link>
//           <div className="flex items-center gap-6 text-xs font-semibold text-slate-300">
//             <Link href="/#calculator" className="hover:text-emerald-400 transition-colors">
//               Loan Terms Calculator
//             </Link>
//             <Link href="/#track" className="hover:text-emerald-400 transition-colors">
//               Track Status
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
//           <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between">
//             <div>
//               <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
//                 Secure Loan Application
//               </h1>
//               <p className="text-xs sm:text-sm text-slate-500 mt-1">
//                 Loanexa USA Manual Verification Portal
//               </p>
//             </div>
//             <Link
//               href="/"
//               className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3.5 py-1.5 hover:bg-slate-50 transition-colors"
//             >
//               Cancel
//             </Link>
//           </div>

//           <div className="bg-slate-50/50 border-b border-slate-100 py-6 px-4 sm:px-8">
//             <div className="flex items-center justify-between max-w-2xl mx-auto relative">
//               {steps.map((step, idx) => {
//                 const Icon = step.icon;
//                 const isCompleted = step.id < currentStep;
//                 const isActive = step.id === currentStep;

//                 return (
//                   <React.Fragment key={step.id}>
//                     <div className="flex flex-col items-center z-10 relative">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                           isCompleted
//                             ? 'bg-emerald-100 text-emerald-600'
//                             : isActive
//                             ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
//                             : 'bg-slate-100 text-slate-400 border border-slate-200'
//                         }`}
//                       >
//                         {isCompleted ? (
//                           <Check className="w-5 h-5 stroke-[3]" />
//                         ) : (
//                           <Icon className="w-5 h-5" />
//                         )}
//                       </div>
//                       <span
//                         className={`text-[11px] font-medium mt-2 transition-colors ${
//                           isActive
//                             ? 'text-emerald-700 font-bold'
//                             : isCompleted
//                             ? 'text-slate-600'
//                             : 'text-slate-400'
//                         }`}
//                       >
//                         {step.label}
//                       </span>
//                     </div>

//                     {idx < steps.length - 1 && (
//                       <div
//                         className={`flex-1 h-[2px] mx-2 -mt-5 transition-colors ${
//                           step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
//                         }`}
//                       />
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="p-6 sm:p-8">
//             {submittedId ? (
//               <div className="text-center py-8 space-y-6">
//                 <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
//                   <Check className="w-8 h-8 stroke-[3]" />
//                 </div>
//                 <div className="space-y-2">
//                   <h2 className="text-2xl font-black text-slate-900">Application Submitted!</h2>
//                   <p className="text-sm text-slate-600 max-w-md mx-auto">
//                     Your application reference token has been saved to the database. Use this token to track status updates.
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto">
//                   <span className="text-xs uppercase text-slate-400 font-mono block">Tracking Reference Token</span>
//                   <span className="text-xl font-mono font-bold text-emerald-600 tracking-wider">{submittedId}</span>
//                 </div>
//                 <div className="pt-4 flex justify-center gap-4">
//                   <Link
//                     href={`/#track`}
//                     className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
//                   >
//                     Track Application Status
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleNext}>
//                 {currentStep === 1 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Borrower Identity & Contact</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide legal identification details exactly as they appear on your government-issued ID.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Full Legal Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.fullName}
//                           onChange={(e) => updateField('fullName', e.target.value)}
//                           placeholder="e.g. John Doe"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Date of Birth
//                         </label>
//                         <div className="relative">
//                           <input
//                             type="text"
//                             required
//                             value={formData.dob}
//                             onChange={(e) => updateField('dob', e.target.value)}
//                             placeholder="MM/DD/YYYY"
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all pr-10"
//                           />
//                           <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Email Address
//                         </label>
//                         <input
//                           type="email"
//                           required
//                           value={formData.email}
//                           onChange={(e) => updateField('email', e.target.value)}
//                           placeholder="name@example.com"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Mobile Phone Number (USA)
//                         </label>
//                         <input
//                           type="tel"
//                           required
//                           value={formData.phone}
//                           onChange={(e) => updateField('phone', e.target.value)}
//                           placeholder="(555) 000-0000"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 2 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Primary US Residence</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Applicant must reside in the United States. PO boxes are not accepted.
//                       </p>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Street Address
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.streetAddress}
//                           onChange={(e) => updateField('streetAddress', e.target.value)}
//                           placeholder="1600 Pennsylvania Avenue NW"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             City
//                           </label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.city}
//                             onChange={(e) => updateField('city', e.target.value)}
//                             placeholder="Washington"
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             State
//                           </label>
//                           <select
//                             required
//                             value={formData.state}
//                             onChange={(e) => updateField('state', e.target.value)}
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                           >
//                             <option value="">
//                               {isLoadingStates ? 'Loading states...' : 'Select State'}
//                             </option>
//                             {usStates.map((st) => (
//                               <option key={st.state_code} value={st.state_code}>
//                                 {st.state_name} ({st.state_code})
//                               </option>
//                             ))}
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             ZIP Code
//                           </label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.zipCode}
//                             onChange={(e) => updateField('zipCode', e.target.value)}
//                             placeholder="20500"
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 3 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Employment & Financial Profile</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide accurate gross annual income. This information will be manually verified via offline paystubs or W2 logs.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Employment Status
//                         </label>
//                         <select
//                           required
//                           value={formData.employmentStatus}
//                           onChange={(e) => updateField('employmentStatus', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="">Select Status</option>
//                           <option value="Full-Time">Full-Time</option>
//                           <option value="Part-Time">Part-Time</option>
//                           <option value="Self-Employed">Self-Employed</option>
//                           <option value="Unemployed">Unemployed</option>
//                           <option value="Retired">Retired</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Employer Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.employerName}
//                           onChange={(e) => updateField('employerName', e.target.value)}
//                           placeholder="e.g. Google LLC"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Gross Annual Income (USD)
//                         </label>
//                         <div className="relative">
//                           <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold">$</span>
//                           <input
//                             type="text"
//                             required
//                             value={formData.annualIncome}
//                             onChange={(e) => updateField('annualIncome', e.target.value)}
//                             placeholder="50000"
//                             className="w-full pl-8 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Primary Loan Purpose
//                         </label>
//                         <select
//                           required
//                           value={formData.loanPurpose}
//                           onChange={(e) => updateField('loanPurpose', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="">Select Purpose</option>
//                           <option value="Debt Consolidation">Debt Consolidation</option>
//                           <option value="Home Improvement">Home Improvement</option>
//                           <option value="Medical Expenses">Medical Expenses</option>
//                           <option value="Emergency Auto Repair">Emergency Auto Repair</option>
//                           <option value="Business Expansion">Business Expansion</option>
//                           <option value="Education/Tuition">Education/Tuition</option>
//                           <option value="Major Purchase">Major Purchase</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 4 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Manual ID & SSN Verification</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide legal identification details. These are matched manually to establish a trusted offline profile.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           SSN (Last 4 Digits)
//                         </label>
//                         <input
//                           type="password"
//                           maxLength={4}
//                           required
//                           value={formData.ssnLast4}
//                           onChange={(e) => updateField('ssnLast4', e.target.value)}
//                           placeholder="••••"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-center font-mono tracking-widest transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           DL Issuing State
//                         </label>
//                         <select
//                           required
//                           value={formData.dlState}
//                           onChange={(e) => updateField('dlState', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="">
//                             {isLoadingStates ? 'Loading...' : 'Select State'}
//                           </option>
//                           {usStates.map((st) => (
//                             <option key={st.state_code} value={st.state_code}>
//                               {st.state_code}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Driver's License Number
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.driverLicenseNumber}
//                           onChange={(e) => updateField('driverLicenseNumber', e.target.value)}
//                           placeholder="e.g. Y738t88"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono"
//                         />
//                       </div>
//                     </div>

//                     <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 space-y-3">
//                       <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
//                         <div className="bg-emerald-500 text-white p-1 rounded-md">
//                           <ShieldCheck className="w-4 h-4" />
//                         </div>
//                         Secure External Verification Protocol
//                       </div>
//                       <p className="text-xs text-slate-600 leading-relaxed">
//                         Loanexa USA keeps borrower profiles isolated from online credential risk. Rather than uploading static images here, our manual credit underwriting office will review your application details and issue a customized, one-time external biometric lookup link.
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 5 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Final Verification Review</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Please review your requested terms and confirm all details are legally correct.
//                       </p>
//                     </div>

//                     <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                       <div>
//                         <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
//                           Loan Request
//                         </span>
//                         <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
//                           ${Number(formData.loanAmount).toLocaleString()}
//                         </div>
//                       </div>
//                       <div>
//                         <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
//                           Repayment Term
//                         </span>
//                         <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
//                           {formData.loanTerm}
//                         </div>
//                       </div>
//                       <div>
//                         <span className="inline-block bg-white border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
//                           No Hard Credit Pull
//                         </span>
//                       </div>
//                     </div>

//                     <div className="bg-slate-50 border border-slate-200/80 rounded-2xl divide-y divide-slate-200 text-xs sm:text-sm">
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Applicant Name</span>
//                         <span className="font-bold text-slate-900">{formData.fullName || '—'}</span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Mobile Phone</span>
//                         <span className="font-bold text-slate-900">{formData.phone || '—'}</span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Primary US Address</span>
//                         <span className="font-bold text-slate-900 text-right">
//                           {formData.streetAddress ? `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}` : '—'}
//                         </span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Reported Annual Income</span>
//                         <span className="font-bold text-slate-900">
//                           {formData.annualIncome ? `$${Number(formData.annualIncome).toLocaleString()}/yr` : '—'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
//                   {currentStep > 1 ? (
//                     <button
//                       type="button"
//                       onClick={handleBack}
//                       className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg transition-colors"
//                     >
//                       <ArrowLeft className="w-4 h-4" />
//                       Back
//                     </button>
//                   ) : (
//                     <div />
//                   )}

//                   {currentStep < 5 ? (
//                     <button
//                       type="submit"
//                       className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg shadow-sm transition-colors"
//                     >
//                       Continue
//                       <ArrowRight className="w-4 h-4" />
//                     </button>
//                   ) : (
//                     <button
//                       type="button"
//                       disabled={isSubmitting}
//                       onClick={handleSubmit}
//                       className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2.5 rounded-lg shadow-sm transition-colors"
//                     >
//                       {isSubmitting ? 'Saving to Database...' : 'Submit Application'}
//                       <ArrowRight className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



























// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Shield,
//   User,
//   MapPin,
//   Briefcase,
//   ShieldCheck,
//   FileText,
//   Check,
//   ArrowRight,
//   ArrowLeft,
//   Calendar,
// } from 'lucide-react';

// interface StateOption {
//   state_code: string;
//   state_name: string;
// }

// export default function ApplicationPage() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submittedId, setSubmittedId] = useState<string | null>(null);

//   const [usStates, setUsStates] = useState<StateOption[]>([]);
//   const [isLoadingStates, setIsLoadingStates] = useState(true);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     dob: '',
//     email: '',
//     phone: '',
//     streetAddress: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     employmentStatus: '',
//     employerName: '',
//     annualIncome: '',
//     loanPurpose: '',
//     ssnLast4: '',
//     dlState: '',
//     driverLicenseNumber: '',
//     loanAmount: '5000',
//     loanTerm: '12 Months',
//   });

//   useEffect(() => {
//     async function fetchDbStates() {
//       try {
//         const res = await fetch('/api/states');
//         if (res.ok) {
//           const data = await res.json();
//           setUsStates(data);
//         }
//       } catch (err) {
//         console.error('Error fetching states:', err);
//       } finally {
//         setIsLoadingStates(false);
//       }
//     }
//     fetchDbStates();
//   }, []);

//   const updateField = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleNext = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (currentStep < 5) {
//       setCurrentStep((prev) => prev + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const res = await fetch('/api/applications', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok && data.id) {
//         setSubmittedId(data.id);
//       } else {
//         alert(data.error || 'Failed to submit application. Please try again.');
//       }
//     } catch (err) {
//       console.error('Submission error:', err);
//       alert('An unexpected error occurred while saving your application.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const steps = [
//     { id: 1, label: 'Personal', icon: User },
//     { id: 2, label: 'Address', icon: MapPin },
//     { id: 3, label: 'Employment', icon: Briefcase },
//     { id: 4, label: 'Verification', icon: ShieldCheck },
//     { id: 5, label: 'Review', icon: FileText },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-900 font-sans text-slate-800 antialiased flex flex-col">
//       <header className="bg-slate-950 border-b border-slate-800 py-3 px-4 sm:px-8">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="bg-emerald-500 p-1.5 rounded-lg text-slate-950">
//               <Shield className="h-5 w-5 fill-current" />
//             </div>
//             <span className="text-lg font-bold text-white tracking-tight">
//               LOANEXA <span className="text-emerald-400">USA</span>
//             </span>
//           </Link>
//           <div className="flex items-center gap-6 text-xs font-semibold text-slate-300">
//             <Link href="/#calculator" className="hover:text-emerald-400 transition-colors">
//               Loan Terms Calculator
//             </Link>
//             <Link href="/#track" className="hover:text-emerald-400 transition-colors">
//               Track Status
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
//           <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between">
//             <div>
//               <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
//                 Secure Loan Application
//               </h1>
//               <p className="text-xs sm:text-sm text-slate-500 mt-1">
//                 Loanexa USA Manual Verification Portal
//               </p>
//             </div>
//             <Link
//               href="/"
//               className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3.5 py-1.5 hover:bg-slate-50 transition-colors"
//             >
//               Cancel
//             </Link>
//           </div>

//           <div className="bg-slate-50/50 border-b border-slate-100 py-6 px-4 sm:px-8">
//             <div className="flex items-center justify-between max-w-2xl mx-auto relative">
//               {steps.map((step, idx) => {
//                 const Icon = step.icon;
//                 const isCompleted = step.id < currentStep;
//                 const isActive = step.id === currentStep;

//                 return (
//                   <React.Fragment key={step.id}>
//                     <div className="flex flex-col items-center z-10 relative">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                           isCompleted
//                             ? 'bg-emerald-100 text-emerald-600'
//                             : isActive
//                             ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
//                             : 'bg-slate-100 text-slate-400 border border-slate-200'
//                         }`}
//                       >
//                         {isCompleted ? (
//                           <Check className="w-5 h-5 stroke-[3]" />
//                         ) : (
//                           <Icon className="w-5 h-5" />
//                         )}
//                       </div>
//                       <span
//                         className={`text-[11px] font-medium mt-2 transition-colors ${
//                           isActive
//                             ? 'text-emerald-700 font-bold'
//                             : isCompleted
//                             ? 'text-slate-600'
//                             : 'text-slate-400'
//                         }`}
//                       >
//                         {step.label}
//                       </span>
//                     </div>

//                     {idx < steps.length - 1 && (
//                       <div
//                         className={`flex-1 h-[2px] mx-2 -mt-5 transition-colors ${
//                           step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
//                         }`}
//                       />
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="p-6 sm:p-8">
//             {submittedId ? (
//               <div className="text-center py-8 space-y-6">
//                 <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
//                   <Check className="w-8 h-8 stroke-[3]" />
//                 </div>
//                 <div className="space-y-2">
//                   <h2 className="text-2xl font-black text-slate-900">Application Submitted!</h2>
//                   <p className="text-sm text-slate-600 max-w-md mx-auto">
//                     Your application reference token has been saved to the database. Use this token to track status updates.
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto">
//                   <span className="text-xs uppercase text-slate-400 font-mono block">Tracking Reference Token</span>
//                   <span className="text-xl font-mono font-bold text-emerald-600 tracking-wider">{submittedId}</span>
//                 </div>
//                 <div className="pt-4 flex justify-center gap-4">
//                   <Link
//                     href={`/#track`}
//                     className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
//                   >
//                     Track Application Status
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleNext}>
//                 {currentStep === 1 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Borrower Identity & Contact</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide legal identification details exactly as they appear on your government-issued ID.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Full Legal Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.fullName}
//                           onChange={(e) => updateField('fullName', e.target.value)}
//                           placeholder="e.g. John Doe"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Date of Birth
//                         </label>
//                         <div className="relative">
//                           <input
//                             type="text"
//                             required
//                             value={formData.dob}
//                             onChange={(e) => updateField('dob', e.target.value)}
//                             placeholder="MM/DD/YYYY"
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all pr-10"
//                           />
//                           <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Email Address
//                         </label>
//                         <input
//                           type="email"
//                           required
//                           value={formData.email}
//                           onChange={(e) => updateField('email', e.target.value)}
//                           placeholder="name@example.com"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Mobile Phone Number (USA)
//                         </label>
//                         <input
//                           type="tel"
//                           required
//                           value={formData.phone}
//                           onChange={(e) => updateField('phone', e.target.value)}
//                           placeholder="(555) 000-0000"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 2 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Primary US Residence</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Applicant must reside in the United States. PO boxes are not accepted.
//                       </p>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Street Address
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.streetAddress}
//                           onChange={(e) => updateField('streetAddress', e.target.value)}
//                           placeholder="1600 Pennsylvania Avenue NW"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             City
//                           </label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.city}
//                             onChange={(e) => updateField('city', e.target.value)}
//                             placeholder="Washington"
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             State
//                           </label>
//                           <select
//                             required
//                             value={formData.state}
//                             onChange={(e) => updateField('state', e.target.value)}
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                           >
//                             <option value="">
//                               {isLoadingStates ? 'Loading states...' : 'Select State'}
//                             </option>
//                             {usStates.map((st) => (
//                               <option key={st.state_code} value={st.state_code}>
//                                 {st.state_name} ({st.state_code})
//                               </option>
//                             ))}
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             ZIP Code
//                           </label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.zipCode}
//                             onChange={(e) => updateField('zipCode', e.target.value)}
//                             placeholder="20500"
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 3 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Employment & Financial Profile</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide accurate gross annual income. This information will be manually verified via offline paystubs or W2 logs.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Employment Status
//                         </label>
//                         <select
//                           required
//                           value={formData.employmentStatus}
//                           onChange={(e) => updateField('employmentStatus', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="">Select Status</option>
//                           <option value="Full-Time">Full-Time</option>
//                           <option value="Part-Time">Part-Time</option>
//                           <option value="Self-Employed">Self-Employed</option>
//                           <option value="Unemployed">Unemployed</option>
//                           <option value="Retired">Retired</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Employer Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.employerName}
//                           onChange={(e) => updateField('employerName', e.target.value)}
//                           placeholder="e.g. Google LLC"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Gross Annual Income (USD)
//                         </label>
//                         <div className="relative">
//                           <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold">$</span>
//                           <input
//                             type="text"
//                             required
//                             value={formData.annualIncome}
//                             onChange={(e) => updateField('annualIncome', e.target.value)}
//                             placeholder="50000"
//                             className="w-full pl-8 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Primary Loan Purpose
//                         </label>
//                         <select
//                           required
//                           value={formData.loanPurpose}
//                           onChange={(e) => updateField('loanPurpose', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="">Select Purpose</option>
//                           <option value="Debt Consolidation">Debt Consolidation</option>
//                           <option value="Home Improvement">Home Improvement</option>
//                           <option value="Medical Expenses">Medical Expenses</option>
//                           <option value="Emergency Auto Repair">Emergency Auto Repair</option>
//                           <option value="Business Expansion">Business Expansion</option>
//                           <option value="Education/Tuition">Education/Tuition</option>
//                           <option value="Major Purchase">Major Purchase</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 4 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Manual ID & SSN Verification</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide legal identification details. These are matched manually to establish a trusted offline profile.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           SSN (Last 4 Digits)
//                         </label>
//                         <input
//                           type="password"
//                           maxLength={4}
//                           required
//                           value={formData.ssnLast4}
//                           onChange={(e) => updateField('ssnLast4', e.target.value)}
//                           placeholder="••••"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-center font-mono tracking-widest transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           DL Issuing State
//                         </label>
//                         <select
//                           required
//                           value={formData.dlState}
//                           onChange={(e) => updateField('dlState', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="">
//                             {isLoadingStates ? 'Loading...' : 'Select State'}
//                           </option>
//                           {usStates.map((st) => (
//                             <option key={st.state_code} value={st.state_code}>
//                               {st.state_code}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Driver's License Number
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.driverLicenseNumber}
//                           onChange={(e) => updateField('driverLicenseNumber', e.target.value)}
//                           placeholder="e.g. Y738t88"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono"
//                         />
//                       </div>
//                     </div>

//                     <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 space-y-3">
//                       <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
//                         <div className="bg-emerald-500 text-white p-1 rounded-md">
//                           <ShieldCheck className="w-4 h-4" />
//                         </div>
//                         Secure External Verification Protocol
//                       </div>
//                       <p className="text-xs text-slate-600 leading-relaxed">
//                         Loanexa USA keeps borrower profiles isolated from online credential risk. Rather than uploading static images here, our manual credit underwriting office will review your application details and issue a customized, one-time external biometric lookup link.
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 5 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Final Verification Review</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Please review your requested terms and confirm all details are legally correct.
//                       </p>
//                     </div>

//                     <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                       <div>
//                         <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
//                           Loan Request
//                         </span>
//                         <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
//                           ${Number(formData.loanAmount).toLocaleString()}
//                         </div>
//                       </div>
//                       <div>
//                         <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
//                           Repayment Term
//                         </span>
//                         <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
//                           {formData.loanTerm}
//                         </div>
//                       </div>
//                       <div>
//                         <span className="inline-block bg-white border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
//                           No Hard Credit Pull
//                         </span>
//                       </div>
//                     </div>

//                     <div className="bg-slate-50 border border-slate-200/80 rounded-2xl divide-y divide-slate-200 text-xs sm:text-sm">
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Applicant Name</span>
//                         <span className="font-bold text-slate-900">{formData.fullName || '—'}</span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Mobile Phone</span>
//                         <span className="font-bold text-slate-900">{formData.phone || '—'}</span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Primary US Address</span>
//                         <span className="font-bold text-slate-900 text-right">
//                           {formData.streetAddress ? `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}` : '—'}
//                         </span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Reported Annual Income</span>
//                         <span className="font-bold text-slate-900">
//                           {formData.annualIncome ? `$${Number(formData.annualIncome).toLocaleString()}/yr` : '—'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
//                   {currentStep > 1 ? (
//                     <button
//                       type="button"
//                       onClick={handleBack}
//                       className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg transition-colors"
//                     >
//                       <ArrowLeft className="w-4 h-4" />
//                       Back
//                     </button>
//                   ) : (
//                     <div />
//                   )}

//                   {currentStep < 5 ? (
//                     <button
//                       type="submit"
//                       className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg shadow-sm transition-colors"
//                     >
//                       Continue
//                       <ArrowRight className="w-4 h-4" />
//                     </button>
//                   ) : (
//                     <button
//                       type="button"
//                       onClick={handleSubmit}
//                       disabled={isSubmitting}
//                       className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg shadow-sm transition-colors"
//                     >
//                       {isSubmitting ? 'Submitting...' : 'Submit Application'}
//                       {!isSubmitting && <Check className="w-4 h-4" />}
//                     </button>
//                   )}
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }































// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Shield,
//   User,
//   MapPin,
//   Briefcase,
//   ShieldCheck,
//   FileText,
//   Check,
//   ArrowRight,
//   ArrowLeft,
//   Calendar,
// } from 'lucide-react';

// interface StateOption {
//   state_code: string;
//   state_name: string;
// }

// export default function ApplicationPage() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submittedId, setSubmittedId] = useState<string | null>(null);

//   const [usStates, setUsStates] = useState<StateOption[]>([]);
//   const [isLoadingStates, setIsLoadingStates] = useState(true);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     dob: '',
//     email: '',
//     phone: '',
//     streetAddress: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     employmentStatus: '',
//     employerName: '',
//     annualIncome: '',
//     loanPurpose: '',
//     ssnLast4: '',
//     dlState: '',
//     driverLicenseNumber: '',
//     loanAmount: '5000',
//     loanTerm: '12 Months',
//   });

//   useEffect(() => {
//     async function fetchDbStates() {
//       try {
//         const res = await fetch('/api/states');
//         if (res.ok) {
//           const data = await res.json();
//           // Ensure we handle array payloads cleanly
//           if (Array.isArray(data)) {
//             setUsStates(data);
//           } else if (data.rows && Array.isArray(data.rows)) {
//             setUsStates(data.rows);
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching states:', err);
//       } finally {
//         setIsLoadingStates(false);
//       }
//     }
//     fetchDbStates();
//   }, []);

//   const updateField = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleNext = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (currentStep < 5) {
//       setCurrentStep((prev) => prev + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       // Clean and sanitize payload types before sending to avoid DB constraint failures
//       const payload = {
//         ...formData,
//         annualIncome: formData.annualIncome ? Number(formData.annualIncome) : 0,
//         loanAmount: formData.loanAmount ? Number(formData.loanAmount) : 5000,
//       };

//       const res = await fetch('/api/applications', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok && (data.id || data.success)) {
//         setSubmittedId(data.id || data.applicationId || 'REF-' + Math.floor(100000 + Math.random() * 900000));
//       } else {
//         alert(data.error || 'Failed to record application in database');
//       }
//     } catch (err) {
//       console.error('Submission error:', err);
//       alert('Failed to record application in database');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const steps = [
//     { id: 1, label: 'Personal', icon: User },
//     { id: 2, label: 'Address', icon: MapPin },
//     { id: 3, label: 'Employment', icon: Briefcase },
//     { id: 4, label: 'Verification', icon: ShieldCheck },
//     { id: 5, label: 'Review', icon: FileText },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-900 font-sans text-slate-800 antialiased flex flex-col">
//       <header className="bg-slate-950 border-b border-slate-800 py-3 px-4 sm:px-8">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="bg-emerald-500 p-1.5 rounded-lg text-slate-950">
//               <Shield className="h-5 w-5 fill-current" />
//             </div>
//             <span className="text-lg font-bold text-white tracking-tight">
//               LOANEXA <span className="text-emerald-400">USA</span>
//             </span>
//           </Link>
//           <div className="flex items-center gap-6 text-xs font-semibold text-slate-300">
//             <Link href="/#calculator" className="hover:text-emerald-400 transition-colors">
//               Loan Terms Calculator
//             </Link>
//             <Link href="/#track" className="hover:text-emerald-400 transition-colors">
//               Track Status
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
//           <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between">
//             <div>
//               <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
//                 Secure Loan Application
//               </h1>
//               <p className="text-xs sm:text-sm text-slate-500 mt-1">
//                 Loanexa USA Manual Verification Portal
//               </p>
//             </div>
//             <Link
//               href="/"
//               className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3.5 py-1.5 hover:bg-slate-50 transition-colors"
//             >
//               Cancel
//             </Link>
//           </div>

//           <div className="bg-slate-50/50 border-b border-slate-100 py-6 px-4 sm:px-8">
//             <div className="flex items-center justify-between max-w-2xl mx-auto relative">
//               {steps.map((step, idx) => {
//                 const Icon = step.icon;
//                 const isCompleted = step.id < currentStep;
//                 const isActive = step.id === currentStep;

//                 return (
//                   <React.Fragment key={step.id}>
//                     <div className="flex flex-col items-center z-10 relative">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                           isCompleted
//                             ? 'bg-emerald-100 text-emerald-600'
//                             : isActive
//                             ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
//                             : 'bg-slate-100 text-slate-400 border border-slate-200'
//                         }`}
//                       >
//                         {isCompleted ? (
//                           <Check className="w-5 h-5 stroke-[3]" />
//                         ) : (
//                           <Icon className="w-5 h-5" />
//                         )}
//                       </div>
//                       <span
//                         className={`text-[11px] font-medium mt-2 transition-colors ${
//                           isActive
//                             ? 'text-emerald-700 font-bold'
//                             : isCompleted
//                             ? 'text-slate-600'
//                             : 'text-slate-400'
//                         }`}
//                       >
//                         {step.label}
//                       </span>
//                     </div>

//                     {idx < steps.length - 1 && (
//                       <div
//                         className={`flex-1 h-[2px] mx-2 -mt-5 transition-colors ${
//                           step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
//                         }`}
//                       />
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="p-6 sm:p-8">
//             {submittedId ? (
//               <div className="text-center py-8 space-y-6">
//                 <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
//                   <Check className="w-8 h-8 stroke-[3]" />
//                 </div>
//                 <div className="space-y-2">
//                   <h2 className="text-2xl font-black text-slate-900">Application Submitted!</h2>
//                   <p className="text-sm text-slate-600 max-w-md mx-auto">
//                     Your application reference token has been saved to the database. Use this token to track status updates.
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto">
//                   <span className="text-xs uppercase text-slate-400 font-mono block">Tracking Reference Token</span>
//                   <span className="text-xl font-mono font-bold text-emerald-600 tracking-wider">{submittedId}</span>
//                 </div>
//                 <div className="pt-4 flex justify-center gap-4">
//                   <Link
//                     href={`/#track`}
//                     className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
//                   >
//                     Track Application Status
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={currentStep < 5 ? handleNext : (e) => { e.preventDefault(); handleSubmit(); }}>
//                 {currentStep === 1 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Borrower Identity & Contact</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide legal identification details exactly as they appear on your government-issued ID.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Full Legal Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.fullName}
//                           onChange={(e) => updateField('fullName', e.target.value)}
//                           placeholder="e.g. John Doe"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Date of Birth
//                         </label>
//                         <div className="relative">
//                           {/* Updated to native date input for calendar popup selection */}
//                           <input
//                             type="date"
//                             required
//                             value={formData.dob}
//                             onChange={(e) => updateField('dob', e.target.value)}
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Email Address
//                         </label>
//                         <input
//                           type="email"
//                           required
//                           value={formData.email}
//                           onChange={(e) => updateField('email', e.target.value)}
//                           placeholder="name@example.com"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Mobile Phone Number (USA)
//                         </label>
//                         <input
//                           type="tel"
//                           required
//                           value={formData.phone}
//                           onChange={(e) => updateField('phone', e.target.value)}
//                           placeholder="(555) 000-0000"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 2 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Primary US Residence</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Applicant must reside in the United States. PO boxes are not accepted.
//                       </p>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Street Address
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.streetAddress}
//                           onChange={(e) => updateField('streetAddress', e.target.value)}
//                           placeholder="1600 Pennsylvania Avenue NW"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             City
//                           </label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.city}
//                             onChange={(e) => updateField('city', e.target.value)}
//                             placeholder="Washington"
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             State
//                           </label>
//                           <select
//                             required
//                             value={formData.state}
//                             onChange={(e) => updateField('state', e.target.value)}
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                           >
//                             <option value="">
//                               {isLoadingStates ? 'Loading states...' : 'Select State'}
//                             </option>
//                             {usStates.map((st) => (
//                               <option key={st.state_code} value={st.state_code}>
//                                 {st.state_name} ({st.state_code})
//                               </option>
//                             ))}
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             ZIP Code
//                           </label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.zipCode}
//                             onChange={(e) => updateField('zipCode', e.target.value)}
//                             placeholder="20500"
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 3 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Employment & Financial Profile</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide accurate gross annual income. This information will be manually verified via offline paystubs or W2 logs.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Employment Status
//                         </label>
//                         <select
//                           required
//                           value={formData.employmentStatus}
//                           onChange={(e) => updateField('employmentStatus', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="">Select Status</option>
//                           <option value="Full-Time">Full-Time</option>
//                           <option value="Part-Time">Part-Time</option>
//                           <option value="Self-Employed">Self-Employed</option>
//                           <option value="Unemployed">Unemployed</option>
//                           <option value="Retired">Retired</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Employer Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.employerName}
//                           onChange={(e) => updateField('employerName', e.target.value)}
//                           placeholder="e.g. Google LLC"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Gross Annual Income (USD)
//                         </label>
//                         <div className="relative">
//                           <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold">$</span>
//                           <input
//                             type="text"
//                             required
//                             value={formData.annualIncome}
//                             onChange={(e) => updateField('annualIncome', e.target.value)}
//                             placeholder="50000"
//                             className="w-full pl-8 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Primary Loan Purpose
//                         </label>
//                         <select
//                           required
//                           value={formData.loanPurpose}
//                           onChange={(e) => updateField('loanPurpose', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="">Select Purpose</option>
//                           <option value="Debt Consolidation">Debt Consolidation</option>
//                           <option value="Home Improvement">Home Improvement</option>
//                           <option value="Medical Expenses">Medical Expenses</option>
//                           <option value="Emergency Auto Repair">Emergency Auto Repair</option>
//                           <option value="Business Expansion">Business Expansion</option>
//                           <option value="Education/Tuition">Education/Tuition</option>
//                           <option value="Major Purchase">Major Purchase</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 4 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Manual ID & SSN Verification</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide legal identification details. These are matched manually to establish a trusted offline profile.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           SSN (Last 4 Digits)
//                         </label>
//                         <input
//                           type="password"
//                           maxLength={4}
//                           required
//                           value={formData.ssnLast4}
//                           onChange={(e) => updateField('ssnLast4', e.target.value)}
//                           placeholder="••••"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-center font-mono tracking-widest transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           DL Issuing State
//                         </label>
//                         <select
//                           required
//                           value={formData.dlState}
//                           onChange={(e) => updateField('dlState', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="">
//                             {isLoadingStates ? 'Loading...' : 'Select State'}
//                           </option>
//                           {usStates.map((st) => (
//                             <option key={st.state_code} value={st.state_code}>
//                               {st.state_code}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Driver's License Number
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.driverLicenseNumber}
//                           onChange={(e) => updateField('driverLicenseNumber', e.target.value)}
//                           placeholder="e.g. Y738t88"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono"
//                         />
//                       </div>
//                     </div>

//                     <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 space-y-3">
//                       <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
//                         <div className="bg-emerald-500 text-white p-1 rounded-md">
//                           <ShieldCheck className="w-4 h-4" />
//                         </div>
//                         Secure External Verification Protocol
//                       </div>
//                       <p className="text-xs text-slate-600 leading-relaxed">
//                         Loanexa USA keeps borrower profiles isolated from online credential risk. Rather than uploading static images here, our manual credit underwriting office will review your application details and issue a customized, one-time external biometric lookup link.
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 5 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Final Verification Review</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Please review your requested terms and confirm all details are legally correct.
//                       </p>
//                     </div>

//                     <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                       <div>
//                         <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
//                           Loan Request
//                         </span>
//                         <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
//                           ${Number(formData.loanAmount).toLocaleString()}
//                         </div>
//                       </div>
//                       <div>
//                         <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
//                           Repayment Term
//                         </span>
//                         <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
//                           {formData.loanTerm}
//                         </div>
//                       </div>
//                       <div>
//                         <span className="inline-block bg-white border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
//                           No Hard Credit Pull
//                         </span>
//                       </div>
//                     </div>

//                     <div className="bg-slate-50 border border-slate-200/80 rounded-2xl divide-y divide-slate-200 text-xs sm:text-sm">
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Applicant Name</span>
//                         <span className="font-bold text-slate-900">{formData.fullName || '—'}</span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Mobile Phone</span>
//                         <span className="font-bold text-slate-900">{formData.phone || '—'}</span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Primary US Address</span>
//                         <span className="font-bold text-slate-900 text-right">
//                           {formData.streetAddress ? `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}` : '—'}
//                         </span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Reported Annual Income</span>
//                         <span className="font-bold text-slate-900">
//                           {formData.annualIncome ? `$${Number(formData.annualIncome).toLocaleString()}/yr` : '—'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
//                   {currentStep > 1 ? (
//                     <button
//                       type="button"
//                       onClick={handleBack}
//                       className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg transition-colors"
//                     >
//                       <ArrowLeft className="w-4 h-4" />
//                       Back
//                     </button>
//                   ) : (
//                     <div />
//                   )}

//                   {currentStep < 5 ? (
//                     <button
//                       type="submit"
//                       className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg shadow-sm transition-colors"
//                     >
//                       Continue
//                       <ArrowRight className="w-4 h-4" />
//                     </button>
//                   ) : (
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isSubmitting ? 'Submitting...' : 'Submit Application'}
//                       {!isSubmitting && <Check className="w-4 h-4" />}
//                     </button>
//                   )}
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }







































// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Shield,
//   User,
//   MapPin,
//   Briefcase,
//   ShieldCheck,
//   FileText,
//   Check,
//   ArrowRight,
//   ArrowLeft,
// } from 'lucide-react';

// interface StateOption {
//   state_code: string;
//   state_name: string;
// }

// export default function ApplicationPage() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submittedId, setSubmittedId] = useState<string | null>(null);

//   const [usStates, setUsStates] = useState<StateOption[]>([]);
//   const [isLoadingStates, setIsLoadingStates] = useState(true);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     dob: '',
//     email: '',
//     phone: '',
//     streetAddress: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     employmentStatus: 'Full-Time',
//     employerName: '',
//     annualIncome: '',
//     loanPurpose: 'Debt Consolidation',
//     ssnLast4: '',
//     dlState: '',
//     driverLicenseNumber: '',
//     loanAmount: '5000',
//     loanTerm: '12',
//   });

//   useEffect(() => {
//     async function fetchDbStates() {
//       try {
//         const res = await fetch('/api/states');
//         if (res.ok) {
//           const data = await res.json();
//           if (Array.isArray(data)) {
//             setUsStates(data);
//           } else if (data.rows && Array.isArray(data.rows)) {
//             setUsStates(data.rows);
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching states lookup catalog:', err);
//       } finally {
//         setIsLoadingStates(false);
//       }
//     }
//     fetchDbStates();
//   }, []);

//   const updateField = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleNext = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (currentStep < 5) {
//       setCurrentStep((prev) => prev + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const payload = {
//         ...formData,
//         annualIncome: formData.annualIncome ? Number(formData.annualIncome) : null,
//         loanAmount: formData.loanAmount ? Number(formData.loanAmount) : 5000,
//         loanTerm: formData.loanTerm ? parseInt(formData.loanTerm) : 12,
//       };

//       // FIXED: Pointing correctly to your /api/apply route handler
//       const res = await fetch('/api/apply', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok && (data.id || data.success)) {
//         setSubmittedId(data.id || 'LN-2026-' + Math.floor(1000 + Math.random() * 9000));
//       } else {
//         alert(data.error || 'Failed to record application in database');
//       }
//     } catch (err) {
//       console.error('Submission error:', err);
//       alert('Fatal client network transmission mismatch.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const steps = [
//     { id: 1, label: 'Personal', icon: User },
//     { id: 2, label: 'Address', icon: MapPin },
//     { id: 3, label: 'Employment', icon: Briefcase },
//     { id: 4, label: 'Verification', icon: ShieldCheck },
//     { id: 5, label: 'Review', icon: FileText },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-900 font-sans text-slate-800 antialiased flex flex-col">
//       <header className="bg-slate-950 border-b border-slate-800 py-3 px-4 sm:px-8">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="bg-emerald-500 p-1.5 rounded-lg text-slate-950">
//               <Shield className="h-5 w-5 fill-current" />
//             </div>
//             <span className="text-lg font-bold text-white tracking-tight">
//               LOANEXA <span className="text-emerald-400">USA</span>
//             </span>
//           </Link>
//           <div className="flex items-center gap-6 text-xs font-semibold text-slate-300">
//             <Link href="/#calculator" className="hover:text-emerald-400 transition-colors">
//               Loan Terms Calculator
//             </Link>
//             <Link href="/#track" className="hover:text-emerald-400 transition-colors">
//               Track Status
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
//           <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between">
//             <div>
//               <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
//                 Secure Loan Application
//               </h1>
//               <p className="text-xs sm:text-sm text-slate-500 mt-1">
//                 Loanexa USA Manual Verification Portal
//               </p>
//             </div>
//             <Link
//               href="/"
//               className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3.5 py-1.5 hover:bg-slate-50 transition-colors"
//             >
//               Cancel
//             </Link>
//           </div>

//           <div className="bg-slate-50/50 border-b border-slate-100 py-6 px-4 sm:px-8">
//             <div className="flex items-center justify-between max-w-2xl mx-auto relative">
//               {steps.map((step, idx) => {
//                 const Icon = step.icon;
//                 const isCompleted = step.id < currentStep;
//                 const isActive = step.id === currentStep;

//                 return (
//                   <React.Fragment key={step.id}>
//                     <div className="flex flex-col items-center z-10 relative">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                           isCompleted
//                             ? 'bg-emerald-100 text-emerald-600'
//                             : isActive
//                             ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
//                             : 'bg-slate-100 text-slate-400 border border-slate-200'
//                         }`}
//                       >
//                         {isCompleted ? (
//                           <Check className="w-5 h-5 stroke-[3]" />
//                         ) : (
//                           <Icon className="w-5 h-5" />
//                         )}
//                       </div>
//                       <span
//                         className={`text-[11px] font-medium mt-2 transition-colors ${
//                           isActive
//                             ? 'text-emerald-700 font-bold'
//                             : isCompleted
//                             ? 'text-slate-600'
//                             : 'text-slate-400'
//                         }`}
//                       >
//                         {step.label}
//                       </span>
//                     </div>

//                     {idx < steps.length - 1 && (
//                       <div
//                         className={`flex-1 h-[2px] mx-2 -mt-5 transition-colors ${
//                           step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
//                         }`}
//                       />
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="p-6 sm:p-8">
//             {submittedId ? (
//               <div className="text-center py-8 space-y-6">
//                 <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
//                   <Check className="w-8 h-8 stroke-[3]" />
//                 </div>
//                 <div className="space-y-2">
//                   <h2 className="text-2xl font-black text-slate-900">Application Submitted!</h2>
//                   <p className="text-sm text-slate-600 max-w-md mx-auto">
//                     Your application reference token has been saved to the database. Use this token to track status updates.
//                   </p>
//                 </div>
//                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto">
//                   <span className="text-xs uppercase text-slate-400 font-mono block">Tracking Reference Token</span>
//                   <span className="text-xl font-mono font-bold text-emerald-600 tracking-wider">{submittedId}</span>
//                 </div>
//                 <div className="pt-4 flex justify-center gap-4">
//                   <Link
//                     href={`/track?id=${submittedId}`}
//                     className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
//                   >
//                     Track Application Status
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={currentStep < 5 ? handleNext : (e) => { e.preventDefault(); handleSubmit(); }}>
//                 {currentStep === 1 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Borrower Identity & Contact</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide legal identification details exactly as they appear on your government-issued ID.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Full Legal Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.fullName}
//                           onChange={(e) => updateField('fullName', e.target.value)}
//                           placeholder="e.g. John Doe"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Date of Birth
//                         </label>
//                         <input
//                           type="date"
//                           required
//                           value={formData.dob}
//                           onChange={(e) => updateField('dob', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Email Address
//                         </label>
//                         <input
//                           type="email"
//                           required
//                           value={formData.email}
//                           onChange={(e) => updateField('email', e.target.value)}
//                           placeholder="name@example.com"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Mobile Phone Number (USA)
//                         </label>
//                         <input
//                           type="tel"
//                           required
//                           value={formData.phone}
//                           onChange={(e) => updateField('phone', e.target.value)}
//                           placeholder="(555) 000-0000"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 2 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Primary US Residence</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Applicant must reside in the United States. PO boxes are not accepted.
//                       </p>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Street Address
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.streetAddress}
//                           onChange={(e) => updateField('streetAddress', e.target.value)}
//                           placeholder="123 Main St"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             City
//                           </label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.city}
//                             onChange={(e) => updateField('city', e.target.value)}
//                             placeholder="Austin"
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             State
//                           </label>
//                           <select
//                             required
//                             value={formData.state}
//                             onChange={(e) => updateField('state', e.target.value)}
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                           >
//                             <option value="">
//                               {isLoadingStates ? 'Loading states...' : 'Select State'}
//                             </option>
//                             {usStates.map((st) => (
//                               <option key={st.state_code} value={st.state_code}>
//                                 {st.state_name} ({st.state_code})
//                               </option>
//                             ))}
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                             ZIP Code
//                           </label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.zipCode}
//                             onChange={(e) => updateField('zipCode', e.target.value)}
//                             placeholder="78701"
//                             className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 3 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Employment & Financial Profile</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide accurate gross annual income. This information will be manually verified via offline paystubs or W2 logs.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Employment Status
//                         </label>
//                         <select
//                           required
//                           value={formData.employmentStatus}
//                           onChange={(e) => updateField('employmentStatus', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="Full-Time">Full-Time</option>
//                           <option value="Part-Time">Part-Time</option>
//                           <option value="Contractor">Contractor</option>
//                           <option value="Self-Employed">Self-Employed</option>
//                           <option value="Unemployed">Unemployed</option>
//                           <option value="Retired">Retired</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Employer Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.employerName}
//                           onChange={(e) => updateField('employerName', e.target.value)}
//                           placeholder="e.g. Stripe Tech Industries"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Gross Annual Income (USD)
//                         </label>
//                         <div className="relative">
//                           <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold">$</span>
//                           <input
//                             type="number"
//                             required
//                             value={formData.annualIncome}
//                             onChange={(e) => updateField('annualIncome', e.target.value)}
//                             placeholder="75000"
//                             className="w-full pl-8 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Primary Loan Purpose
//                         </label>
//                         <select
//                           required
//                           value={formData.loanPurpose}
//                           onChange={(e) => updateField('loanPurpose', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="Debt Consolidation">Debt Consolidation</option>
//                           <option value="Home Improvement">Home Improvement</option>
//                           <option value="Medical Expenses">Medical Expenses</option>
//                           <option value="Emergency Auto Repair">Emergency Auto Repair</option>
//                           <option value="Business Expansion">Business Expansion</option>
//                           <option value="Education/Tuition">Education/Tuition</option>
//                           <option value="Major Purchase">Major Purchase</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 4 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Manual ID & SSN Verification</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Provide legal identification details. These are matched manually to establish a trusted offline profile.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           SSN (Last 4 Digits)
//                         </label>
//                         <input
//                           type="password"
//                           maxLength={4}
//                           required
//                           value={formData.ssnLast4}
//                           onChange={(e) => updateField('ssnLast4', e.target.value)}
//                           placeholder="••••"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-center font-mono tracking-widest transition-all"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           DL Issuing State
//                         </label>
//                         <select
//                           required
//                           value={formData.dlState}
//                           onChange={(e) => updateField('dlState', e.target.value)}
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
//                         >
//                           <option value="">
//                             {isLoadingStates ? 'Loading...' : 'Select State'}
//                           </option>
//                           {usStates.map((st) => (
//                             <option key={st.state_code} value={st.state_code}>
//                               {st.state_code}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-bold text-slate-700 mb-1.5">
//                           Driver's License Number
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={formData.driverLicenseNumber}
//                           onChange={(e) => updateField('driverLicenseNumber', e.target.value)}
//                           placeholder="D12345678"
//                           className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono"
//                         />
//                       </div>
//                     </div>

//                     <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 space-y-3">
//                       <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
//                         <div className="bg-emerald-500 text-white p-1 rounded-md">
//                           <ShieldCheck className="w-4 h-4" />
//                         </div>
//                         Secure External Verification Protocol
//                       </div>
//                       <p className="text-xs text-slate-600 leading-relaxed">
//                         Loanexa USA keeps borrower profiles isolated from online credential risk. Rather than uploading static images here, our manual credit underwriting office will review your application details and issue a customized, one-time external biometric lookup link.
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {currentStep === 5 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h2 className="text-lg font-bold text-slate-900">Final Verification Review</h2>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Please review your requested terms and confirm all details are legally correct.
//                       </p>
//                     </div>

//                     <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                       <div>
//                         <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
//                           Loan Request
//                         </span>
//                         <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
//                           ${Number(formData.loanAmount).toLocaleString()}
//                         </div>
//                       </div>
//                       <div>
//                         <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
//                           Repayment Term
//                         </span>
//                         <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
//                           {formData.loanTerm} Months
//                         </div>
//                       </div>
//                       <div>
//                         <span className="inline-block bg-white border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
//                           No Hard Credit Pull
//                         </span>
//                       </div>
//                     </div>

//                     <div className="bg-slate-50 border border-slate-200/80 rounded-2xl divide-y divide-slate-200 text-xs sm:text-sm">
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Applicant Name</span>
//                         <span className="font-bold text-slate-900">{formData.fullName || '—'}</span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Mobile Phone</span>
//                         <span className="font-bold text-slate-900">{formData.phone || '—'}</span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Primary US Address</span>
//                         <span className="font-bold text-slate-900 text-right">
//                           {formData.streetAddress ? `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}` : '—'}
//                         </span>
//                       </div>
//                       <div className="p-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-medium">Reported Annual Income</span>
//                         <span className="font-bold text-slate-900">
//                           {formData.annualIncome ? `$${Number(formData.annualIncome).toLocaleString()}/yr` : '—'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
//                   {currentStep > 1 ? (
//                     <button
//                       type="button"
//                       onClick={handleBack}
//                       className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg transition-colors"
//                     >
//                       <ArrowLeft className="w-4 h-4" />
//                       Back
//                     </button>
//                   ) : (
//                     <div />
//                   )}

//                   {currentStep < 5 ? (
//                     <button
//                       type="submit"
//                       className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg shadow-sm transition-colors"
//                     >
//                       Continue
//                       <ArrowRight className="w-4 h-4" />
//                     </button>
//                   ) : (
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
//                       {!isSubmitting && <Check className="w-4 h-4" />}
//                     </button>
//                   )}
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }








'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  User,
  MapPin,
  Briefcase,
  ShieldCheck,
  FileText,
  Check,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface StateOption {
  state_code: string;
  state_name: string;
}

export default function ApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [usStates, setUsStates] = useState<StateOption[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    employmentStatus: 'Full-Time',
    employerName: '',
    annualIncome: '',
    loanPurpose: 'Debt Consolidation',
    ssnLast4: '',
    dlState: '',
    driverLicenseNumber: '',
    loanAmount: '5000',
    loanTerm: '12',
  });

  useEffect(() => {
    async function fetchDbStates() {
      try {
        const res = await fetch('/api/states');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setUsStates(data);
          } else if (data.rows && Array.isArray(data.rows)) {
            setUsStates(data.rows);
          }
        }
      } catch (err) {
        console.error('Error fetching states lookup catalog:', err);
      } finally {
        setIsLoadingStates(false);
      }
    }
    fetchDbStates();
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Rigorously sanitize payload: convert empty strings to null and format numbers/dates
      const payload = {
        fullName: formData.fullName.trim() || null,
        dob: formData.dob && formData.dob.trim() !== '' ? formData.dob : null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        streetAddress: formData.streetAddress.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state || null,
        zipCode: formData.zipCode.trim() || null,
        employmentStatus: formData.employmentStatus || null,
        employerName: formData.employerName.trim() || null,
        annualIncome: formData.annualIncome && !isNaN(Number(formData.annualIncome)) 
          ? Number(formData.annualIncome) 
          : null,
        loanPurpose: formData.loanPurpose || null,
        ssnLast4: formData.ssnLast4 ? formData.ssnLast4.trim() : null,
        dlState: formData.dlState || null,
        driverLicenseNumber: formData.driverLicenseNumber.trim() || null,
        loanAmount: formData.loanAmount ? Number(formData.loanAmount) : 5000,
        loanTerm: formData.loanTerm ? parseInt(formData.loanTerm, 10) : 12,
      };

      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && (data.id || data.success || data.applicationId)) {
        setSubmittedId(data.id || data.applicationId || 'LN-2026-' + Math.floor(1000 + Math.random() * 9000));
      } else {
        console.error('API Error Response:', data);
        alert(data.error || 'Database insertion failed. Check server logs.');
      }
    } catch (err) {
      console.error('Submission network error:', err);
      alert('Fatal client network transmission mismatch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: 'Personal', icon: User },
    { id: 2, label: 'Address', icon: MapPin },
    { id: 3, label: 'Employment', icon: Briefcase },
    { id: 4, label: 'Verification', icon: ShieldCheck },
    { id: 5, label: 'Review', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-800 antialiased flex flex-col">
      <header className="bg-slate-950 border-b border-slate-800 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg text-slate-950">
              <Shield className="h-5 w-5 fill-current" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              LOANEXA <span className="text-emerald-400">USA</span>
            </span>
          </Link>
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-300">
            <Link href="/#calculator" className="hover:text-emerald-400 transition-colors">
              Loan Terms Calculator
            </Link>
            <Link href="/#track" className="hover:text-emerald-400 transition-colors">
              Track Status
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Secure Loan Application
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Loanexa USA Manual Verification Portal
              </p>
            </div>
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3.5 py-1.5 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>

          <div className="bg-slate-50/50 border-b border-slate-100 py-6 px-4 sm:px-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;

                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center z-10 relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-600'
                            : isActive
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5 stroke-[3]" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-medium mt-2 transition-colors ${
                          isActive
                            ? 'text-emerald-700 font-bold'
                            : isCompleted
                            ? 'text-slate-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-[2px] mx-2 -mt-5 transition-colors ${
                          step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {submittedId ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900">Application Submitted!</h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your application reference token has been saved to the database. Use this token to track status updates.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto">
                  <span className="text-xs uppercase text-slate-400 font-mono block">Tracking Reference Token</span>
                  <span className="text-xl font-mono font-bold text-emerald-600 tracking-wider">{submittedId}</span>
                </div>
                <div className="pt-4 flex justify-center gap-4">
                  <Link
                    href={`/track?id=${submittedId}`}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
                  >
                    Track Application Status
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={currentStep < 5 ? handleNext : (e) => { e.preventDefault(); handleSubmit(); }}>
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Borrower Identity & Contact</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Provide legal identification details exactly as they appear on your government-issued ID.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Full Legal Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.dob}
                          onChange={(e) => updateField('dob', e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Mobile Phone Number (USA)
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder="(555) 000-0000"
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Primary US Residence</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Applicant must reside in the United States. PO boxes are not accepted.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Street Address
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.streetAddress}
                          onChange={(e) => updateField('streetAddress', e.target.value)}
                          placeholder="1600 Pennsylvania Avenue NW"
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) => updateField('city', e.target.value)}
                            placeholder="Washington"
                            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            State
                          </label>
                          <select
                            required
                            value={formData.state}
                            onChange={(e) => updateField('state', e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
                          >
                            <option value="">
                              {isLoadingStates ? 'Loading states...' : 'Select State'}
                            </option>
                            {usStates.map((st) => (
                              <option key={st.state_code} value={st.state_code}>
                                {st.state_name} ({st.state_code})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.zipCode}
                            onChange={(e) => updateField('zipCode', e.target.value)}
                            placeholder="20500"
                            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Employment & Financial Profile</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Provide accurate gross annual income. This information will be manually verified via offline paystubs or W2 logs.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Employment Status
                        </label>
                        <select
                          required
                          value={formData.employmentStatus}
                          onChange={(e) => updateField('employmentStatus', e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
                        >
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Contractor">Contractor</option>
                          <option value="Self-Employed">Self-Employed</option>
                          <option value="Unemployed">Unemployed</option>
                          <option value="Retired">Retired</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Employer Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.employerName}
                          onChange={(e) => updateField('employerName', e.target.value)}
                          placeholder="e.g. Google LLC"
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Gross Annual Income (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold">$</span>
                          <input
                            type="text"
                            required
                            value={formData.annualIncome}
                            onChange={(e) => updateField('annualIncome', e.target.value)}
                            placeholder="50000"
                            className="w-full pl-8 pr-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Primary Loan Purpose
                        </label>
                        <select
                          required
                          value={formData.loanPurpose}
                          onChange={(e) => updateField('loanPurpose', e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
                        >
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

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Manual ID & SSN Verification</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Provide legal identification details. These are matched manually to establish a trusted offline profile.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          SSN (Last 4 Digits)
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={formData.ssnLast4}
                          onChange={(e) => updateField('ssnLast4', e.target.value)}
                          placeholder="••••"
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-center font-mono tracking-widest transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          DL Issuing State
                        </label>
                        <select
                          required
                          value={formData.dlState}
                          onChange={(e) => updateField('dlState', e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all font-mono"
                        >
                          <option value="">
                            {isLoadingStates ? 'Loading...' : 'Select State'}
                          </option>
                          {usStates.map((st) => (
                            <option key={st.state_code} value={st.state_code}>
                              {st.state_code}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Driver's License Number
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.driverLicenseNumber}
                          onChange={(e) => updateField('driverLicenseNumber', e.target.value)}
                          placeholder="e.g. D12345678"
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
                        <div className="bg-emerald-500 text-white p-1 rounded-md">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        Secure External Verification Protocol
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Loanexa USA keeps borrower profiles isolated from online credential risk. Rather than uploading static images here, our manual credit underwriting office will review your application details and issue a customized, one-time external biometric lookup link.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Final Verification Review</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Please review your requested terms and confirm all details are legally correct.
                      </p>
                    </div>

                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
                          Loan Request
                        </span>
                        <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
                          ${Number(formData.loanAmount).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
                          Repayment Term
                        </span>
                        <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                          {formData.loanTerm} Months
                        </div>
                      </div>
                      <div>
                        <span className="inline-block bg-white border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                          No Hard Credit Pull
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl divide-y divide-slate-200 text-xs sm:text-sm">
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Applicant Name</span>
                        <span className="font-bold text-slate-900">{formData.fullName || '—'}</span>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Mobile Phone</span>
                        <span className="font-bold text-slate-900">{formData.phone || '—'}</span>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Primary US Address</span>
                        <span className="font-bold text-slate-900 text-right">
                          {formData.streetAddress ? `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}` : '—'}
                        </span>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Reported Annual Income</span>
                        <span className="font-bold text-slate-900">
                          {formData.annualIncome ? `$${Number(formData.annualIncome).toLocaleString()}/yr` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 5 ? (
                    <button
                      type="submit"
                      className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg shadow-sm transition-colors"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      {!isSubmitting && <Check className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}