import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FilePlus, 
  Search, 
  ArrowRightLeft, 
  History, 
  Layout, 
  ShieldCheck,
  CalendarDays,
  Download,
  X,
  BookOpen
} from 'lucide-react';
import { handleDownload } from '../../utils/helpers';

const INITIAL_ENTRIES = [
  { id: 'JV-001', date: '2024-05-10', debit: 'Rent Expense', credit: 'HDFC Bank', amount: 45000, desc: 'May 2024 Office Rent' },
  { id: 'JV-002', date: '2024-05-12', debit: 'Salary Payable', credit: 'Petty Cash', amount: 5000, desc: 'Salary Advance' },
  { id: 'JV-003', date: '2024-05-14', debit: 'Fixed Assets', credit: 'Vendor Payable', amount: 12000, desc: 'Laptop Purchase' },
];

export default function GeneralLedger() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [isCreating, setIsCreating] = useState(false);
  const [newEntry, setNewEntry] = useState({
    debit: '',
    credit: '',
    amount: '',
    desc: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `JV-${(entries.length + 1).toString().padStart(3, '0')}`;
    const date = new Date().toISOString().split('T')[0];
    
    setEntries([{
      id,
      date,
      debit: newEntry.debit,
      credit: newEntry.credit,
      amount: parseFloat(newEntry.amount),
      desc: newEntry.desc
    }, ...entries]);
    
    setIsCreating(false);
    setNewEntry({ debit: '', credit: '', amount: '', desc: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">General Ledger</h1>
          <p className="text-brand-grey-dark/50">Double-entry bookkeeping and journal management</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border border-brand-grey-dark/10 bg-white text-brand-blue rounded-xl font-bold hover:bg-brand-grey-light transition-all flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Closing Entries
          </button>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <FilePlus className="w-5 h-5" />
            New Journal Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Journal Entries', value: entries.length.toLocaleString(), icon: History, color: 'text-brand-blue' },
          { label: 'Trial Balance', value: 'Balanced', icon: ShieldCheck, color: 'text-brand-success' },
          { label: 'Pending Recon', value: '12', icon: ArrowRightLeft, color: 'text-brand-warning' },
          { label: 'Ledger Accounts', value: '42', icon: Layout, color: 'text-brand-teal' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl card-shadow border border-brand-grey-dark/5">
            <div className="flex items-center gap-3 mb-3">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <p className="text-[10px] font-bold text-brand-grey-dark/40 uppercase tracking-widest">{item.label}</p>
            </div>
            <h3 className="text-2xl font-display font-bold text-brand-blue tracking-tight">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] card-shadow border border-brand-grey-dark/5 overflow-hidden">
        <div className="p-6 border-b border-brand-grey-dark/5 bg-brand-grey-light/30 flex justify-between items-center">
          <h3 className="text-lg font-display font-bold text-brand-blue">Recent Transactions</h3>
          <button 
            onClick={() => handleDownload('General_Ledger_Transactions')}
            className="p-2 border rounded-lg hover:bg-white transition-colors"
          >
            <Download className="w-4 h-4 text-brand-grey-dark/60" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-grey-light/20">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Entry ID</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Debit / Credit</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">Debit Amt</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">Credit Amt</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Narration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey-dark/5 text-sm">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-brand-grey-light/10">
                  <td className="px-6 py-4">
                    <p className="font-bold text-brand-blue">{entry.id}</p>
                    <p className="text-[10px] text-brand-grey-dark/40">{entry.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-brand-success font-semibold italic">{entry.debit}</p>
                    <p className="text-brand-error font-semibold italic pl-4">to {entry.credit}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-brand-blue">₹{entry.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-brand-blue">₹{entry.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-brand-grey-dark/60">{entry.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-blue/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-brand-grey-dark/5"
            >
              <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-teal/10 rounded-xl">
                    <BookOpen className="w-5 h-5 text-brand-teal" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-brand-blue">New Journal Entry</h2>
                    <p className="text-[10px] text-brand-grey-dark/40 uppercase font-black tracking-widest">Double Entry System</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="p-2 hover:bg-brand-grey-light rounded-xl transition-all"
                >
                  <X className="w-5 h-5 text-brand-blue/40" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-brand-grey-dark/40 tracking-widest px-1">Debit Account</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Rent Expense"
                        value={newEntry.debit}
                        onChange={(e) => setNewEntry({ ...newEntry, debit: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-brand-grey-dark/40 tracking-widest px-1">Credit Account</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Bank Account"
                        value={newEntry.credit}
                        onChange={(e) => setNewEntry({ ...newEntry, credit: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-brand-grey-dark/40 tracking-widest px-1">Total Amount (₹)</label>
                    <input 
                      type="number"
                      required
                      placeholder="0.00"
                      value={newEntry.amount}
                      onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                      className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-2xl font-display font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-brand-grey-dark/40 tracking-widest px-1">Narration / Description</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Enter journal description..."
                      value={newEntry.desc}
                      onChange={(e) => setNewEntry({ ...newEntry, desc: e.target.value })}
                      className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 px-6 py-4 bg-brand-grey-light text-brand-blue/60 rounded-2xl font-bold hover:bg-brand-grey-dark/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 bg-brand-teal text-white rounded-2xl font-bold shadow-lg shadow-brand-teal/20 hover:scale-[1.02] transition-all"
                  >
                    Post Journal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

