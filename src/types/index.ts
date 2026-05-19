/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Admin' | 'Manager' | 'Accountant' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  gstin?: string;
  pan?: string;
  address: string;
  currency: string;
  financialYear: string;
  phone?: string;
  email?: string;
  logo?: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  branchName?: string;
  terms?: string[];
}

export interface AppState {
  user: User | null;
  currentCompany: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type ModuleType = 
  | 'Dashboard'
  | 'CompanySetup'
  | 'Masters'
  | 'AR'
  | 'AP'
  | 'GL'
  | 'CashBank'
  | 'Inventory'
  | 'Payroll'
  | 'FixedAssets'
  | 'Budgeting'
  | 'Taxation'
  | 'Reports';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Debit' | 'Credit';
  category: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface Contact {
  id: string;
  name: string;
  type: string; // B2B, B2C
  category: string; // Customer, Vendor
  gstin?: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  state?: string;
}

export interface InvoiceItem {
  productId: string;
  qty: number;
  rate: number;
  hsn: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // Dynamic series like SI/0000672026
  customerName: string;
  customerId?: string;
  customerGstin?: string;
  customerPhone?: string;
  billingAddress?: string;
  shippingAddress?: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled' | 'Returned';
  due: string;
  items: InvoiceItem[];
  taxType: 'Inclusive' | 'Exclusive';
  notes?: string;
  saleOrderNo?: string;
  referenceNo?: string;
  paymentTerms?: string;
  destination?: string;
  dispatchDocNo?: string;
  dispatchedThrough?: string;
}

export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  joiningDate: string;
  pan?: string;
  bankAccount?: string;
  ifsc?: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  status: 'Active' | 'Inactive' | 'On Leave';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half Day' | 'Leave';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  type: 'Casual' | 'Sick' | 'Paid' | 'Unpaid';
}

export interface SalarySlip {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  basic: number;
  hra: number;
  allowances: number;
  pf: number;
  tds: number;
  otherDeductions: number;
  netPay: number;
  status: 'Draft' | 'Paid';
}

export interface InventoryItem {
  id: string;
  name: string;
  cat: string;
  qty: number;
  value: number;
  status: string;
  hsn: string;
  type: 'Product' | 'Service';
}
