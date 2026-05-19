import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const REVENUE_DATA = [
  { month: 'Apr', income: 450000, expense: 320000 },
  { month: 'May', income: 520000, expense: 380000 },
  { month: 'Jun', income: 480000, expense: 410000 },
  { month: 'Jul', income: 610000, expense: 430000 },
  { month: 'Aug', income: 590000, expense: 400000 },
  { month: 'Sep', income: 720000, expense: 450000 },
];

const BUDGET_DATA = [
  { name: 'Payroll', actual: 45000, budget: 50000 },
  { name: 'Marketing', actual: 28000, budget: 25000 },
  { name: 'Operational', actual: 15000, budget: 20000 },
  { name: 'Tech', actual: 35000, budget: 35000 },
];

const CATEGORY_DATA = [
  { name: 'Services', value: 400 },
  { name: 'Retail', value: 300 },
  { name: 'Other', value: 200 },
];

const COLORS = ['#1E3A8A', '#0D9488', '#F59E0B'];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Income', value: '₹12,45,000', change: '+12.5%', icon: TrendingUp, color: 'text-brand-success', bg: 'bg-green-50' },
          { label: 'Total Expenses', value: '₹8,24,500', change: '+4.2%', icon: TrendingDown, color: 'text-brand-error', bg: 'bg-red-50' },
          { label: 'Net Profit', value: '₹4,20,500', change: '+24.1%', icon: DollarSign, color: 'text-brand-blue', bg: 'bg-blue-50' },
          { label: 'Pending Invoices', value: '₹1,12,000', change: '8 Overdue', icon: AlertCircle, color: 'text-brand-warning', bg: 'bg-amber-50' },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl card-shadow border border-brand-grey-dark/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.bg} ${item.color}`}>
                {item.change}
              </span>
            </div>
            <p className="text-xs font-bold text-brand-grey-dark/40 uppercase tracking-widest mb-1">{item.label}</p>
            <h3 className="text-2xl font-display font-bold text-brand-blue">{item.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white p-8 rounded-[2rem] card-shadow border border-brand-grey-dark/5"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-display font-bold text-brand-blue">Cash Flow Overview</h3>
              <p className="text-sm text-brand-grey-dark/40">Income vs Expenses for the last 6 months</p>
            </div>
            <select className="bg-brand-grey-light border-none rounded-xl text-xs font-bold py-2 px-4 outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                    tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="income" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#income)" />
                <Area type="monotone" dataKey="expense" stroke="#DC2626" strokeWidth={3} fillOpacity={1} fill="url(#expense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expense Distribution */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[2rem] card-shadow border border-brand-grey-dark/5 flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-xl font-display font-bold text-brand-blue">Expense Split</h3>
            <p className="text-sm text-brand-grey-dark/40">By category</p>
          </div>
          
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {CATEGORY_DATA.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-brand-blue">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Variance */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2rem] card-shadow border border-brand-grey-dark/5"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-display font-bold text-brand-blue">Budget vs Actual</h3>
            <button className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1">
              View Detailed Budget <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUDGET_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="budget" fill="#E5E7EB" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="actual" fill="#1E3A8A" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2rem] card-shadow border border-brand-grey-dark/5"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-display font-bold text-brand-blue">Critical Alerts</h3>
            <span className="bg-red-50 text-brand-error text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">Action Required</span>
          </div>

          <div className="space-y-6">
            {[
              { type: 'TAX', msg: 'GST GSTR-3B Filing Due in 2 Days', status: 'High', icon: AlertCircle, color: 'text-brand-error', bg: 'bg-red-50' },
              { type: 'INVOICE', msg: 'Inv #892 (Creative Studio) is 15 Days Overdue', status: 'Moderate', icon: Clock, color: 'text-brand-warning', bg: 'bg-amber-50' },
              { type: 'VENDOR', msg: 'Vendor Payment for AWS Services Pending', status: 'Low', icon: ArrowDownLeft, color: 'text-brand-blue', bg: 'bg-blue-50' },
            ].map((alert, idx) => (
              <div key={idx} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                <div className={`p-4 rounded-2xl ${alert.bg}`}>
                    <alert.icon className={`w-5 h-5 ${alert.color}`} />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-brand-grey-dark/30 uppercase tracking-widest">{alert.type}</p>
                    <p className="text-sm font-semibold text-brand-blue leading-snug">{alert.msg}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-brand-grey-dark/20 group-hover:text-brand-teal transition-colors" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
