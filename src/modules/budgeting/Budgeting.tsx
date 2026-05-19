import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight,
  TrendingDown,
  Download,
  X
} from 'lucide-react';
import { handleDownload } from '../../utils/helpers';

const BUDGETS = [
  { dept: 'Marketing', allocated: 250000, actual: 210000, var: 40000, status: 'Within' },
  { dept: 'IT Systems', allocated: 500000, actual: 520000, var: -20000, status: 'Over' },
  { dept: 'Staffing', allocated: 1200000, actual: 1150000, var: 50000, status: 'Within' },
];

export default function Budgeting() {
  const [isCreating, setIsCreating] = useState(false);
  const [budgets, setBudgets] = useState(BUDGETS);
  const [formData, setFormData] = useState({
    dept: 'Marketing',
    allocated: 0,
    actual: 0,
    period: 'Monthly'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = {
      ...formData,
      var: formData.allocated - formData.actual,
      status: formData.actual <= formData.allocated ? 'Within' : 'Over'
    };
    setBudgets([...budgets, newBudget]);
    setIsCreating(false);
    setFormData({ dept: 'Marketing', allocated: 0, actual: 0, period: 'Monthly' });
  };

  const stats = [
    { label: 'Total Allocated', val: `₹ ${(budgets.reduce((acc, b) => acc + b.allocated, 0) / 10000000).toFixed(2)} Cr`, icon: Target, trend: 'stable', color: 'brand-blue' },
    { label: 'Actual Spent', val: `₹ ${(budgets.reduce((acc, b) => acc + b.actual, 0) / 10000000).toFixed(2)} Cr`, icon: TrendingUp, trend: 'up', color: 'brand-teal' },
    { label: 'Variance Savings', val: `₹ ${((budgets.reduce((acc, b) => acc + b.allocated, 0) - budgets.reduce((acc, b) => acc + b.actual, 0)) / 100000).toFixed(2)} L`, icon: TrendingDown, trend: 'down', color: 'brand-success' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Budgeting & Variance</h1>
          <p className="text-brand-grey-dark/50">Fiscal planning and department-wise expenditure control</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Target className="w-5 h-5" />
          Create New Budget
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
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
                        <Calculator className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-brand-blue">Configure Department Budget</h2>
                </div>
                <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-5 h-5 text-brand-grey-dark/40" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Select Department</label>
                  <select 
                    value={formData.dept}
                    onChange={(e) => setFormData({...formData, dept: e.target.value})}
                    className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                  >
                    <option>Marketing</option>
                    <option>IT Systems</option>
                    <option>Staffing</option>
                    <option>Operations</option>
                    <option>R&D</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Allocated Amount (₹)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.allocated}
                      onChange={(e) => setFormData({...formData, allocated: Number(e.target.value)})}
                      className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Actual Spent (₹)</label>
                    <input 
                      type="number" 
                      value={formData.actual}
                      onChange={(e) => setFormData({...formData, actual: Number(e.target.value)})}
                      className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-blue-900/20 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  Authorize & Initialize Budget
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] card-shadow border border-brand-grey-dark/5">
            <h3 className="text-xl font-display font-bold text-brand-blue mb-8">Quarterly Budget Health</h3>
            <div className="space-y-10">
                {[
                    { label: 'Utilized Amount', val: `${((budgets.reduce((acc, b) => acc + b.actual, 0) / budgets.reduce((acc, b) => acc + b.allocated, 0)) * 100).toFixed(0)}%`, color: 'bg-brand-teal' },
                    { label: 'Remaining Credits', val: `${(100 - (budgets.reduce((acc, b) => acc + b.actual, 0) / budgets.reduce((acc, b) => acc + b.allocated, 0)) * 100).toFixed(0)}%`, color: 'bg-brand-grey-dark/10' },
                ].map(item => (
                    <div key={item.label} className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-sm font-bold text-brand-blue/60 uppercase tracking-widest">{item.label}</span>
                            <span className="text-2xl font-display font-black text-brand-blue">{item.val}</span>
                        </div>
                        <div className="h-4 bg-brand-grey-light rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: item.val }} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 p-6 bg-blue-50 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-brand-blue shrink-0" />
                <p className="text-xs text-brand-blue/80 font-medium leading-relaxed italic">
                    Note: Department-wise variances exceeding 10% for two consecutive months will trigger an auto-audit report for the management.
                </p>
            </div>
        </div>

        <div className="space-y-6">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl card-shadow border border-brand-grey-dark/5 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl bg-${stat.color === 'brand-blue' ? 'blue-50' : stat.color === 'brand-teal' ? 'teal-50' : 'green-50'}`}>
                            <stat.icon className={`w-8 h-8 ${stat.color === 'brand-blue' ? 'text-brand-blue' : stat.color === 'brand-teal' ? 'text-brand-teal' : 'text-brand-success'}`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-brand-grey-dark/40 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-display font-bold text-brand-blue tracking-tight">{stat.val}</h3>
                        </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-brand-grey-dark/20 group-hover:text-brand-teal transition-colors" />
                </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] card-shadow border border-brand-grey-dark/5 overflow-hidden">
        <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
            <h3 className="text-xl font-display font-bold text-brand-blue">Department Performance</h3>
            <button 
              onClick={() => handleDownload('Budget_Variance_Analysis')}
              className="p-2.5 rounded-xl border border-brand-grey-dark/10 hover:bg-white transition-colors"
            >
              <Download className="w-4 h-4 text-brand-grey-dark/60" />
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-brand-grey-light/20">
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Department</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">Allocated</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">Actual</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">Variance</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-center">Outcome</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-grey-dark/5 text-sm">
                    {budgets.map(b => (
                        <tr key={b.dept} className="hover:bg-brand-grey-light/10">
                            <td className="px-6 py-4 font-bold text-brand-blue">{b.dept}</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-brand-blue/40 italic">₹{b.allocated.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-brand-blue">₹{b.actual.toLocaleString()}</td>
                            <td className={`px-6 py-4 text-right font-mono font-bold ${b.allocated - b.actual >= 0 ? 'text-brand-success' : 'text-brand-error'}`}>₹{Math.abs(b.allocated - b.actual).toLocaleString()}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${b.actual <= b.allocated ? 'bg-green-50 text-brand-success' : 'bg-red-50 text-brand-error'}`}>
                                    {b.actual <= b.allocated ? 'Within' : 'Over'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
