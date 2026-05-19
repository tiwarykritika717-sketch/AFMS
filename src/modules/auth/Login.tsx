import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Wallet, Receipt, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Login() {
  const [email, setEmail] = useState('adminbill');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) {
      setError(true);
      // Reset error after 3 seconds
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-[#F3F4F6] overflow-hidden">
      {/* Left Section: Geometric Branding Panel */}
      <div className="hidden lg:flex w-[400px] h-screen branding-gradient px-12 py-12 flex-col justify-between relative overflow-hidden shrink-0">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 border-4 border-[#1E3A8A] rounded-sm"></div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none font-display">
              Digital Communique<br />
              <span className="text-[10px] font-normal opacity-70 uppercase tracking-[0.2em]">Pvt Ltd</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#E0F2F1] text-lg font-medium italic"
          >
            “Smart Accounting. Simplified.”
          </motion.p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-[10px] uppercase tracking-widest text-teal-100 mb-6 font-bold opacity-80">AFMS | Financial Snapshot</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-teal-50 opacity-60 font-bold uppercase tracking-wider">Total Revenue (Q4)</p>
                  <p className="text-3xl font-bold leading-none text-white font-display">₹ 42,85,200</p>
                </div>
                <div className="px-2 py-1 bg-[#16A34A] text-[10px] rounded text-white font-bold mb-1 shadow-md shadow-green-900/20">
                  +12.4%
                </div>
              </div>
              
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="h-full bg-[#16A34A]" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <p className="text-[10px] text-teal-50 opacity-60 font-bold uppercase tracking-wider">Receivables</p>
                  <p className="text-md font-bold text-white">₹ 8,12,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-teal-50 opacity-60 font-bold uppercase tracking-wider">Payables</p>
                  <p className="text-md font-bold text-white">₹ 3,45,000</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Abstract Background Shapes */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-20 -right-20 w-60 h-60 border border-white opacity-[0.05] rounded-full" />
      </div>

      {/* Right Section: Refined Login Form */}
      <div className="flex-1 h-screen flex flex-col items-center justify-center px-8 lg:px-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-12 border border-brand-grey-dark/5"
        >
          <div className="mb-10 text-center">
            <h2 className="text-[28px] font-display font-black text-brand-blue leading-tight mb-2">Welcome Back</h2>
            <div className="h-1 w-12 bg-brand-teal mx-auto rounded-full mb-3" />
            <p className="text-brand-grey-dark/60 text-sm font-medium">Accounting & Financial Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-100 text-brand-error text-xs p-4 rounded-xl font-bold flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-error animate-pulse" />
                Invalid credentials. Please try again.
              </motion.div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-grey-dark/50 uppercase tracking-[0.15em] ml-1">Email / Username</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full px-5 py-4 bg-[#F9FAFB] border border-brand-grey-dark/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 transition-all text-brand-blue placeholder:text-brand-grey-dark/30"
                placeholder="adminbill"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-brand-grey-dark/50 uppercase tracking-[0.15em]">Password</label>
                <a href="#" className="text-[10px] font-black text-brand-teal uppercase hover:underline tracking-tight">Forgot Password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-5 py-4 bg-[#F9FAFB] border border-brand-grey-dark/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 transition-all text-brand-blue"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-2 py-1 px-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded-md border-brand-grey-dark/20 text-brand-teal focus:ring-brand-teal"
              />
              <label htmlFor="remember" className="text-xs text-brand-grey-dark/60 font-semibold tracking-tight">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-brand-teal hover:bg-[#0B7A70] text-white rounded-xl font-black text-xs tracking-[0.1em] uppercase shadow-xl shadow-teal-900/10 transition-all transform active:scale-[0.98]"
            >
              LOGIN TO DASHBOARD
            </button>
          </form>

          {/* Metadata Footer */}
          <div className="mt-10 pt-8 border-t border-brand-grey-dark/5 flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <span className="text-[9px] text-brand-grey-dark/40 font-bold uppercase tracking-widest">v4.2.0-STABLE</span>
                    <span className="text-[9px] text-brand-grey-dark/40 font-bold uppercase tracking-widest px-2 py-0.5 bg-brand-grey-light rounded">SECURE SSL</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-brand-success shadow-[0_0_8px_rgba(22,163,74,0.4)]" />
                    <span className="text-[9px] text-brand-grey-dark/50 font-bold uppercase tracking-tight">Optimal</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Compliance Badges */}
        <div className="mt-12 grid grid-cols-3 gap-10 opacity-30 pointer-events-none filter grayscale hover:grayscale-0 transition-all duration-700">
            <div className="text-center group">
                <div className="mx-auto w-8 h-1 bg-brand-grey-dark/20 mb-3 group-hover:bg-brand-teal transition-colors" />
                <p className="text-[10px] font-black text-brand-blue tracking-[0.1em]">GST COMPLIANT</p>
            </div>
            <div className="text-center group">
                <div className="mx-auto w-8 h-1 bg-brand-grey-dark/20 mb-3 group-hover:bg-brand-teal transition-colors" />
                <p className="text-[10px] font-black text-brand-blue tracking-[0.1em]">ISO 27001</p>
            </div>
            <div className="text-center group">
                <div className="mx-auto w-8 h-1 bg-brand-grey-dark/20 mb-3 group-hover:bg-brand-teal transition-colors" />
                <p className="text-[10px] font-black text-brand-blue tracking-[0.1em]">AUDIT READY</p>
            </div>
        </div>
      </div>
    </div>
  );
}
