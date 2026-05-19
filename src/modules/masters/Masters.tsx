import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  UserPlus, 
  Building2, 
  User, 
  MapPin, 
  Mail, 
  Phone,
  Trash2,
  X,
  ShieldCheck,
  Briefcase,
  Edit2
} from 'lucide-react';
import { handleDownload, validateGSTIN } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';

export default function Masters() {
  const { contacts, addContact, updateContact, deleteContact } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Customer' | 'Vendor'>('All');
  const [gstError, setGstError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'B2B',
    category: 'Customer',
    gstin: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Uttar Pradesh'
  });

  const handleEdit = (contact: any) => {
    setFormData({
      name: contact.name,
      type: contact.type,
      category: contact.category,
      gstin: contact.gstin || '',
      email: contact.email,
      phone: contact.phone,
      address: contact.address || '',
      city: contact.city,
      state: contact.state || 'Uttar Pradesh'
    });
    setEditingId(contact.id);
    setIsCreating(true);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(c => {
    const matchesTab = activeTab === 'All' ? true : c.category === activeTab;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.gstin || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.type === 'B2B' && formData.gstin) {
      if (!validateGSTIN(formData.gstin)) {
        setGstError('Invalid GSTIN format. Please enter a valid 15-digit GSTIN.');
        return;
      }
    }
    setGstError('');

    if (editingId) {
      updateContact(editingId, formData);
    } else {
      const newContact = {
        ...formData,
        id: (contacts.length + 1).toString(),
      };
      addContact(newContact);
    }

    setIsCreating(false);
    setEditingId(null);
    // Reset form
    setFormData({
        name: '',
        type: 'B2B',
        category: 'Customer',
        gstin: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: 'Uttar Pradesh'
    });
  };

  const handleModalClose = () => {
    setIsCreating(false);
    setEditingId(null);
    setGstError('');
    setFormData({
        name: '',
        type: 'B2B',
        category: 'Customer',
        gstin: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: 'Uttar Pradesh'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Masters & Contacts</h1>
          <p className="text-brand-grey-dark/50">Manage your business partners, customers, and vendors</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <UserPlus className="w-5 h-5" />
          Register New Contact
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 bg-brand-blue/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-brand-grey-dark/5 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-teal rounded-2xl text-white">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-brand-blue">{editingId ? 'Edit Master Record' : 'Add New Master Record'}</h2>
                        <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest">{editingId ? 'Modify Partner Details' : 'Customer & Vendor Onboarding'}</p>
                    </div>
                </div>
                <button onClick={handleModalClose} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-5 h-5 text-brand-grey-dark/40" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                        type="button"
                        onClick={() => setFormData({...formData, category: 'Customer'})}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${formData.category === 'Customer' ? 'border-brand-teal bg-teal-50 text-brand-teal' : 'border-brand-grey-dark/5 text-brand-grey-dark/40'}`}
                     >
                        <User className="w-5 h-5" /> Customer
                     </button>
                     <button 
                        type="button"
                        onClick={() => setFormData({...formData, category: 'Vendor'})}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${formData.category === 'Vendor' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-brand-grey-dark/5 text-brand-grey-dark/40'}`}
                     >
                        <Building2 className="w-5 h-5" /> Vendor
                     </button>
                  </div>

                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, type: 'B2B'})}
                            className={`p-3 rounded-xl border transition-all text-xs font-black uppercase tracking-widest ${formData.type === 'B2B' ? 'bg-brand-blue text-white' : 'bg-brand-grey-light text-brand-grey-dark/40'}`}
                        >
                            B2B (GST Registered)
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, type: 'B2C'})}
                            className={`p-3 rounded-xl border transition-all text-xs font-black uppercase tracking-widest ${formData.type === 'B2C' ? 'bg-brand-blue text-white' : 'bg-brand-grey-light text-brand-grey-dark/40'}`}
                        >
                            B2C (Consumer)
                        </button>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Legal Entity Name</label>
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Enter business or person name"
                            className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                        />
                     </div>

                     {formData.type === 'B2B' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">GSTIN Number</label>
                            <input 
                                type="text" 
                                required
                                value={formData.gstin}
                                onChange={(e) => {
                                    setFormData({...formData, gstin: e.target.value});
                                    if (gstError) setGstError('');
                                }}
                                placeholder="15-digit GST Registration"
                                className={`w-full px-5 py-4 bg-brand-grey-light border rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all uppercase ${gstError ? 'border-brand-error ring-1 ring-brand-error/20' : 'border-brand-grey-dark/5'}`}
                            />
                            {gstError && <p className="text-[10px] font-bold text-brand-error ml-1">{gstError}</p>}
                        </div>
                     )}

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Email Address</label>
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Phone Number</label>
                            <input 
                                type="text" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none transition-all"
                            />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Office Address</label>
                        <textarea 
                            rows={2}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full px-5 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all resize-none"
                        />
                     </div>
                  </div>

                  <div className="pt-6 border-t border-brand-grey-dark/5">
                    <button 
                      type="submit"
                      className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {editingId ? 'Update Master Details' : 'Authenticate & Save Master'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2rem] card-shadow border border-brand-grey-dark/5 overflow-hidden">
        <div className="p-6 border-b border-brand-grey-dark/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             {['All', 'Customer', 'Vendor'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-brand-blue text-white shadow-lg shadow-blue-900/10' : 'text-brand-grey-dark/40 hover:bg-brand-grey-light'}`}
                >
                    {tab} ({tab === 'All' ? contacts.length : contacts.filter(c => c.category === tab).length})
                </button>
             ))}
          </div>
          <div className="flex bg-brand-grey-light px-4 py-2 rounded-xl w-full md:w-64 gap-3">
            <Search className="w-4 h-4 text-brand-grey-dark/40 mt-0.5" />
            <input 
              type="text" 
              placeholder="Search masters..." 
              className="bg-transparent border-none outline-none text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-grey-light/30">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Partner Details</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Tax Identity</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey-dark/5">
              {filteredContacts.map(contact => (
                <tr key={contact.id} className="hover:bg-brand-grey-light/20 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${contact.category === 'Customer' ? 'bg-teal-50 text-brand-teal' : 'bg-blue-50 text-brand-blue'}`}>
                            {contact.category === 'Customer' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-brand-blue group-hover:text-brand-teal transition-colors">{contact.name}</p>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${contact.type === 'B2B' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                {contact.type} {contact.category}
                            </span>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {contact.gstin ? (
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3 h-3 text-brand-success" />
                            <span className="text-xs font-mono font-bold text-brand-blue">{contact.gstin}</span>
                        </div>
                    ) : (
                        <span className="text-[10px] font-bold text-brand-grey-dark/30 uppercase">No GST Registered</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 opacity-60">
                            <Mail className="w-3 h-3" />
                            <span className="text-xs">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-60">
                            <Phone className="w-3 h-3" />
                            <span className="text-xs font-medium">{contact.phone}</span>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleEdit(contact); }}
                            className="p-2 hover:bg-brand-grey-light rounded-lg transition-colors text-brand-blue"
                            title="Edit Contact"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDownload(contact.name); }}
                            className="p-2 hover:bg-brand-grey-light rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4 text-brand-grey-dark/40" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); deleteContact(contact.id); }}
                            className="p-2 hover:bg-white text-brand-error rounded-lg transition-colors border border-transparent hover:border-brand-error/10"
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
