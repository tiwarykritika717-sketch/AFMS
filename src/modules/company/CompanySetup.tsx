import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Settings2,
  Calendar,
  Phone,
  Mail,
  Camera,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { validateGSTIN } from '../../utils/helpers';

export default function CompanySetup() {
  const { currentCompany, updateCompany } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [gstError, setGstError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    financialYear: '',
    gstin: '',
    pan: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
    bankName: '',
    accountNo: '',
    ifscCode: '',
    branchName: '',
  });

  const [isCustomYear, setIsCustomYear] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Initialize form data when entering edit mode or on mount
  useEffect(() => {
    if (currentCompany) {
      const isPredefinedYear = ['2023-24', '2024-25', '2025-26'].includes(currentCompany.financialYear || '');
      setFormData({
        name: currentCompany.name || '',
        financialYear: currentCompany.financialYear || '',
        gstin: currentCompany.gstin || '',
        pan: currentCompany.pan || '',
        address: currentCompany.address || '',
        phone: currentCompany.phone || '',
        email: currentCompany.email || '',
        logo: currentCompany.logo || '',
        bankName: currentCompany.bankName || '',
        accountNo: currentCompany.accountNo || '',
        ifscCode: currentCompany.ifscCode || '',
        branchName: currentCompany.branchName || '',
      });
      setIsCustomYear(!isPredefinedYear && !!currentCompany.financialYear);
    }
  }, [currentCompany]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (formData.gstin && !validateGSTIN(formData.gstin)) {
      setGstError('Invalid GSTIN format. Please enter a valid 15-digit GSTIN.');
      return;
    }
    setGstError('');

    setSaveStatus('saving');
    
    // Simulate API delay
    setTimeout(() => {
      updateCompany(formData);
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  const handleYearChange = (val: string) => {
    if (val === 'custom') {
      setIsCustomYear(true);
      setFormData(prev => ({ ...prev, financialYear: '' }));
    } else {
      setIsCustomYear(false);
      setFormData(prev => ({ ...prev, financialYear: val }));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Company Settings</h1>
          <p className="text-brand-grey-dark/50">Configure your business identity and fiscal cycles</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-all"
          >
            <Settings2 className="w-5 h-5" />
            Update Profile
          </button>
        ) : (
          <div className="flex gap-3">
             <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-brand-grey-light text-brand-grey-dark/60 rounded-xl font-bold hover:bg-brand-grey-dark/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={saveStatus === 'saving'}
                className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {saveStatus === 'saving' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <Save className="w-5 h-5" />}
                {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
          </div>
        )}
      </div>

      {/* Floating Edit Button for better accessibility */}
      {!isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="fixed bottom-10 right-10 z-50 p-6 bg-brand-teal text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 group"
        >
          <Settings2 className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-bold pr-2">Update Company Profile</span>
        </button>
      )}

      {saveStatus === 'saved' && (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-success/10 text-brand-success p-4 rounded-2xl flex items-center gap-3 border border-brand-success/20 font-bold"
        >
            <CheckCircle2 className="w-5 h-5" />
            Company profile updated successfully!
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 card-shadow border border-brand-grey-dark/5 flex flex-col items-center text-center">
                <div className="relative group mb-6">
                    <div className="w-32 h-32 bg-brand-grey-light rounded-3xl overflow-hidden flex items-center justify-center border-2 border-brand-grey-dark/10 shadow-inner group-hover:border-brand-teal/30 transition-all relative">
                        {formData.logo ? (
                            <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <Building2 className="w-10 h-10 text-brand-grey-dark/20" />
                                <span className="text-[8px] font-black text-brand-grey-dark/30 uppercase">No Logo</span>
                            </div>
                        )}
                        {/* Hover overlay always triggerable on desktop */}
                        <label className="absolute inset-0 bg-brand-blue/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                            <Camera className="w-6 h-6 text-white mb-1" />
                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">Upload Logo</span>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const base64String = reader.result as string;
                                    setFormData(prev => ({ ...prev, logo: base64String }));
                                    if (!isEditing) {
                                      updateCompany({ logo: base64String });
                                      setSaveStatus('saved');
                                      setTimeout(() => setSaveStatus('idle'), 3000);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                        </label>
                    </div>
                    {/* Always visible Camera Badge for mobile/touch and clear desktop visibility */}
                    <label className="absolute -bottom-2 -right-2 p-2.5 bg-brand-teal text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center border-2 border-white z-10">
                        <Camera className="w-4 h-4" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const base64String = reader.result as string;
                                setFormData(prev => ({ ...prev, logo: base64String }));
                                if (!isEditing) {
                                  updateCompany({ logo: base64String });
                                  setSaveStatus('saved');
                                  setTimeout(() => setSaveStatus('idle'), 3000);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                    </label>
                </div>
                <h3 className="text-xl font-display font-bold text-brand-blue">{formData.name}</h3>
                <p className="text-xs text-brand-teal font-black uppercase tracking-widest mt-1">Admin Controlled</p>
                
                <div className="w-full h-[1px] bg-brand-grey-dark/5 my-6" />
                
                <div className="w-full space-y-4">
                    <div className="flex items-center gap-3 text-left">
                        <Mail className="w-4 h-4 text-brand-grey-dark/30" />
                        <div>
                            <p className="text-[10px] font-black text-brand-grey-dark/20 uppercase">Business Email</p>
                            <p className="text-sm font-semibold text-brand-grey-dark/70">{formData.email || 'Not set'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                        <Phone className="w-4 h-4 text-brand-grey-dark/30" />
                        <div>
                            <p className="text-[10px] font-black text-brand-grey-dark/20 uppercase">Primary Contact</p>
                            <p className="text-sm font-semibold text-brand-grey-dark/70">{formData.phone || 'Not set'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-brand-blue text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="text-md font-display font-bold mb-2">Audit Compliance</h4>
                    <p className="text-xs opacity-60 leading-relaxed">System logs for administrative changes are enabled. Every update is tracked for the 2024-25 audit cycle.</p>
                </div>
                <ShieldCheck className="absolute top-0 right-0 w-24 h-24 text-white opacity-5 translate-x-4 -translate-y-4" />
            </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 card-shadow border border-brand-grey-dark/5">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Legal Company Name</label>
                        <input 
                            type="text" 
                            disabled={!isEditing}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">GSTIN / Tax Registration</label>
                        <input 
                            type="text" 
                            disabled={!isEditing}
                            value={formData.gstin}
                            onChange={(e) => {
                                setFormData({...formData, gstin: e.target.value});
                                if (gstError) setGstError('');
                            }}
                            className={`w-full px-5 py-4 bg-brand-grey-light/50 border rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed ${gstError ? 'border-brand-error ring-1 ring-brand-error/20' : 'border-brand-grey-dark/5'}`}
                        />
                        {gstError && <p className="text-[10px] font-bold text-brand-error ml-1">{gstError}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Permanent Account Number (PAN)</label>
                        <input 
                            type="text" 
                            disabled={!isEditing}
                            value={formData.pan}
                            onChange={(e) => setFormData({...formData, pan: e.target.value})}
                            className="w-full px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="pt-4 col-span-1 md:col-span-2">
                        <h4 className="text-xs font-black text-brand-blue/30 uppercase tracking-widest mb-4">Bank Accounts Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Bank Name</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                                    className="w-full px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Account Number</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={formData.accountNo}
                                    onChange={(e) => setFormData({...formData, accountNo: e.target.value})}
                                    className="w-full px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">IFSC Code</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={formData.ifscCode}
                                    onChange={(e) => setFormData({...formData, ifscCode: e.target.value})}
                                    className="w-full px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Branch Name</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={formData.branchName}
                                    onChange={(e) => setFormData({...formData, branchName: e.target.value})}
                                    className="w-full px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Financial Year</label>
                            <div className="flex gap-2">
                                <select 
                                    disabled={!isEditing}
                                    value={isCustomYear ? 'custom' : formData.financialYear}
                                    onChange={(e) => handleYearChange(e.target.value)}
                                    className="flex-1 px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <option value="2023-24">2023 - 2024</option>
                                    <option value="2024-25">2024 - 2025</option>
                                    <option value="2025-26">2025 - 2026</option>
                                    <option value="custom">-- Custom Period --</option>
                                </select>
                                {isCustomYear && (
                                    <input 
                                        type="text"
                                        placeholder="e.g. 2026-27"
                                        disabled={!isEditing}
                                        value={formData.financialYear}
                                        onChange={(e) => setFormData({...formData, financialYear: e.target.value})}
                                        className="w-32 px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:cursor-not-allowed"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Registered Address</label>
                        <textarea 
                            disabled={!isEditing}
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60 resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Contact Email</label>
                        <input 
                            type="email" 
                            disabled={!isEditing}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Phone Number</label>
                        <input 
                            type="text" 
                            disabled={!isEditing}
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-5 py-4 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal focus:bg-white transition-all disabled:opacity-60"
                        />
                    </div>
                </form>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex items-start gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Calendar className="w-6 h-6 text-brand-warning" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-brand-blue mb-1 uppercase tracking-tight">Period Locking Note</h4>
                   <p className="text-xs text-brand-grey-dark/60 leading-relaxed italic">
                        Changing the financial year will reload all ledger balances. Ensure your previous year books are closed and balances carried forward before updating this setting.
                   </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
