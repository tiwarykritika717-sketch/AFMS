import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Truck,
  X,
  FilePlus,
  Trash2
} from 'lucide-react';
import { handleDownload } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';

const INITIAL_VENDOR_INVOICES = [
  { id: 'PUR-2024-081', vendor: 'Amazon Web Services', date: '2024-05-01', amount: 8500, status: 'Paid', due: '2024-05-15' },
  { id: 'PUR-2024-082', vendor: 'Office Depot', date: '2024-05-10', amount: 3200, status: 'Pending', due: '2024-06-10' },
  { id: 'PUR-2024-083', vendor: 'Corporate Realty', date: '2024-05-15', amount: 150000, status: 'Overdue', due: '2024-05-30' },
  { id: 'PUR-2024-084', vendor: 'Digital Ocean', date: '2024-05-20', amount: 4200, status: 'Paid', due: '2024-06-20' },
  { id: 'PUR-2024-085', vendor: 'Tata Communications', date: '2024-05-25', amount: 12500, status: 'Partially Paid', due: '2024-06-25' },
];

export default function AccountsPayable() {
  const { inventory } = useAppContext();
  const [invoices, setInvoices] = useState(INITIAL_VENDOR_INVOICES);
  const [isCreating, setIsCreating] = useState(false);
  const [items, setItems] = useState([{ productId: '', qty: 1, rate: 0, hsn: '' }]);
  const [vendor, setVendor] = useState('');

  const addItemRow = () => {
    setItems([...items, { productId: '', qty: 1, rate: 0, hsn: '' }]);
  };

  const removeItemRow = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleProductChange = (idx: number, productId: string) => {
    const product = inventory.find(p => p.id === productId);
    const newItems = [...items];
    newItems[idx] = {
      ...newItems[idx],
      productId,
      hsn: product?.hsn || '',
      rate: product?.value || 0
    };
    setItems(newItems);
  };

  const totalAmount = items.reduce((acc, curr) => acc + (curr.qty * curr.rate), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv = {
      id: `PUR-2024-${(invoices.length + 81).toString().padStart(3, '0')}`,
      vendor,
      date: new Date().toISOString().split('T')[0],
      amount: totalAmount,
      status: 'Pending',
      due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setInvoices([newInv, ...invoices]);
    setIsCreating(false);
    setItems([{ productId: '', qty: 1, rate: 0, hsn: '' }]);
    setVendor('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Vendor Payables</h1>
          <p className="text-brand-grey-dark/50">Manage purchase invoices and vendor payments</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-5 h-5" />
          Add Purchase Invoice
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 bg-brand-blue/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden border border-brand-grey-dark/5 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-teal rounded-2xl">
                        <FilePlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-brand-blue">Register Purchase Invoice</h2>
                        <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest">Inward Supply Recording</p>
                    </div>
                </div>
                <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-5 h-5 text-brand-grey-dark/40" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Vendor / Supplier Name</label>
                      <input 
                        type="text" 
                        required
                        value={vendor}
                        onChange={(e) => setVendor(e.target.value)}
                        placeholder="Search for vendor..."
                        className="w-full px-6 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Purchase Date</label>
                      <input 
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full px-6 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-brand-blue/40 uppercase tracking-widest">Purchased Items</h3>
                        <button 
                            type="button"
                            onClick={addItemRow}
                            className="text-xs font-bold text-brand-teal flex items-center gap-1 hover:underline"
                        >
                            <Plus className="w-3 h-3" /> Add Item
                        </button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-3 items-end">
                                <div className="col-span-12 md:col-span-4 space-y-1">
                                    <label className="text-[9px] font-black text-brand-grey-dark/30 uppercase ml-1">Description</label>
                                    <select 
                                        value={item.productId}
                                        onChange={(e) => handleProductChange(idx, e.target.value)}
                                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                                    >
                                        <option value="">Select Item</option>
                                        {inventory.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-4 md:col-span-2 space-y-1">
                                    <label className="text-[9px] font-black text-brand-grey-dark/30 uppercase ml-1">HSN/SAC</label>
                                    <input 
                                        type="text" 
                                        readOnly
                                        value={item.hsn}
                                        placeholder="Auto"
                                        className="w-full px-4 py-3 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-xl text-xs font-mono font-bold text-brand-teal focus:outline-none"
                                    />
                                </div>
                                <div className="col-span-4 md:col-span-2 space-y-1">
                                    <label className="text-[9px] font-black text-brand-grey-dark/30 uppercase ml-1">Qty</label>
                                    <input 
                                        type="number" 
                                        value={item.qty}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[idx].qty = Number(e.target.value);
                                            setItems(newItems);
                                        }}
                                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                                    />
                                </div>
                                <div className="col-span-4 md:col-span-3 space-y-1">
                                    <label className="text-[9px] font-black text-brand-grey-dark/30 uppercase ml-1">Unit Price (₹)</label>
                                    <input 
                                        type="number" 
                                        value={item.rate}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[idx].rate = Number(e.target.value);
                                            setItems(newItems);
                                        }}
                                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-1 flex items-center justify-end pb-3">
                                    {items.length > 1 && (
                                        <button 
                                            type="button"
                                            onClick={() => removeItemRow(idx)}
                                            className="text-brand-error hover:scale-110 transition-transform"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-brand-grey-dark/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest">Total Payable Amount</p>
                        <h4 className="text-4xl font-display font-black text-brand-blue">₹ {totalAmount.toLocaleString()}</h4>
                    </div>
                    <button 
                      type="submit"
                      className="px-12 py-5 bg-brand-blue text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Record Purchase
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Outstanding Payables', value: `₹${invoices.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}`, sub: `across ${invoices.length} invoices`, color: 'text-brand-error' },
          { label: 'Due This Week', value: '₹12,400', sub: 'scheduled for payment', color: 'text-brand-warning' },
          { label: 'Total Paid YTD', value: '₹24,50,000', sub: 'Financial Year 2024-25', color: 'text-brand-success' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl card-shadow border border-brand-grey-dark/5">
            <p className="text-[10px] font-bold text-brand-grey-dark/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</h3>
            <p className="text-xs text-brand-grey-dark/40 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] card-shadow border border-brand-grey-dark/5 overflow-hidden">
        <div className="p-6 border-b border-brand-grey-dark/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-brand-grey-light px-4 py-2 rounded-xl w-full md:w-80 gap-3">
            <Search className="w-4 h-4 text-brand-grey-dark/40 mt-0.5" />
            <input 
              type="text" 
              placeholder="Filter by vendor..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <div className="flex gap-3">
            <button className="p-2.5 rounded-xl border border-brand-grey-dark/10 hover:bg-brand-grey-light transition-colors"><Filter className="w-4 h-4" /></button>
            <button 
              onClick={() => handleDownload('Purchase_Invoices')}
              className="p-2.5 rounded-xl border border-brand-grey-dark/10 hover:bg-brand-grey-light transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-grey-light/30">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Inv Date</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Vendor</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey-dark/5">
              {invoices.map((inv, idx) => (
                <tr key={inv.id} className="hover:bg-brand-grey-light/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-brand-blue">{inv.date}</p>
                    <p className="text-[10px] font-bold text-brand-grey-dark/30">{inv.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-grey-light flex items-center justify-center">
                        <Truck className="w-4 h-4 text-brand-blue" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-blue">{inv.vendor}</p>
                        <p className="text-[10px] text-brand-teal font-bold uppercase">Authorized Supplier</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-blue">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inv.status === 'Paid' ? 'bg-green-50 text-brand-success' :
                      inv.status === 'Overdue' ? 'bg-red-50 text-brand-error' :
                      'bg-amber-50 text-brand-warning'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-brand-grey-light rounded-lg"><MoreVertical className="w-4 h-4 text-brand-grey-dark/40" /></button>
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
