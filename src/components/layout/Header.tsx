import React from 'react';
import { Bell, Search, User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Header() {
  const { currentCompany, user, logout, activeModule } = useAppContext();

  return (
    <header className="h-20 bg-white border-b border-brand-grey-dark/5 flex items-center justify-between px-10 sticky top-0 z-30 ml-72">
      <div className="flex items-center gap-8">
        <div>
          <h2 className="text-xl font-display font-bold text-brand-blue">{activeModule}</h2>
          <p className="text-xs text-brand-grey-dark/50 font-medium">
            {currentCompany?.name} • FY {currentCompany?.financialYear}
          </p>
        </div>

        <div className="hidden md:flex items-center bg-brand-grey-light px-4 py-2 rounded-full w-96 gap-3">
          <Search className="w-4 h-4 text-brand-grey-dark/40" />
          <input 
            type="text" 
            placeholder="Search transactions, accounts, vendors..." 
            className="bg-transparent border-none outline-none text-sm w-full text-brand-grey-dark"
          />
          <span className="text-[10px] font-bold text-brand-grey-dark/30 bg-white px-2 py-0.5 rounded shadow-sm">⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-full hover:bg-brand-grey-light relative transition-colors">
                <Bell className="w-5 h-5 text-brand-grey-dark/60" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-error rounded-full border-2 border-white" />
            </button>
            <button className="p-2.5 rounded-full hover:bg-brand-grey-light transition-colors">
                <Settings className="w-5 h-5 text-brand-grey-dark/60" />
            </button>
            <button className="p-2.5 rounded-full hover:bg-brand-grey-light transition-colors">
                <HelpCircle className="w-5 h-5 text-brand-grey-dark/60" />
            </button>
        </div>

        <div className="h-8 w-[1px] bg-brand-grey-dark/10" />

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-brand-blue">{user?.name}</p>
            <p className="text-[10px] uppercase font-bold text-brand-teal tracking-tighter">{user?.role}</p>
          </div>
          <div className="group relative">
            <button className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center text-white font-bold ring-4 ring-brand-teal/10 hover:ring-brand-teal/20 transition-all">
              {user?.name.charAt(0)}
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-brand-grey-dark/5 py-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
              <div className="px-6 py-3 border-b border-brand-grey-dark/5 mb-2">
                <p className="text-xs font-black text-brand-grey-dark/30 uppercase tracking-widest">Account Settings</p>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-brand-error hover:bg-red-50 transition-colors"
                title="Logout from session"
              >
                <div className="p-2 bg-red-100 rounded-xl">
                  <LogOut className="w-4 h-4" />
                </div>
                Secure Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
