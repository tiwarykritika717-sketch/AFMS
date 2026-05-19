import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  FileText, 
  ArrowUpRight, 
  Download, 
  Search,
  ExternalLink,
  History,
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calculator,
  LayoutDashboard
} from 'lucide-react';
import { handleDownload } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';

const INITIAL_TAX_REPORTS = [
  { id: 'GST-05-24', type: 'GSTR-3B', period: 'May 2024', liability: 452000, credit: 120000, status: 'Filed' },
  { id: 'TDS-Q1-24', type: 'TDS Returns', period: 'Q1 (Apr-Jun)', liability: 85000, credit: 0, status: 'Pending' },
  { id: 'GST-04-24', type: 'GSTR-1', period: 'Apr 2024', liability: 380400, credit: 95000, status: 'Filed' },
];

export default function Taxation() {
  const { invoices, contacts } = useAppContext();
  const [reports, setReports] = useState(INITIAL_TAX_REPORTS);
  const [isFiling, setIsFiling] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [filingStep, setFilingStep] = useState(1);
  const [selectedReturn, setSelectedReturn] = useState('GSTR-1');
  const [activeReport, setActiveReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'Summary' | 'GSTR-1' | 'GSTR-3B'>('Summary');

  // Calculate GST Metrics from actual invoices
  const calculateGSTMetrics = () => {
    let totalTaxable = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    let b2bCount = 0;
    let b2cCount = 0;

    invoices.forEach(inv => {
      const isInclusive = inv.taxType === 'Inclusive';
      const rawTotal = inv.amount;
      const taxable = isInclusive ? rawTotal / 1.18 : rawTotal / 1.18; // Wait, exclusive amount in state is total already including 1.18? 
      // Re-checking AR.tsx: totalAmount = taxType === 'Exclusive' ? subTotal * 1.18 : subTotal;
      // So if Exclusive, amount is sum * 1.18. If Inclusive, amount is sum.
      
      const currentTaxable = inv.taxType === 'Exclusive' ? inv.amount / 1.18 : inv.amount / 1.18;
      // Precision fix
      const roundedTaxable = Number(currentTaxable.toFixed(2));
      const gst = inv.amount - roundedTaxable;
      
      totalTaxable += roundedTaxable;
      totalCGST += (gst / 2);
      totalSGST += (gst / 2);

      const customer = contacts.find(c => c.name === inv.customerName);
      if (customer?.type === 'B2B') b2bCount++;
      else b2cCount++;
    });

    return { totalTaxable, totalCGST, totalSGST, totalIGST, b2bCount, b2cCount };
  };

  const metrics = calculateGSTMetrics();

  const handleFileReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setFilingStep(2);
    setTimeout(() => {
      const newReport = {
        id: `GST-06-${Math.floor(Math.random() * 100)}`,
        type: selectedReturn,
        period: 'June 2024',
        liability: 125000,
        credit: 45000,
        status: 'Filed'
      };
      setReports([newReport, ...reports]);
      setFilingStep(3);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Taxation & Compliance</h1>
          <p className="text-brand-grey-dark/50">GST, TDS, and statutory liability tracking</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowHistory(true)}
            className="px-6 py-3 border border-brand-grey-dark/10 bg-white text-brand-blue rounded-xl font-bold hover:bg-brand-grey-light transition-all flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            Tax History
          </button>
          <button 
            onClick={() => { setIsFiling(true); setFilingStep(1); }}
            className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <FileText className="w-5 h-5" />
            File New Return
          </button>
        </div>
      </div>

      <AnimatePresence>
        {/* Filing Modal */}
        {isFiling && (
          <div className="fixed inset-0 bg-brand-blue/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                <h2 className="text-xl font-display font-bold text-brand-blue">Statutory Tax Filing</h2>
                <button onClick={() => setIsFiling(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-5 h-5 text-brand-grey-dark/40" />
                </button>
              </div>

              <div className="p-10 text-center">
                {filingStep === 1 && (
                  <form onSubmit={handleFileReturn} className="space-y-6">
                    <div className="p-6 bg-brand-grey-light/50 rounded-2xl border border-brand-grey-dark/5">
                      <p className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest mb-4">Select Return Type</p>
                      <div className="grid grid-cols-2 gap-3">
                        {['GSTR-1', 'GSTR-3B', 'GSTR-9', 'TDS-26Q'].map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setSelectedReturn(type)}
                            className={`p-4 rounded-xl border-2 transition-all font-bold ${selectedReturn === type ? 'border-brand-teal bg-white text-brand-teal shadow-md' : 'border-transparent bg-white/50 text-brand-grey-dark/40 hover:bg-white'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl flex items-start gap-3 text-left">
                       <AlertTriangle className="w-5 h-5 text-brand-warning shrink-0 mt-0.5" />
                       <p className="text-xs text-brand-warning font-medium leading-relaxed">
                         The system will auto-populate data from your General Ledger and Sales registers. Ensure all transactions for June 2024 are reconciled before proceeding.
                       </p>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-5 bg-brand-teal text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-brand-teal/20 flex items-center justify-center gap-3"
                    >
                      Authenticate & File Return <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {filingStep === 2 && (
                   <div className="space-y-6 py-10">
                      <div className="w-20 h-20 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
                      <div>
                        <h3 className="text-xl font-display font-bold text-brand-blue">Validating GSTN Data</h3>
                        <p className="text-sm text-brand-grey-dark/40 mt-1">Establishing secure connection with statutory gateways...</p>
                      </div>
                   </div>
                )}

                {filingStep === 3 && (
                   <div className="space-y-8 py-6">
                      <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-brand-success" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold text-brand-blue">Filing Successful!</h3>
                        <p className="text-sm text-brand-grey-dark/40 mt-1">Reference ID: ARN-GST-20240621X99</p>
                      </div>
                      <button 
                        onClick={() => setIsFiling(false)}
                        className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold"
                      >
                        Back to Taxation
                      </button>
                   </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-brand-blue/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-brand-blue rounded-2xl">
                      <History className="w-6 h-6 text-white" />
                   </div>
                   <h2 className="text-xl font-display font-bold text-brand-blue">Tax Compliance History</h2>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-6 h-6 text-brand-grey-dark/40" />
                </button>
              </div>
              <div className="p-10 overflow-y-auto">
                 <div className="relative border-l-2 border-brand-grey-light ml-4 space-y-12 py-4">
                    {[
                      { year: '2024-25', status: 'In Progress', fill: 'bg-brand-blue' },
                      { year: '2023-24', status: 'Compliant', fill: 'bg-brand-success' },
                      { year: '2022-23', status: 'Compliant', fill: 'bg-brand-success' },
                    ].map((item, idx) => (
                      <div key={idx} className="relative pl-10">
                         <div className={`absolute left-[-11px] top-0 w-5 h-5 rounded-full border-4 border-white ${item.fill} shadow-sm`} />
                         <div>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-brand-grey-light text-brand-grey-dark/40 uppercase tracking-widest">{item.status}</span>
                            <h4 className="text-2xl font-display font-bold text-brand-blue mt-1">Financial Year {item.year}</h4>
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                               {['GST Returns', 'TDS Filings', 'Income Tax', 'Audit'].map(stat => (
                                 <div key={stat} className="p-4 bg-brand-grey-light/30 rounded-2xl text-center">
                                    <p className="text-[8px] font-black text-brand-grey-dark/30 uppercase tracking-widest mb-1">{stat}</p>
                                    <p className="text-sm font-bold text-brand-blue">12/12</p>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeReport && (
          <div className="fixed inset-0 bg-brand-blue/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-brand-grey-dark/5"
            >
              <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-teal rounded-2xl text-white">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-brand-blue">{activeReport.type}</h2>
                        <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest">Digital Acknowledgement • {activeReport.id}</p>
                    </div>
                </div>
                <button onClick={() => setActiveReport(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-5 h-5 text-brand-grey-dark/40" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-brand-grey-light/50 rounded-2xl">
                        <p className="text-[9px] font-black text-brand-grey-dark/40 uppercase mb-1">Liability Amount</p>
                        <p className="text-xl font-bold text-brand-blue">₹ {activeReport.liability.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-brand-grey-light/50 rounded-2xl">
                        <p className="text-[9px] font-black text-brand-grey-dark/40 uppercase mb-1">Input Credit</p>
                        <p className="text-xl font-bold text-brand-teal">₹ {activeReport.credit.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="bg-brand-grey-light/30 p-4 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-blue/60 uppercase">Filing Status</span>
                    <span className="px-3 py-1 bg-green-50 text-brand-success text-[10px] font-bold rounded-full">{activeReport.status}</span>
                 </div>

                 <button 
                  onClick={() => handleDownload(`${activeReport.type}_Acknowledgement`)}
                  className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-blue-900/20 hover:scale-[1.01] active:scale-95 transition-all"
                 >
                  Download Receipt
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Estimated Liability', value: `₹ ${(metrics.totalCGST + metrics.totalSGST).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'brand-error', b: 'bg-red-50' },
          { label: 'Taxable Sales', value: `₹ ${metrics.totalTaxable.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'brand-blue', b: 'bg-blue-50' },
          { label: 'B2B Invoices', value: metrics.b2bCount, color: 'brand-teal', b: 'bg-teal-50' },
          { label: 'Pending Filings', value: '2', color: 'brand-warning', b: 'bg-amber-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl card-shadow border border-brand-grey-dark/5">
            <div className="flex justify-between items-center mb-4">
                <div className={`w-8 h-8 rounded-lg ${item.b} flex items-center justify-center`}>
                    <ShieldCheck className={`w-4 h-4 text-${item.color}`} />
                </div>
                <span className="text-[9px] font-black text-brand-blue/30 uppercase tracking-widest px-2 py-0.5 bg-brand-grey-light rounded">Current Month</span>
            </div>
            <p className="text-[10px] font-bold text-brand-grey-dark/40 uppercase tracking-widest leading-none mb-1">{item.label}</p>
            <h3 className={`text-2xl font-display font-bold text-${item.color} tracking-tight`}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] card-shadow border border-brand-grey-dark/5 overflow-hidden">
        <div className="p-8 border-b border-brand-grey-dark/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
               <button 
                onClick={() => setActiveTab('Summary')}
                className={`text-xs font-black uppercase tracking-widest pb-2 transition-all ${activeTab === 'Summary' ? 'text-brand-teal border-b-2 border-brand-teal' : 'text-brand-grey-dark/30 hover:text-brand-blue'}`}
               >
                Filing Summary
               </button>
               <button 
                onClick={() => setActiveTab('GSTR-1')}
                className={`text-xs font-black uppercase tracking-widest pb-2 transition-all ${activeTab === 'GSTR-1' ? 'text-brand-teal border-b-2 border-brand-teal' : 'text-brand-grey-dark/30 hover:text-brand-blue'}`}
               >
                GSTR-1 (Sales)
               </button>
               <button 
                onClick={() => setActiveTab('GSTR-3B')}
                className={`text-xs font-black uppercase tracking-widest pb-2 transition-all ${activeTab === 'GSTR-3B' ? 'text-brand-teal border-b-2 border-brand-teal' : 'text-brand-grey-dark/30 hover:text-brand-blue'}`}
               >
                GSTR-3B (Monthly)
               </button>
            </div>
            <div className="flex gap-2">
                <button className="p-2.5 rounded-xl bg-brand-grey-light hover:bg-brand-grey-dark/10 transition-colors"><Search className="w-4 h-4 text-brand-grey-dark/60" /></button>
                <button 
                  onClick={() => handleDownload('GST_Reports')}
                  className="p-2.5 rounded-xl bg-brand-grey-light hover:bg-brand-grey-dark/10 transition-colors"
                >
                  <Download className="w-4 h-4 text-brand-grey-dark/60" />
                </button>
            </div>
        </div>

        {activeTab === 'Summary' && (
            <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                    <thead>
                        <tr className="bg-brand-grey-light/30">
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Report Type</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Filing Period</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">Tax Liability</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">ITC Adjustment</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-center">Filing Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-grey-dark/5 text-sm">
                        {reports.map(rep => (
                            <tr 
                                key={rep.id} 
                                onClick={() => setActiveReport(rep)}
                                className="hover:bg-brand-grey-light/10 group cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-brand-blue" />
                                        </div>
                                        <p className="font-bold text-brand-blue">{rep.type}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-brand-blue/60">{rep.period}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-brand-error">₹{rep.liability.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-brand-success italic">₹{rep.credit.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${rep.status === 'Filed' ? 'bg-green-50 text-brand-success' : 'bg-red-50 text-brand-error'}`}>
                                        {rep.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {activeTab === 'GSTR-1' && (
             <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-6 bg-brand-grey-light/30 rounded-[2rem] border border-brand-grey-dark/5">
                      <p className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest mb-2">B2B Supplies (4A, 4B, 4C, 6B, 6C)</p>
                      <p className="text-2xl font-bold text-brand-blue">₹ {metrics.totalTaxable.toLocaleString()}</p>
                      <p className="text-xs text-brand-teal mt-1 font-bold">{metrics.b2bCount} Invoices</p>
                   </div>
                   <div className="p-6 bg-brand-grey-light/30 rounded-[2rem] border border-brand-grey-dark/5">
                      <p className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest mb-2">B2C Large (5A, 5B)</p>
                      <p className="text-2xl font-bold text-brand-blue">₹ 0.00</p>
                      <p className="text-xs text-brand-grey-dark/40 mt-1">Inter-state &gt; 2.5L</p>
                   </div>
                   <div className="p-6 bg-brand-grey-light/30 rounded-[2rem] border border-brand-grey-dark/5">
                      <p className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest mb-2">B2C Small (7)</p>
                      <p className="text-2xl font-bold text-brand-blue">₹ 0.00</p>
                      <p className="text-xs text-brand-grey-dark/40 mt-1">{metrics.b2cCount} Transactions</p>
                   </div>
                </div>

                <div className="bg-brand-grey-light/20 rounded-3xl p-6 border border-brand-grey-dark/5">
                   <h4 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Calculator className="w-4 h-4" /> Tax Computation (Table 12 - HSN Wise)
                   </h4>
                   <table className="w-full text-xs">
                      <thead>
                         <tr className="text-brand-grey-dark/40 font-bold border-b border-brand-grey-dark/10">
                            <th className="py-3 text-left">HSN/SAC</th>
                            <th className="py-3 text-right">Taxable Value</th>
                            <th className="py-3 text-right">IGST</th>
                            <th className="py-3 text-right">CGST</th>
                            <th className="py-3 text-right">SGST</th>
                            <th className="py-3 text-right">Total Tax</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-grey-dark/5">
                         <tr>
                            <td className="py-4 font-bold text-brand-blue">998313</td>
                            <td className="py-4 text-right">₹ {metrics.totalTaxable.toLocaleString()}</td>
                            <td className="py-4 text-right text-brand-grey-dark/40">₹ 0.00</td>
                            <td className="py-4 text-right font-medium text-brand-error">₹ {metrics.totalCGST.toLocaleString()}</td>
                            <td className="py-4 text-right font-medium text-brand-error">₹ {metrics.totalSGST.toLocaleString()}</td>
                            <td className="py-4 text-right font-bold text-brand-teal">₹ {(metrics.totalCGST + metrics.totalSGST).toLocaleString()}</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
        )}

        {activeTab === 'GSTR-3B' && (
             <div className="p-8 space-y-10">
                <div className="bg-teal-50/50 p-6 rounded-3xl border border-brand-teal/10 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-teal rounded-2xl text-white">
                         <LayoutDashboard className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="font-bold text-brand-blue">GSTR-3B Summary for April 2024</h4>
                         <p className="text-xs text-brand-grey-dark/40 font-medium">Auto-drafted from your accounting records</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest mb-1">Filing Deadline</p>
                      <p className="text-sm font-bold text-brand-error">20th May, 2024</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-brand-blue/40 uppercase tracking-widest ml-1">3.1 - Details of Outward Supplies</h5>
                      <div className="p-5 bg-brand-grey-light/30 rounded-2xl border border-brand-grey-dark/5 flex justify-between items-center">
                         <span className="text-xs font-bold text-brand-blue/60">(a) Taxable supplies</span>
                         <div className="text-right">
                             <p className="text-sm font-bold text-brand-blue">₹ {metrics.totalTaxable.toLocaleString()}</p>
                             <p className="text-[10px] text-brand-error font-bold">Tax: ₹ {(metrics.totalCGST + metrics.totalSGST).toLocaleString()}</p>
                         </div>
                      </div>
                      <div className="p-5 bg-brand-grey-light/30 rounded-2xl border border-brand-grey-dark/5 flex justify-between items-center opacity-50">
                         <span className="text-xs font-bold text-brand-blue/60">(b) Zero Rated supplies</span>
                         <p className="text-sm font-bold text-brand-blue">₹ 0.00</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-brand-blue/40 uppercase tracking-widest ml-1">4 - Eligible ITC</h5>
                      <div className="p-5 bg-brand-grey-light/30 rounded-2xl border border-brand-grey-dark/5 flex justify-between items-center">
                         <span className="text-xs font-bold text-brand-blue/60">(A) ITC Available</span>
                         <div className="text-right">
                             <p className="text-sm font-bold text-brand-success">₹ 1,20,000</p>
                             <p className="text-[10px] text-brand-grey-dark/40">From GSTR-2B</p>
                         </div>
                      </div>
                      <div className="p-5 bg-brand-teal text-white rounded-2xl border border-brand-teal/20 flex justify-between items-center shadow-lg shadow-brand-teal/20">
                         <span className="text-xs font-black uppercase tracking-widest">Net Tax Payable (3.1 - 4)</span>
                         <p className="text-lg font-black tracking-tight">₹ {Math.max(0, (metrics.totalCGST + metrics.totalSGST) - 120000).toLocaleString()}</p>
                      </div>
                   </div>
                </div>
             </div>
        )}
      </div>

      <div className="mt-8 bg-brand-blue p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 card-shadow shadow-blue-900/10">
         <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-display font-bold">Government Portal Integration</h4>
            <p className="text-sm opacity-60 max-w-md">Sync your AFMS data directly with the GSTN and IT Portals for automated reconciliation and one-click filing.</p>
         </div>
         <button className="px-8 py-4 bg-white text-brand-blue rounded-xl font-black text-xs tracking-widest uppercase flex items-center gap-2 hover:scale-[1.05] transition-transform">
            Connect portals <ExternalLink className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}
