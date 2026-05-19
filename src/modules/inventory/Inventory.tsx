import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Boxes, 
  Trash2, 
  Plus, 
  Search, 
  ArrowDownCircle, 
  ArrowUpCircle,
  AlertTriangle,
  Download,
  X,
  Sparkles,
  RefreshCw,
  Package,
  Layers
} from 'lucide-react';
import { handleDownload } from '../../utils/helpers';
import { fetchHSNCode } from '../../services/aiService';
import { useAppContext } from '../../context/AppContext';
import { InventoryItem } from '../../types';

export default function Inventory() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loadingHSN, setLoadingHSN] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newItem, setNewItem] = useState<{
    name: string;
    cat: string;
    qty: number;
    value: number;
    hsn: string;
    type: 'Product' | 'Service';
  }>({
    name: '',
    cat: 'Electronics',
    qty: 0,
    value: 0,
    hsn: '',
    type: 'Product'
  });

  const handleFetchHSN = async () => {
    if (!newItem.name) return;
    setLoadingHSN(true);
    const code = await fetchHSNCode(newItem.name);
    if (code) {
      setNewItem(prev => ({ ...prev, hsn: code }));
    }
    setLoadingHSN(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: InventoryItem = {
      ...newItem,
      id: `ITM-${(inventory.length + 1).toString().padStart(3, '0')}`,
      status: newItem.qty > 10 ? 'In Stock' : (newItem.type === 'Service' ? 'Active' : 'Low Stock'),
      qty: Number(newItem.qty),
      value: Number(newItem.value)
    };
    addInventoryItem(item);
    setIsAdding(false);
    setNewItem({ name: '', cat: 'Electronics', qty: 0, value: 0, hsn: '', type: 'Product' });
  };

  const updateQty = (id: string, delta: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.qty + delta);
    updateInventoryItem(id, { 
      qty: newQty, 
      status: newQty > 10 ? 'In Stock' : (item.type === 'Service' ? 'Active' : 'Low Stock') 
    });
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.hsn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Inventory & Services</h1>
          <p className="text-brand-grey-dark/50">Manage your products, service offerings, and HSN codes</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-5 h-5" />
          Add Item / Service
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-brand-blue/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-brand-grey-dark/5"
            >
              <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                <h2 className="text-xl font-display font-bold text-brand-blue">Master Ledger Entry</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-5 h-5 text-brand-grey-dark/40" />
                </button>
              </div>
              
              <form onSubmit={handleAddItem} className="p-8 space-y-5">
                <div className="flex bg-brand-grey-light p-1 rounded-2xl">
                  {['Product', 'Service'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewItem({...newItem, type: t as any, cat: t === 'Service' ? 'Services' : newItem.cat})}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${newItem.type === t ? 'bg-white shadow-sm text-brand-blue' : 'text-brand-grey-dark/40 hover:text-brand-blue'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      onBlur={handleFetchHSN}
                      placeholder={newItem.type === 'Product' ? "e.g. Wireless Mouse" : "e.g. Software Consultation"}
                      className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all pr-12"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {loadingHSN ? <RefreshCw className="w-4 h-4 text-brand-teal animate-spin" /> : <Sparkles className="w-4 h-4 text-brand-teal opacity-40" />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Category</label>
                    <input 
                      type="text"
                      list="categories"
                      value={newItem.cat}
                      onChange={(e) => setNewItem({...newItem, cat: e.target.value})}
                      className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                    />
                    <datalist id="categories">
                      <option value="Electronics" />
                      <option value="Furniture" />
                      <option value="Stationery" />
                      <option value="Software" />
                      <option value="Services" />
                      <option value="Consultancy" />
                    </datalist>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">HSN/SAC Code</label>
                    <input 
                      type="text" 
                      required
                      value={newItem.hsn}
                      onChange={(e) => setNewItem({...newItem, hsn: e.target.value})}
                      placeholder="Auto-suggested"
                      className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-mono font-bold text-brand-teal focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">{newItem.type === 'Product' ? 'Quantity' : 'Initial Units'}</label>
                    <input 
                      type="number" 
                      required
                      value={newItem.qty}
                      onChange={(e) => setNewItem({...newItem, qty: Number(e.target.value)})}
                      className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Rate (₹)</label>
                    <input 
                      type="number" 
                      required
                      value={newItem.value}
                      onChange={(e) => setNewItem({...newItem, value: Number(e.target.value)})}
                      className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-blue-900/10 hover:scale-[1.01] active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  {newItem.type === 'Product' ? <Package className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                  Register {newItem.type}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Asset Value', value: `₹${inventory.reduce((acc, curr) => acc + (curr.qty * curr.value), 0).toLocaleString()}`, icon: Boxes, color: 'brand-blue' },
          { label: 'Product Count', value: inventory.filter(i => i.type === 'Product').length.toString().padStart(2, '0'), icon: Package, color: 'brand-teal' },
          { label: 'Active Services', value: inventory.filter(i => i.type === 'Service').length.toString().padStart(2, '0'), icon: Layers, color: 'brand-success' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl card-shadow border border-brand-grey-dark/5 flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-${item.color === 'brand-blue' ? 'blue-50' : item.color === 'brand-teal' ? 'teal-50' : 'green-50'}`}>
                <item.icon className={`w-8 h-8 ${item.color === 'brand-blue' ? 'text-brand-blue' : item.color === 'brand-teal' ? 'text-brand-teal' : 'text-brand-success'}`} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-brand-grey-dark/40 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                <h3 className={`text-2xl font-display font-bold text-brand-blue tracking-tight`}>{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] card-shadow border border-brand-grey-dark/5 overflow-hidden">
        <div className="p-6 border-b border-brand-grey-dark/5 flex justify-between items-center">
            <h3 className="text-xl font-display font-bold text-brand-blue">Masters & Ledger</h3>
            <div className="flex items-center gap-3">
                <div className="flex bg-brand-grey-light px-4 py-2 rounded-xl w-64 gap-3">
                    <Search className="w-4 h-4 text-brand-grey-dark/40 mt-1" />
                    <input 
                      type="text" 
                      placeholder="Search name, category, hsn..." 
                      className="bg-transparent border-none outline-none text-sm w-full" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                  onClick={() => handleDownload('Master_Inventory_Ledger')}
                  className="p-2.5 rounded-xl border border-brand-grey-dark/10 hover:bg-brand-grey-light transition-colors"
                >
                  <Download className="w-4 h-4 text-brand-grey-dark/60" />
                </button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-grey-light/30">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Item details</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">HSN/SAC</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-center">Stock/Units</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">Standard Rate</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey-dark/5 text-sm">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-brand-grey-light/10 group transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${item.type === 'Product' ? 'bg-blue-50 text-brand-blue' : 'bg-teal-50 text-brand-teal'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-brand-blue">{item.name}</p>
                    <p className="text-[10px] text-brand-grey-dark/30 font-bold uppercase tracking-tighter">{item.cat}</p>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-brand-teal">{item.hsn}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {item.type === 'Product' && (
                        <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-md bg-brand-grey-light flex items-center justify-center hover:bg-red-50 hover:text-brand-error transition-colors">-</button>
                      )}
                      <span className={`font-bold w-8 ${item.status === 'Low Stock' ? 'text-brand-error' : 'text-brand-blue'}`}>{item.qty}</span>
                      {item.type === 'Product' && (
                        <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-md bg-brand-grey-light flex items-center justify-center hover:bg-green-50 hover:text-brand-success transition-colors">+</button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-brand-blue">₹{item.value.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => deleteInventoryItem(item.id)}
                        className="p-2 hover:bg-red-50 hover:text-brand-error rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
