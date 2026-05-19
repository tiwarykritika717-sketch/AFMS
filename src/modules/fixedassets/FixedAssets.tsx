import React from 'react';
import { motion } from 'motion/react';
import { 
  Warehouse, 
  Plus, 
  ArrowDownCircle, 
  Calendar, 
  Settings, 
  Calculator,
  ChevronRight
} from 'lucide-react';
import { handleDownload } from '../../utils/helpers';

const ASSETS = [
  { id: 'AST-001', name: 'MacBook Pro Fleet', cat: 'IT Equipment', date: '2023-12-01', cost: 1200000, dep: '20% WDV' },
  { id: 'AST-002', name: 'Office Interior', cat: 'Furniture', date: '2024-01-15', cost: 450000, dep: '10% SLM' },
  { id: 'AST-003', name: 'Company Vehicle', cat: 'Vehicles', date: '2023-08-10', cost: 850000, dep: '15% WDV' },
];

export default function FixedAssets() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Fixed Assets</h1>
          <p className="text-brand-grey-dark/50">Asset register and depreciation schedule management</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleDownload('Depreciation_Schedule_Report')}
            className="px-6 py-3 border border-brand-grey-dark/10 bg-white text-brand-blue rounded-xl font-bold hover:bg-brand-grey-light transition-all flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Depreciation Run
          </button>
          <button className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-transform">
            <Plus className="w-5 h-5" />
            Acquire New Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Gross Block', value: '₹25,00,000', icon: Warehouse, color: 'text-brand-blue', bg: 'bg-blue-50' },
          { label: 'Accumulated Dep.', value: '₹4,50,000', icon: ArrowDownCircle, color: 'text-brand-error', bg: 'bg-red-50' },
          { label: 'Net Block', value: '₹20,50,000', icon: Calculator, color: 'text-brand-success', bg: 'bg-green-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl card-shadow border border-brand-grey-dark/5">
             <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${item.bg}`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-brand-grey-dark/40 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                    <h3 className="text-2xl font-display font-bold text-brand-blue tracking-tight">{item.value}</h3>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] card-shadow border border-brand-grey-dark/5 overflow-hidden">
        <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center">
            <h3 className="text-xl font-display font-bold text-brand-blue">Fixed Asset Register</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-teal uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                Next Depreciation: June 30, 2024
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
                <thead>
                    <tr className="bg-brand-grey-light/30">
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Asset ID</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Asset Name</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">Cost at Pur.</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Dep. Method</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-grey-dark/5 text-sm">
                    {ASSETS.map(asset => (
                        <tr key={asset.id} className="hover:bg-brand-grey-light/10">
                            <td className="px-6 py-4 font-bold text-brand-blue/40">{asset.id}</td>
                            <td className="px-6 py-4">
                                <p className="font-bold text-brand-blue">{asset.name}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-brand-teal/60 uppercase">{asset.cat}</span>
                                    <span className="text-[10px] text-brand-grey-dark/30">• Pur: {asset.date}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-brand-blue italic">₹{asset.cost.toLocaleString()}</td>
                            <td className="px-6 py-4 font-bold text-brand-blue/60">{asset.dep}</td>
                            <td className="px-6 py-4 text-center">
                                <button className="p-2 hover:bg-brand-grey-light rounded-lg transition-colors group">
                                    <ChevronRight className="w-4 h-4 text-brand-grey-dark/20 group-hover:text-brand-teal" />
                                </button>
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
