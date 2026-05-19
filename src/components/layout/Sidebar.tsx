import React from 'react';
import { 
  BarChart3, 
  Building2, 
  Users, 
  ShoppingCart, 
  BookOpen, 
  Banknote, 
  Boxes, 
  UserCircle, 
  Warehouse, 
  Calculator, 
  ShieldCheck, 
  FileText,
  LogOut,
  Briefcase
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { ModuleType } from '../../types';

interface NavItem {
  id: ModuleType;
  label: string;
  icon: any;
}

const NAVIGATION: NavItem[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'CompanySetup', label: 'Company Setup', icon: Building2 },
  { id: 'Masters', label: 'Masters (B2B/B2C)', icon: Briefcase },
  { id: 'AR', label: 'Receivables (AR)', icon: Users },
  { id: 'AP', label: 'Payables (AP)', icon: ShoppingCart },
  { id: 'GL', label: 'General Ledger', icon: BookOpen },
  { id: 'CashBank', label: 'Cash & Bank', icon: Banknote },
  { id: 'Inventory', label: 'Inventory', icon: Boxes },
  { id: 'Payroll', label: 'Payroll & HR', icon: UserCircle },
  { id: 'FixedAssets', label: 'Fixed Assets', icon: Warehouse },
  { id: 'Budgeting', label: 'Budgeting', icon: Calculator },
  { id: 'Taxation', label: 'Taxation', icon: ShieldCheck },
  { id: 'Reports', label: 'Reports', icon: FileText },
];

export default function Sidebar() {
  const { currentCompany, activeModule, setActiveModule, logout } = useAppContext();

  return (
    <div className="w-72 h-screen branding-gradient text-white flex flex-col fixed left-0 top-0 z-40 shadow-2xl">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 border-[3px] border-brand-blue rounded-sm"></div>
          </div>
          <h1 className="text-lg font-display font-bold tracking-tight leading-none uppercase">
            AFMS <span className="opacity-60 font-light">Core</span>
          </h1>
        </div>
        <p className="text-[9px] uppercase tracking-[0.2em] font-black opacity-40 ml-11">Digital Communique</p>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {NAVIGATION.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
              activeModule === item.id 
                ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20' 
                : 'hover:bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeModule === item.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
            <span className="font-medium text-sm tracking-wide">{item.label}</span>
            
            {activeModule === item.id && (
              <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 space-y-4">
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-xs text-white/40 mb-2 uppercase tracking-widest font-bold font-sans">Financial Year</p>
          <p className="text-sm font-semibold select-none group-hover:text-brand-teal transition-colors">{currentCompany?.financialYear || '2024 - 2025'}</p>
        </div>
        
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 py-4 bg-brand-error text-white rounded-2xl font-bold tracking-widest uppercase text-[10px] shadow-lg shadow-brand-error/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
