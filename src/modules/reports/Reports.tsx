import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  BarChart, 
  PieChart, 
  Download, 
  Printer, 
  Mail, 
  Filter,
  ChevronRight,
  TrendingUp,
  X,
  CreditCard,
  ArrowUpRight,
  Table as TableIcon
} from 'lucide-react';
import { handleDownload } from '../../utils/helpers';

const REPORTS = [
  { name: 'Balance Sheet', cat: 'Financial Statements', period: 'FY 2024-25', updated: '10 mins ago', data: [
    { label: 'Fixed Assets', value: '₹ 85,00,000' },
    { label: 'Current Assets', value: '₹ 45,60,000' },
    { label: 'Current Liabilities', value: '₹ 22,00,000' },
    { label: 'Share Capital', value: '₹ 1,00,00,000' },
  ]},
  { name: 'Profit & Loss Account', cat: 'Financial Statements', period: 'FY 2024-25', updated: '10 mins ago', data: [
    { label: 'Total Revenue', value: '₹ 1,20,00,000' },
    { label: 'Direct Expenses', value: '₹ 55,00,000' },
    { label: 'Indirect Expenses', value: '₹ 15,00,000' },
    { label: 'Net Profit', value: '₹ 42,00,000' },
  ]},
  { name: 'Cash Flow Statement', cat: 'Management Reports', period: 'Quarterly', updated: '1 hr ago', data: [
    { label: 'Operating Activity', value: '₹ 12,00,000' },
    { label: 'Investing Activity', value: '₹ (4,00,000)' },
    { label: 'Financing Activity', value: '₹ 50,000' },
    { label: 'Net Cash Flow', value: '₹ 8,50,000' },
  ]},
  { name: 'GSTR-1 Summary', cat: 'Taxation Reports', period: 'April 2024', updated: '2 hrs ago', data: [
    { label: 'B2B Invoices', value: '142' },
    { label: 'Total Taxable Value', value: '₹ 18,50,000' },
    { label: 'Total IGST', value: '₹ 1,20,000' },
    { label: 'Total CGST/SGST', value: '₹ 2,13,000' },
  ]},
  { name: 'GSTR-3B Return', cat: 'Taxation Reports', period: 'April 2024', updated: '2 hrs ago', data: [
    { label: 'Outward Supplies', value: '₹ 18,50,000' },
    { label: 'ITC Eligible', value: '₹ 45,000' },
    { label: 'Interest Payable', value: '₹ 0.00' },
    { label: 'Total Tax Paid', value: '₹ 2,88,000' },
  ]},
  { name: 'General Ledger', cat: 'Financial Statements', period: 'Custom', updated: 'Just now', data: [
    { label: 'Total Debits', value: '₹ 4,50,00,000' },
    { label: 'Total Credits', value: '₹ 4,50,00,000' },
    { label: 'Opening Balance', value: '₹ 12,00,000' },
    { label: 'Closing Balance', value: '₹ 18,50,000' },
  ]},
  { name: 'Bank Reconciliation', cat: 'Cash & Bank Reports', period: 'April 2024', updated: '1 hr ago', data: [
    { label: 'Balance per Books', value: '₹ 12,45,000' },
    { label: 'Uncleared Deposits', value: '₹ 85,000' },
    { label: 'Unpresented Cheques', value: '₹ 1,20,000' },
    { label: 'Balance per Bank', value: '₹ 12,10,000' },
  ]},
  { name: 'Day Book (Cash)', cat: 'Cash & Bank Reports', period: 'Today', updated: 'Just now', data: [
    { label: 'Opening Cash', value: '₹ 15,000' },
    { label: 'Cash Receipts', value: '₹ 8,400' },
    { label: 'Cash Payments', value: '₹ 2,100' },
    { label: 'Closing Cash', value: '₹ 21,300' },
  ]},
];

