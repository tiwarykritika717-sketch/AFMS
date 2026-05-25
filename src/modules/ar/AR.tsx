import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X,
  FilePlus,
  Trash2,
  ChevronRight,
  Printer,
  Edit2,
  MessageSquare,
  Undo2
} from 'lucide-react';
import { handleDownload } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';
import InvoiceReceipt from '../../components/ui/InvoiceReceipt';
import { Invoice } from '../../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function AccountsReceivable() {
  const { currentCompany, contacts, invoices, addInvoice, updateInvoice, deleteInvoice, inventory } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [items, setItems] = useState([{ productId: '', qty: 1, rate: 0, hsn: '' }]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [customBillNumber, setCustomBillNumber] = useState('');
  const [taxType, setTaxType] = useState<'Inclusive' | 'Exclusive'>('Exclusive');
  const [extraFields, setExtraFields] = useState({
    saleOrderNo: '',
    referenceNo: '',
    paymentTerms: '',
    destination: '',
    dispatchDocNo: '',
    dispatchedThrough: ''
  });

  const [isExporting, setIsExporting] = useState(false);

  const isBeforeAprilFirst = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const month = d.getMonth(); // 0-indexed: Jan=0, Feb=1, Mar=2
    return month < 3; 
  };

  const generateInvoiceNumber = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-indexed
    
    // Financial Year (April to March)
    let fy = '';
    if (month >= 3) { // April onwards
      fy = `${year}-${(year + 1).toString().slice(-2)}`;
    } else {
      fy = `${year - 1}-${year.toString().slice(-2)}`;
    }

    // Filter invoices in the current financial year to find the max sequence
    // ONLY count April onwards invoices (since from 1st April it resets / starts)
    const fyInvoices = invoices.filter(inv => {
      if (!(inv.invoiceNumber || '').endsWith(`/${fy}`)) return false;
      const invDate = new Date(inv.date);
      return invDate.getMonth() >= 3;
    });
    
    let nextCount = 1;
    if (fyInvoices.length > 0) {
      const counts = fyInvoices.map(inv => {
        const parts = inv.invoiceNumber.split('/');
        if (parts.length >= 3 && parts[0] === 'SI') {
          return parseInt(parts[1], 10);
        }
        return 0;
      }).filter(n => !isNaN(n) && n > 0);
      
      if (counts.length > 0) {
        nextCount = Math.max(...counts) + 1;
      }
    }

    return `SI/${nextCount.toString().padStart(10, '0')}/${fy}`;
  };

  const handleExportPDF = async (inv: Invoice) => {
    const element = document.getElementById('invoice-print-area');
    if (!element) return;
    setIsExporting(true);
    try {
      // Create high-resolution canvas for crystal clear client-side PDF export
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate responsive dimensions to prevent pagination cut-offs
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Invoice_${inv.invoiceNumber || 'Receipt'}.pdf`);
    } catch (error) {
      console.error("PDF download failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const customers = contacts.filter(c => c.category === 'Customer');

  const mockInvoiceData = (inv: Invoice) => {
    const customerObj = contacts.find(c => c.id === inv.customerId);
    
    return {
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      date: inv.date,
      dueDate: inv.due,
      taxType: inv.taxType || 'Exclusive',
      saleOrderNo: inv.saleOrderNo,
      referenceNo: inv.referenceNo,
      paymentTerms: inv.paymentTerms,
      destination: inv.destination,
      dispatchDocNo: inv.dispatchDocNo,
      dispatchedThrough: inv.dispatchedThrough,
      buyer: {
        name: inv.customerName,
        address: inv.billingAddress || customerObj?.address || '',
        gstin: inv.customerGstin || customerObj?.gstin,
        contact: inv.customerPhone || customerObj?.phone || ''
      },
      consignee: {
        name: inv.customerName,
        address: inv.shippingAddress || customerObj?.address || '',
        gstin: inv.customerGstin || customerObj?.gstin,
        contact: inv.customerPhone || customerObj?.phone || ''
      },
      items: inv.items?.length > 0 ? inv.items.map((item: any) => {
        const product = inventory.find(p => p.id === item.productId);
        return {
          name: product?.name || 'Item',
          description: product?.cat || '',
          uom: product?.type === 'Service' ? 'SRV' : 'NOS',
          hsn: item.hsn,
          qty: item.qty,
          rate: item.rate,
          amount: item.qty * item.rate
        };
      }) : [
        { name: 'Software Services', description: 'ERP Implementation', uom: 'NOS', hsn: '998313', qty: 1, rate: inv.amount / 1.18, amount: inv.amount / 1.18 }
      ]
    };
  };

  const handleShareWhatsApp = (inv: Invoice) => {
    const customerObj = contacts.find(c => c.id === inv.customerId);
    const phone = inv.customerPhone || customerObj?.phone || '';
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Dear ${inv.customerName}, your invoice ${inv.invoiceNumber} for ₹${inv.amount.toLocaleString()} is ready. View it here: ${window.location.origin}`;
    window.open(`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEdit = (inv: Invoice) => {
    setSelectedCustomerId(inv.customerId || '');
    setInvoiceDate(inv.date);
    setCustomBillNumber(inv.invoiceNumber || '');
    setItems(inv.items?.length > 0 ? inv.items : [{ productId: '', qty: 1, rate: 0, hsn: '' }]);
    setTaxType(inv.taxType || 'Exclusive');
    setExtraFields({
      saleOrderNo: inv.saleOrderNo || '',
      referenceNo: inv.referenceNo || '',
      paymentTerms: inv.paymentTerms || '',
      destination: inv.destination || '',
      dispatchDocNo: inv.dispatchDocNo || '',
      dispatchedThrough: inv.dispatchedThrough || ''
    });
    setEditingId(inv.id);
    setIsCreating(true);
  };

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

  const subTotal = items.reduce((acc, curr) => acc + (curr.qty * curr.rate), 0);
  const totalAmount = taxType === 'Exclusive' ? subTotal * 1.18 : subTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerObj = contacts.find(c => c.id === selectedCustomerId);
    
    const invNum = isBeforeAprilFirst(invoiceDate)
      ? customBillNumber
      : generateInvoiceNumber(invoiceDate);

    if (editingId) {
      updateInvoice(editingId, {
        invoiceNumber: invNum,
        customerName: customerObj?.name || 'Walk-in Customer',
        customerId: selectedCustomerId,
        customerGstin: customerObj?.gstin,
        customerPhone: customerObj?.phone,
        billingAddress: customerObj?.address,
        shippingAddress: customerObj?.address,
        date: invoiceDate,
        amount: totalAmount,
        items: [...items],
        taxType,
        ...extraFields
      });
    } else {
      const newInv: Invoice = {
        id: `INV-${Date.now()}`,
        invoiceNumber: invNum,
        customerName: customerObj?.name || 'Walk-in Customer',
        customerId: selectedCustomerId,
        customerGstin: customerObj?.gstin,
        customerPhone: customerObj?.phone,
        billingAddress: customerObj?.address,
        shippingAddress: customerObj?.address,
        date: invoiceDate,
        amount: totalAmount,
        status: 'Pending',
        due: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [...items],
        taxType,
        ...extraFields
      };
      addInvoice(newInv);
    }
    
    setIsCreating(false);
    setEditingId(null);
    setCustomBillNumber('');
    setItems([{ productId: '', qty: 1, rate: 0, hsn: '' }]);
    setSelectedCustomerId('');
    setTaxType('Exclusive');
    setExtraFields({
      saleOrderNo: '',
      referenceNo: '',
      paymentTerms: '',
      destination: '',
      dispatchDocNo: '',
      dispatchedThrough: ''
    });
  };

  const handleModalClose = () => {
    setIsCreating(false);
    setEditingId(null);
    setCustomBillNumber('');
    setItems([{ productId: '', qty: 1, rate: 0, hsn: '' }]);
    setSelectedCustomerId('');
    setTaxType('Exclusive');
    setExtraFields({
      saleOrderNo: '',
      referenceNo: '',
      paymentTerms: '',
      destination: '',
      dispatchDocNo: '',
      dispatchedThrough: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Sales Invoices</h1>
          <p className="text-brand-grey-dark/50">Manage your receivables and customer collections</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-5 h-5" />
          Create New Invoice
        </button>
      </div>

      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 bg-brand-blue/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            >
              <div className="p-6 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-teal rounded-2xl">
                    <Printer className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-brand-blue tracking-tight">Invoice Receipt Preview</h2>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => handleShareWhatsApp(selectedInvoice)}
                    className="px-4 py-2.5 bg-brand-success text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
                   >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                   </button>
                   <button 
                    onClick={() => handleExportPDF(selectedInvoice)}
                    disabled={isExporting}
                    className="px-4 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                    {isExporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Export PDF
                      </>
                    )}
                   </button>
                   <button 
                    onClick={() => setSelectedInvoice(null)} 
                    className="p-2.5 hover:bg-white rounded-full transition-colors"
                   >
                    <X className="w-5 h-5 text-brand-grey-dark/40" />
                   </button>
                </div>
              </div>
              <div className="p-10 flex-1 overflow-y-auto bg-brand-grey-light/20 flex justify-center custom-scrollbar">
                {currentCompany && (
                   <div id="invoice-print-area" className="bg-white p-8 md:p-12 shadow-xl rounded-sm w-full max-w-[850px]">
                      <InvoiceReceipt 
                        invoice={mockInvoiceData(selectedInvoice)} 
                        company={currentCompany} 
                      />
                   </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

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
                        <h2 className="text-xl font-display font-bold text-brand-blue">{editingId ? 'Edit Tax Invoice' : 'Generate Tax Invoice'}</h2>
                        <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest">{editingId ? 'Update Document Details' : 'GST Compliant Document'}</p>
                    </div>
                </div>
                <button onClick={handleModalClose} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-5 h-5 text-brand-grey-dark/40" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Customer Name</label>
                      <select 
                        required
                        value={selectedCustomerId}
                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                        className="w-full px-6 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                      >
                        <option value="">Select Customer</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Invoice Date</label>
                      <input 
                        type="date"
                        required
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-full px-6 py-3.5 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-teal transition-all"
                      />
                    </div>
                    {isBeforeAprilFirst(invoiceDate) ? (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Bill Number (Manual)</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. SI/999/2025-26"
                          value={customBillNumber}
                          onChange={(e) => setCustomBillNumber(e.target.value)}
                          className="w-full px-6 py-3.5 bg-brand-grey-light border border-brand-teal/30 focus:border-brand-teal rounded-2xl text-sm font-bold text-brand-blue focus:outline-none shadow-sm transition-all"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Bill Number (Auto-Generated)</label>
                        <input 
                          type="text"
                          readOnly
                          value={generateInvoiceNumber(invoiceDate)}
                          className="w-full px-6 py-3.5 bg-brand-grey-light/50 border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-teal focus:outline-none cursor-not-allowed select-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">S.O. Number</label>
                      <input 
                        type="text" 
                        placeholder="Sale Order No"
                        value={extraFields.saleOrderNo}
                        onChange={(e) => setExtraFields({ ...extraFields, saleOrderNo: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-bold text-brand-blue focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Reference</label>
                      <input 
                        type="text" 
                        placeholder="Ref No / Date"
                        value={extraFields.referenceNo}
                        onChange={(e) => setExtraFields({ ...extraFields, referenceNo: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-bold text-brand-blue focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Terms</label>
                      <input 
                        type="text" 
                        placeholder="Payment Terms"
                        value={extraFields.paymentTerms}
                        onChange={(e) => setExtraFields({ ...extraFields, paymentTerms: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-bold text-brand-blue focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Destination</label>
                      <input 
                        type="text" 
                        placeholder="Place of Supply"
                        value={extraFields.destination}
                        onChange={(e) => setExtraFields({ ...extraFields, destination: e.target.value })}
                        className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-bold text-brand-blue focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Tax Configuration</label>
                      <div className="grid grid-cols-2 gap-3">
                         <button 
                            type="button"
                            onClick={() => setTaxType('Exclusive')}
                            className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${taxType === 'Exclusive' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-brand-grey-light text-brand-grey-dark/40 border-brand-grey-dark/5'}`}
                         >
                            Exclusive (Price + GST)
                         </button>
                         <button 
                            type="button"
                            onClick={() => setTaxType('Inclusive')}
                            className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${taxType === 'Inclusive' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-brand-grey-light text-brand-grey-dark/40 border-brand-grey-dark/5'}`}
                         >
                            Inclusive (Price contains GST)
                         </button>
                      </div>
                    </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-brand-blue/40 uppercase tracking-widest">Line Items</h3>
                        <button 
                            type="button"
                            onClick={addItemRow}
                            className="text-xs font-bold text-brand-teal flex items-center gap-1 hover:underline"
                        >
                            <Plus className="w-3 h-3" /> Add Product
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
                                    <label className="text-[9px] font-black text-brand-grey-dark/30 uppercase ml-1">Rate (₹)</label>
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
                    <div className="text-center md:text-left flex items-center gap-10">
                        <div>
                            <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest">Sub-Total</p>
                            <h4 className="text-xl font-display font-bold text-brand-blue/60">₹ {subTotal.toLocaleString()}</h4>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest">GST (18%)</p>
                            <h4 className="text-xl font-display font-bold text-brand-blue/60">
                                ₹ {taxType === 'Exclusive' ? (subTotal * 0.18).toLocaleString() : (subTotal - (subTotal / 1.18)).toLocaleString()}
                            </h4>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest">Grand Total</p>
                            <h4 className="text-4xl font-display font-black text-brand-blue">₹ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
                        </div>
                    </div>
                    <button 
                      type="submit"
                      className="px-12 py-5 bg-brand-blue text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {editingId ? 'Update & Save Invoice' : 'Authenticate & Issue Invoice'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Receivables', value: `₹${invoices.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}`, sub: `across ${invoices.length} invoices`, color: 'text-brand-blue' },
          { label: 'Overdue Amount', value: '₹12,000', sub: 'requires immediate follow-up', color: 'text-brand-error' },
          { label: 'Paid This Month', value: '₹1,09,000', sub: '+15% from last month', color: 'text-brand-success' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl card-shadow border border-brand-grey-dark/5">
            <p className="text-[10px] font-bold text-brand-grey-dark/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</h3>
            <p className="text-xs text-brand-grey-dark/40 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] card-shadow border border-brand-grey-dark/5 overflow-hidden">
        <div className="p-6 border-b border-brand-grey-dark/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-brand-grey-light px-4 py-2 rounded-xl w-full md:w-80 gap-3">
            <Search className="w-4 h-4 text-brand-grey-dark/40 mt-0.5" />
            <input 
              type="text" 
              placeholder="Filter by customer..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl border border-brand-grey-dark/10 hover:bg-brand-grey-light transition-colors">
              <Filter className="w-4 h-4 text-brand-grey-dark/60" />
            </button>
            <button 
              onClick={() => handleDownload('Sales_Invoices')}
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
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Invoice Date</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Customer Details</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey-dark/5">
              {invoices.map((inv, idx) => (
                <motion.tr 
                  key={inv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-brand-grey-light/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-brand-blue">{inv.date}</p>
                    <p className="text-[10px] font-bold text-brand-grey-dark/30 tracking-tight">{inv.invoiceNumber || inv.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-blue mb-0.5">{inv.customerName}</p>
                    <p className="text-[10px] text-brand-teal font-bold uppercase tracking-tighter">{inv.customerGstin ? 'B2B Business' : 'B2C Retail'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-blue">₹{inv.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inv.status === 'Paid' ? 'bg-green-50 text-brand-success' :
                      inv.status === 'Overdue' ? 'bg-red-50 text-brand-error' :
                      inv.status === 'Cancelled' ? 'bg-gray-100 text-gray-400 line-through' :
                      inv.status === 'Returned' ? 'bg-purple-50 text-purple-600' :
                      'bg-amber-50 text-brand-warning'
                    }`}>
                      {inv.status === 'Paid' && <CheckCircle className="w-3 h-3" />}
                      {inv.status === 'Overdue' && <AlertCircle className="w-3 h-3" />}
                      {inv.status === 'Cancelled' && <X className="w-3 h-3" />}
                      {inv.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-semibold ${inv.status === 'Overdue' ? 'text-brand-error' : 'text-brand-grey-dark/60'}`}>{inv.due}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-2 hover:bg-brand-grey-light rounded-lg transition-colors group"
                            title="View / Print"
                        >
                            <Eye className="w-4 h-4 text-brand-grey-dark/40 group-hover:text-brand-teal" />
                        </button>
                        <button 
                            onClick={() => handleEdit(inv)}
                            className="p-2 hover:bg-brand-grey-light rounded-lg transition-colors group text-brand-blue"
                            title="Edit"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => updateInvoice(inv.id, { status: 'Returned' })}
                            className="p-2 hover:bg-purple-50 rounded-lg transition-colors group text-purple-600"
                            title="Return Bill"
                        >
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => updateInvoice(inv.id, { status: 'Cancelled' })}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group text-brand-error"
                            title="Cancel Bill"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-brand-grey-dark/5 bg-brand-grey-light/10 flex justify-between items-center">
            <p className="text-xs font-medium text-brand-grey-dark/40">Showing {invoices.length} entries</p>
            <div className="flex gap-2">
                <button className="px-4 py-2 border border-brand-grey-dark/10 rounded-xl text-xs font-bold hover:bg-brand-grey-light transition-colors disabled:opacity-50">Previous</button>
                <button className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold shadow-md shadow-brand-blue/10">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}
