import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ArrowRightLeft, 
  Search, 
  Download, 
  CreditCard, 
  Building,
  CheckCircle,
  AlertCircle,
  X,
  Wallet
} from 'lucide-react';
import { handleDownload } from '../../utils/helpers';

const INITIAL_CASH_TRANS = [
  { id: 'CB-101', date: '2024-05-20', type: 'Bank', ref: 'CHQ-98212', amount: 120000, desc: 'Customer Collection' },
  { id: 'CB-102', date: '2024-05-21', type: 'Cash', ref: 'VCH-02', amount: -500, desc: 'Stationary Expense' },
  { id: 'CB-103', date: '2024-05-22', type: 'Bank', ref: 'IMPS-221', amount: -25000, desc: 'Vendor Payment' },
];

export default function CashBank() {
  const [transactions, setTransactions] = useState(INITIAL_CASH_TRANS);
  const [isCreating, setIsCreating] = useState(false);
  const [newTrans, setNewTrans] = useState({
    type: 'Bank',
    ref: '',
    amount: '',
    desc: '',
    isExpense: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newTrans.amount) * (newTrans.isExpense ? -1 : 1);
    const id = `CB-${transactions.length + 101}`;
    const date = new Date().toISOString().split('T')[0];
    
    setTransactions([{
      id,
      date,
      type: newTrans.type,
      ref: newTrans.ref,
      amount,
      desc: newTrans.desc
    }, ...transactions]);
    
    setIsCreating(false);
    setNewTrans({ type: 'Bank', ref: '', amount: '', desc: '', isExpense: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Cash & Bank</h1>
          <p className="text-brand-grey-dark/50">Manage liquidity and bank reconciliations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border border-brand-grey-dark/10 bg-white text-brand-blue rounded-xl font-bold hover:bg-brand-grey-light transition-all flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Bank Reconciliation
          </button>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-5 h-5" />
            New Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cash Summary */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-brand-grey-dark/5 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-brand-teal" />
              <p className="text-[10px] font-bold text-brand-grey-dark/40 uppercase tracking-widest">Main Cash Counter</p>
            </div>
            <h3 className="text-4xl font-display font-bold text-brand-blue mb-2">₹ 14,250</h3>
            <div className="flex items-center gap-2 text-brand-success">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-bold font-display uppercase tracking-tight">Verified Today</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 branding-gradient opacity-10 rounded-bl-[4rem]" />
        </div>

        {/* Bank Summary */}
        <div className="bg-brand-blue p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 opacity-60">
              <Building className="w-5 h-5" />
              <p className="text-[10px] font-bold uppercase tracking-widest">HDFC Corporate Account</p>
            </div>
            <h3 className="text-4xl font-display font-bold mb-2">₹ 24,12,850</h3>
            <div className="flex items-center gap-2 opacity-80">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold font-display uppercase tracking-tight">3 Deposits Pending Clearence</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal opacity-20 rounded-bl-[4rem]" />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] card-shadow border border-brand-grey-dark/5 overflow-hidden">
        <div className="p-6 border-b border-brand-grey-dark/5 bg-brand-grey-light/30 flex justify-between items-center">
          <h3 className="text-lg font-display font-bold text-brand-blue">Transaction History</h3>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg hover:bg-brand-grey-light"><Search className="w-4 h-4" /></button>
            <button 
              onClick={() => handleDownload('Cash_Bank_History')}
              className="p-2 border rounded-lg hover:bg-brand-grey-light"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-grey-light/20">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Trans ID</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Method</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Ref No.</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Description</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey-dark/5 text-sm">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-brand-grey-light/10">
                  <td className="px-6 py-4 flex flex-col">
                    <span className="font-bold text-brand-blue">{t.id}</span>
                    <span className="text-[10px] text-brand-grey-dark/40">{t.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${t.type === 'Bank' ? 'bg-blue-50 text-brand-blue' : 'bg-amber-50 text-brand-warning'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-brand-teal">{t.ref}</td>
                  <td className="px-6 py-4 font-medium">{t.desc}</td>
                  <td className={`px-6 py-4 text-right font-display font-bold ${t.amount < 0 ? 'text-brand-error' : 'text-brand-success'}`}>
                    {t.amount < 0 ? '-' : '+'} ₹{Math.abs(t.amount).toLocaleString()}
                  </td>
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
                    <Wallet className="w-5 h-5 text-brand-teal" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-brand-blue">New Transaction</h2>
                    <p className="text-[10px] text-brand-grey-dark/40 uppercase font-black tracking-widest">Post to Ledger</p>
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
                <div className="grid grid-cols-2 gap-4 bg-brand-grey-light/30 p-2 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setNewTrans({ ...newTrans, isExpense: false })}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${!newTrans.isExpense ? 'bg-white shadow-sm text-brand-success' : 'text-brand-grey-dark/40 hover:text-brand-blue'}`}
                  >
                    Income (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTrans({ ...newTrans, isExpense: true })}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${newTrans.isExpense ? 'bg-white shadow-sm text-brand-error' : 'text-brand-grey-dark/40 hover:text-brand-blue'}`}
                  >
                    Expense (-)
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-brand-grey-dark/40 tracking-widest px-1">Method</label>
                      <select 
                        required
                        value={newTrans.type}
                        onChange={(e) => setNewTrans({ ...newTrans, type: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                      >
                        <option value="Bank">HDFC Bank</option>
                        <option value="Cash">Main Cash</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-brand-grey-dark/40 tracking-widest px-1">Reference No</label>
                      <input 
                        type="text"
                        required
                        placeholder="CHQ / VCH No"
                        value={newTrans.ref}
                        onChange={(e) => setNewTrans({ ...newTrans, ref: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-brand-grey-dark/40 tracking-widest px-1">Amount (₹)</label>
                    <input 
                      type="number"
                      required
                      placeholder="0.00"
                      value={newTrans.amount}
                      onChange={(e) => setNewTrans({ ...newTrans, amount: e.target.value })}
                      className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-2xl font-display font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-brand-grey-dark/40 tracking-widest px-1">Description</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Enter transaction details..."
                      value={newTrans.desc}
                      onChange={(e) => setNewTrans({ ...newTrans, desc: e.target.value })}
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
                    Create Transaction
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

