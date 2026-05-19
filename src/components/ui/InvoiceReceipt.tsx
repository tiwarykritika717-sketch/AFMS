import React from 'react';
import { Company } from '../../types';
import { numberToWords } from '../../utils/helpers';

interface InvoiceItem {
  id?: string;
  name: string;
  description: string;
  uom: string;
  hsn: string;
  qty: number;
  rate: number;
  discount?: number;
  amount: number;
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  deliveryDate?: string;
  saleOrderNo?: string;
  referenceNo?: string;
  paymentTerms?: string;
  referenceOrderDate?: string;
  dispatchDocNo?: string;
  deliveryNoteDate?: string;
  dispatchedThrough?: string;
  destination?: string;
  taxType?: 'Inclusive' | 'Exclusive';
  buyer: {
    name: string;
    address: string;
    gstin?: string;
    contact?: string;
  };
  consignee?: {
    name: string;
    address: string;
    gstin?: string;
    contact?: string;
  };
  items: InvoiceItem[];
}

interface Props {
  invoice: InvoiceData;
  company: Company;
}

export default function InvoiceReceipt({ invoice, company }: Props) {
  const isInclusive = invoice.taxType === 'Inclusive';
  
  // Basic GST Logic: Show IGST as per image requirement
  const subTotalRaw = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const taxableValue = isInclusive ? subTotalRaw / 1.18 : subTotalRaw;
  const igst = taxableValue * 0.18;
  const total = isInclusive ? subTotalRaw : subTotalRaw + igst;

  return (
    <div className="bg-white p-0 shadow-sm border border-black/40 text-[11px] leading-tight text-black font-sans mx-auto max-w-[800px] print:border-none print:shadow-none mb-10 overflow-hidden rounded-sm">
      {/* Title */}
      <div className="text-center border-b border-black/40 py-1 font-bold text-[12px]">
        Original For Recipient (Tax Invoice)
      </div>

      <div className="grid grid-cols-[1.2fr_0.8fr] border-b border-black/40">
        {/* Company Info */}
        <div className="p-3 border-r border-black/40 flex gap-4">
          <div className="w-16 h-16 shrink-0 bg-gray-50 flex items-center justify-center border border-black/10">
            {company.logo ? (
              <img src={company.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-[10px] font-bold opacity-20">LOGO</span>
            )}
          </div>
          <div>
            <h2 className="text-[14px] font-black uppercase mb-0.5">{company.name}</h2>
            <p className="text-[10px] whitespace-pre-line mb-1 font-medium leading-[1.3]">
              {company.address}
            </p>
            <div className="space-y-0.5 font-bold">
              <p>GSTIN/UIN : <span className="font-black">{company.gstin}</span></p>
              <p>PAN : <span className="font-black">{company.pan}</span> <span className="ml-4">Contact : <span className="font-black">{company.phone}</span></span></p>
              <p>Email : <span className="font-normal">{company.email}</span></p>
            </div>
          </div>
        </div>

        {/* Invoice Details Grid */}
        <div className="grid grid-cols-2">
          <div className="p-2 border-b border-r border-black/40 h-10">
            <p className="text-[8px] uppercase font-bold text-gray-500">Invoice No.</p>
            <p className="font-black">{invoice.invoiceNumber || invoice.id}</p>
          </div>
          <div className="p-2 border-b border-black/40 h-10">
            <p className="text-[8px] uppercase font-bold text-gray-500">Invoice Date</p>
            <p className="font-black">{invoice.date}</p>
          </div>
          <div className="p-2 border-b border-r border-black/40 h-10">
            <p className="text-[8px] uppercase font-bold text-gray-500">Due Date</p>
            <p className="font-black">{invoice.dueDate || invoice.date}</p>
          </div>
          <div className="p-2 border-b border-black/40 h-10">
            <p className="text-[8px] uppercase font-bold text-gray-500">Delivery Date</p>
            <p className="font-black">{invoice.deliveryDate || invoice.date}</p>
          </div>
          <div className="p-2 border-b border-r border-black/40 h-10">
            <p className="text-[8px] uppercase font-bold text-gray-500">Sale Order No</p>
            <p className="font-bold">{invoice.saleOrderNo || '-'}</p>
          </div>
          <div className="p-2 border-b border-black/40 h-10">
            <p className="text-[8px] uppercase font-bold text-gray-500">Reference No</p>
            <p className="font-bold">{invoice.referenceNo || '-'}</p>
          </div>
          <div className="p-2 border-b border-r border-black/40 h-10">
             <p className="text-[8px] uppercase font-bold text-gray-500">Payment Terms</p>
             <p>{invoice.paymentTerms || '0'}</p>
          </div>
          <div className="p-2 border-b border-black/40 h-10">
             <p className="text-[8px] uppercase font-bold text-gray-500">Reference Order Date</p>
             <p>{invoice.referenceOrderDate || '-'}</p>
          </div>
          <div className="p-2 border-b border-r border-black/40 h-10">
             <p className="text-[8px] uppercase font-bold text-gray-500">Dispatch Doc No.</p>
             <p>{invoice.dispatchDocNo || '-'}</p>
          </div>
          <div className="p-2 border-b border-black/40 h-10">
             <p className="text-[8px] uppercase font-bold text-gray-500">Delivery Note Date</p>
             <p>{invoice.deliveryNoteDate || '-'}</p>
          </div>
          <div className="p-2 border-r border-black/40 h-10">
             <p className="text-[8px] uppercase font-bold text-gray-500">Dispatched through</p>
             <p>{invoice.dispatchedThrough || '-'}</p>
          </div>
          <div className="p-2 h-10">
             <p className="text-[8px] uppercase font-bold text-gray-500">Destination</p>
             <p>{invoice.destination || '-'}</p>
          </div>
        </div>
      </div>

      {/* Buyer & Consignee */}
      <div className="grid grid-cols-[1.2fr_0.8fr] border-b border-black/40">
        <div className="p-3 border-r border-black/40">
          <p className="font-bold text-[10px] mb-1 uppercase text-gray-500">Buyer (Bill to)</p>
          <p className="font-black text-[12px]">{invoice.buyer.name}</p>
          <p className="text-[10px] whitespace-pre-line leading-relaxed min-h-[40px]">{invoice.buyer.address}</p>
          <div className="mt-2 space-y-0.5">
            <p><strong>GSTIN/UIN :</strong> <span className="font-black">{invoice.buyer.gstin || '-'}</span></p>
            <p><strong>Contact :</strong> {invoice.buyer.contact || '-'}</p>
          </div>
        </div>
        <div className="p-3">
          <p className="font-bold text-[10px] mb-1 uppercase text-gray-500">Consignee (Ship to)</p>
          <p className="font-black text-[12px]">{invoice.consignee?.name || invoice.buyer.name}</p>
          <p className="text-[10px] whitespace-pre-line leading-relaxed min-h-[40px]">{invoice.consignee?.address || invoice.buyer.address}</p>
          <div className="mt-2 space-y-0.5">
            <p><strong>GSTIN/UIN :</strong> <span className="font-black">{invoice.consignee?.gstin || invoice.buyer.gstin || '-'}</span></p>
            <p><strong>Contact :</strong> {invoice.consignee?.contact || invoice.buyer.contact || '-'}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="min-h-[400px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black/40 text-[9px] font-black uppercase bg-gray-50">
              <th className="border-r border-black/40 p-1 w-8 text-center">Sl.No</th>
              <th className="border-r border-black/40 p-1 text-left">Item Name</th>
              <th className="border-r border-black/40 p-1 text-left">Item Description</th>
              <th className="border-r border-black/40 p-1 w-12 text-center">UOM</th>
              <th className="border-r border-black/40 p-1 w-20 text-center">HSN/SAC</th>
              <th className="border-r border-black/40 p-1 w-14 text-center">Quantity</th>
              <th className="border-r border-black/40 p-1 w-16 text-right">Rate</th>
              <th className="border-r border-black/40 p-1 w-14 text-right">Discount</th>
              <th className="p-1 w-24 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="">
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="text-[10px] leading-[2]">
                <td className="border-r border-black/40 px-1 py-0.5 text-center align-top">{idx + 1}</td>
                <td className="border-r border-black/40 px-1 py-0.5 font-bold align-top">{item.name}</td>
                <td className="border-r border-black/40 px-1 py-0.5 opacity-80 align-top">{item.description}</td>
                <td className="border-r border-black/40 px-1 py-0.5 text-center uppercase align-top">{item.uom}</td>
                <td className="border-r border-black/40 px-1 py-0.5 text-center font-bold align-top">{item.hsn}</td>
                <td className="border-r border-black/40 px-1 py-0.5 text-center font-bold align-top">{item.qty}</td>
                <td className="border-r border-black/40 px-1 py-0.5 text-right align-top">{item.rate.toFixed(2)}</td>
                <td className="border-r border-black/40 px-1 py-0.5 text-right align-top">{item.discount || '0'}</td>
                <td className="px-1 py-0.5 text-right font-black align-top">{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
            {/* Tax and Total row logic improved */}
            <tr className="border-t border-black/40 text-[10px] font-bold">
               <td colSpan={2} className="border-r border-black/40"></td>
               <td className="border-r border-black/40 p-1 text-right italic" colSpan={6}>Output IGST @ 18%</td>
               <td className="p-1 text-right font-black">{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr className="border-t border-black/40 text-[10px] font-bold">
               <td colSpan={2} className="border-r border-black/40"></td>
               <td className="border-r border-black/40 p-1 text-right italic" colSpan={6}>Round Off</td>
               <td className="p-1 text-right font-black">{(total - (taxableValue + igst)).toFixed(2)}</td>
            </tr>

            {/* Total Footer */}
            <tr className="border-y border-black/40 bg-gray-50 font-black">
               <td colSpan={2} className="border-r border-black/40 p-1 text-center text-[10px]">Total</td>
               <td className="border-r border-black/40"></td>
               <td className="border-r border-black/40"></td>
               <td className="border-r border-black/40"></td>
               <td className="border-r border-black/40 p-1 text-center">{invoice.items.reduce((s, i) => s + i.qty, 0).toFixed(0)} Nos</td>
               <td className="border-r border-black/40"></td>
               <td className="border-r border-black/40"></td>
               <td className="p-1 text-right text-[12px]">₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="border-t border-black/40">
        <div className="p-2 flex gap-2">
          <p className="uppercase text-[9px] font-black opacity-60 shrink-0">Amount Chargeable (in Words) :</p>
          <p className="font-bold text-[11px] capitalize">{numberToWords(total)} rupees only</p>
        </div>

        {/* Tax Summary Table */}
        <div className="overflow-hidden border-y border-black/40">
           <table className="w-full border-collapse">
             <thead>
               <tr className="text-[8px] font-black uppercase text-center divide-x divide-black/40 border-b border-black/40">
                 <th rowSpan={2} className="p-1 w-24">HSN/SAC</th>
                 <th rowSpan={2} className="p-1">Taxable Value</th>
                 <th colSpan={2} className="p-1">IGST</th>
                 <th rowSpan={2} className="p-1">Total Tax Amount</th>
               </tr>
               <tr className="text-[8px] font-black divide-x divide-black/40">
                 <th className="p-1">Rate</th>
                 <th className="p-1">Amount</th>
               </tr>
             </thead>
             <tbody>
               <tr className="text-center text-[10px] divide-x divide-black/40 border-b border-black/40 font-bold">
                 <td className="p-2">{invoice.items[0]?.hsn || '998313'}</td>
                 <td className="p-2">{taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                 <td className="p-2">18.00%</td>
                 <td className="p-2">{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                 <td className="p-2">{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
               </tr>
               <tr className="font-black text-[10px] text-center divide-x divide-black/40 bg-gray-50">
                 <td className="p-1 uppercase text-[8px]">Total</td>
                 <td className="p-1">{taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                 <td className="p-1"></td>
                 <td className="p-1">{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                 <td className="p-1">{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
               </tr>
             </tbody>
           </table>
        </div>

        {/* Terms and Signatures */}
        <div className="grid grid-cols-2">
           <div className="border-r border-black/40 p-2 space-y-3">
              <div>
                <p className="text-[9px] font-black uppercase underline decoration-black/20 mb-1">Terms & Conditions</p>
                <div className="text-[8px] leading-tight space-y-0.5 font-medium">
                  <p>1. Goods once sold will be as per agreement.</p>
                  <p>2. Subject to Lucknow jurisdiction.</p>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase mb-1">Company's Bank Details</p>
                <div className="grid grid-cols-[80px_1fr] text-[9px] gap-y-0.5">
                   <span className="opacity-60">Bank Name</span>
                   <span className="font-bold">: {company.bankName || 'N.A'}</span>
                   <span className="opacity-60">Acc/No</span>
                   <span className="font-bold">: {company.accountNo || 'N.A'}</span>
                   <span className="opacity-60">Branch & IFSC</span>
                   <span className="font-bold">: {company.branchName || 'N.A'} {company.ifscCode ? `( ${company.ifscCode} )` : ''}</span>
                </div>
              </div>
           </div>

           <div className="flex flex-col">
              <div className="p-2 text-right">
                 <p className="text-[10px] font-bold">For {company.name.toUpperCase()}</p>
              </div>
              <div className="mt-auto p-2 text-right">
                 <div className="h-10"></div>
                 <p className="font-black uppercase text-[10px] border-t border-black/10 inline-block pt-1">Authorised Signatory</p>
              </div>
           </div>
        </div>

        <div className="bg-gray-50 p-1 text-center text-[7px] font-medium opacity-50 uppercase tracking-widest border-t border-black/40">
          This is a Computer Generated Invoice
        </div>
      </div>
    </div>
  );
}