export default function Reports() {
  const [activeReport, setActiveReport] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', count: REPORTS.length },
    { name: 'Financial Statements', count: REPORTS.filter(r => r.cat === 'Financial Statements').length },
    { name: 'Management Reports', count: REPORTS.filter(r => r.cat === 'Management Reports').length },
    { name: 'Taxation Reports', count: REPORTS.filter(r => r.cat === 'Taxation Reports').length },
    { name: 'Cash & Bank Reports', count: REPORTS.filter(r => r.cat === 'Cash & Bank Reports').length },
  ];

  const filteredReports = activeCategory === 'All' 
    ? REPORTS 
    : REPORTS.filter(r => r.cat === activeCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Financial Reporting & MIS</h1>
          <p className="text-brand-grey-dark/50">Comprehensive data analysis and statutory financial statements</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border border-brand-grey-dark/10 bg-white text-brand-blue rounded-xl font-bold hover:bg-brand-grey-light transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button 
            onClick={() => handleDownload('Batch_Report')}
            className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-blue-900/10 flex items-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <Printer className="w-4 h-4" />
            Print Batch
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeReport && (
          <div className="fixed inset-0 bg-brand-blue/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-teal rounded-2xl">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-brand-blue">{activeReport.name}</h2>
                        <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest">{activeReport.cat} • {activeReport.period}</p>
                    </div>
                </div>
                <button onClick={() => setActiveReport(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-6 h-6 text-brand-grey-dark/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {activeReport.data?.map((item: any, i: number) => (
                        <div key={i} className="bg-brand-grey-light/50 p-6 rounded-3xl border border-brand-grey-dark/5">
                            <p className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest mb-1">{item.label}</p>
                            <h4 className="text-2xl font-display font-bold text-brand-blue">{item.value}</h4>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl border border-brand-grey-dark/5 overflow-hidden">
                    <div className="p-4 bg-brand-grey-light/30 border-b border-brand-grey-dark/5 flex justify-between items-center">
                        <span className="text-xs font-bold text-brand-blue/60 uppercase tracking-widest flex items-center gap-2">
                            <TableIcon className="w-3 h-3" /> Detailed Breakdown
                        </span>
                        <button className="text-[10px] font-bold text-brand-teal hover:underline uppercase tracking-widest">Download Detailed CSV</button>
                    </div>
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-brand-grey-dark/5">
                            {[1, 2, 3, 4, 5].map((row) => (
                                <tr key={row} className="hover:bg-brand-grey-light/10 transition-colors">
                                    <td className="px-6 py-4 text-sm text-brand-blue/80 font-medium tracking-tight">Ledger Account Item #{row}</td>
                                    <td className="px-6 py-4 text-right text-sm font-mono font-bold text-brand-blue">₹ {(Math.random() * 50000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>

              <div className="p-8 border-t border-brand-grey-dark/5 flex justify-end gap-4 bg-brand-grey-light/20">
                <button 
                    onClick={() => handleDownload(activeReport.name)}
                    className="px-8 py-3 bg-brand-teal text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
                >
                    <Download className="w-4 h-4" /> Export Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <h4 className="text-xs font-black text-brand-blue/30 uppercase tracking-widest pl-2">Report Categories</h4>
            <div className="space-y-1">
                {categories.map((cat) => (
                    <button 
                        key={cat.name} 
                        onClick={() => setActiveCategory(cat.name)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeCategory === cat.name ? 'bg-brand-teal text-white shadow-lg' : 'hover:bg-white text-brand-grey-dark/60 hover:text-brand-blue'}`}
                    >
                        <span className="text-sm font-bold">{cat.name}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${activeCategory === cat.name ? 'bg-white/20' : 'bg-brand-grey-light'}`}>{cat.count}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReports.map((report, idx) => (
                    <motion.div 
                        key={report.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setActiveReport(report)}
                        className="bg-white p-6 rounded-[2rem] card-shadow border border-brand-grey-dark/5 group hover:border-brand-teal/30 transition-all flex items-start gap-6 cursor-pointer"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-brand-grey-light flex items-center justify-center shrink-0 group-hover:bg-brand-teal/10 transition-colors">
                            <FileText className="w-6 h-6 text-brand-blue group-hover:text-brand-teal transition-colors" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-md font-bold text-brand-blue leading-tight">{report.name}</h3>
                                <ChevronRight className="w-4 h-4 text-brand-grey-dark/20 group-hover:text-brand-teal" />
                            </div>
                            <p className="text-[10px] font-bold text-brand-grey-dark/40 uppercase tracking-widest mb-4">{report.cat}</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-brand-grey-dark/5">
                                <span className="text-[10px] font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded">{report.period}</span>
                                <div className="flex gap-2">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleDownload(report.name); }}
                                      className="p-1.5 rounded-lg hover:bg-brand-grey-light"
                                    >
                                      <Download className="w-3 h-3 text-brand-grey-dark/40" />
                                    </button>
                                    <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-brand-grey-light"><Mail className="w-3 h-3 text-brand-grey-dark/40" /></button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] card-shadow border border-brand-grey-dark/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-blue-50 rounded-3xl">
                        <TrendingUp className="w-10 h-10 text-brand-blue" />
                    </div>
                    <div>
                        <h4 className="text-xl font-display font-bold text-brand-blue">Build Custom Report</h4>
                        <p className="text-sm text-brand-grey-dark/40">Drag and drop fields to create your own MIS dashboards.</p>
                    </div>
                </div>
                <button className="px-10 py-5 bg-brand-teal text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-brand-teal/20 active:scale-95 transition-transform">
                    Open BI Tool
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
