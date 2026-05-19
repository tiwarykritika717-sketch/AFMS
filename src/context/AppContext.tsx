import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Company, ModuleType, Contact, Invoice, Employee, AttendanceRecord, LeaveRequest, SalarySlip, InventoryItem } from '../types';

interface AppContextType {
  user: User | null;
  currentCompany: Company | null;
  activeModule: ModuleType;
  isAuthenticated: boolean;
  contacts: Contact[];
  invoices: Invoice[];
  inventory: InventoryItem[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  salarySlips: SalarySlip[];
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  setActiveModule: (module: ModuleType) => void;
  setCompany: (company: Company) => void;
  updateCompany: (data: Partial<Company>) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  addEmployee: (emp: Employee) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  markAttendance: (records: AttendanceRecord[]) => void;
  addLeaveRequest: (leave: LeaveRequest) => void;
  updateLeaveRequest: (id: string, data: Partial<LeaveRequest>) => void;
  addSalarySlip: (slip: SalarySlip) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: '1',
  name: 'Admin Bill',
  email: 'adminbill',
  role: 'Admin',
};

const DEMO_COMPANY: Company = {
  id: 'c1',
  name: 'Digital Communique Pvt Ltd',
  gstin: '09AAJCD5296K1ZZ',
  pan: 'AAJCD5296K',
  address: 'C/O Krishna Kant Tiwary 32 VILLA RISHITA MULBERRY, SEC 3 POCKET 7 Lucknow, SUSHANT GOLF CITY, Lucknow, Uttar Pradesh, 226030 - India.',
  currency: 'INR',
  financialYear: '2024-25',
  phone: '+91 63948 29004',
  email: 'digicommunique@gmail.com',
  logo: 'https://via.placeholder.com/150',
  bankName: 'N.A',
  accountNo: 'N/A',
  ifscCode: 'N/A',
  branchName: 'N/A',
  terms: ['1. Goods once sold will not be taken back.', '2. Interest @ 18% p.a. will be charged for delayed payments.'],
};

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Maya Group', type: 'B2B', category: 'Customer', gstin: '09AAJCD5296K1ZZ', email: 'maya@group.com', phone: '9876543210', city: 'Ghazipur' },
  { id: '2', name: 'Rahul Sharma', type: 'B2C', category: 'Customer', email: 'rahul@gmail.com', phone: '9988776655', city: 'Delhi' },
  { id: '3', name: 'Amazon Web Services', type: 'B2B', category: 'Vendor', gstin: '07AAACA1234A1Z1', email: 'billing@aws.com', phone: '1800-123-456', city: 'Mumbai' },
];

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-1', invoiceNumber: 'SI/0000692026/2025-26', customerName: 'Maya Group', date: '2026-02-18', amount: 5000.01, status: 'Paid', due: '2026-02-18', items: [], taxType: 'Exclusive' },
  { id: 'INV-2', invoiceNumber: 'SI/0000000001/2024-25', customerName: 'Global Tech Solutions', date: '2024-05-12', amount: 45000, status: 'Paid', due: '2024-06-12', items: [], taxType: 'Exclusive' },
  { id: 'INV-3', invoiceNumber: 'SI/0000000002/2024-25', customerName: 'Creative Studio INC', date: '2024-05-15', amount: 12000, status: 'Overdue', due: '2024-06-15', items: [], taxType: 'Exclusive' },
  { id: 'INV-4', invoiceNumber: 'SI/0000000003/2024-25', customerName: 'Nexus Marketing', date: '2024-05-20', amount: 28500, status: 'Pending', due: '2024-06-20', items: [], taxType: 'Exclusive' },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'ITM-001', name: 'MacBook Pro M3', cat: 'Electronics', qty: 12, value: 185000, status: 'In Stock', hsn: '8471', type: 'Product' },
  { id: 'ITM-002', name: 'Dell Monitor 27"', cat: 'Electronics', qty: 45, value: 24000, status: 'In Stock', hsn: '8528', type: 'Product' },
  { id: 'ITM-003', name: 'Office Chair', cat: 'Furniture', qty: 5, value: 12500, status: 'Low Stock', hsn: '9403', type: 'Product' },
  { id: 'ITM-004', name: 'Anti-Virus Software', cat: 'Software', qty: 100, value: 1500, status: 'In Stock', hsn: '8523', type: 'Product' },
  { id: 'ITM-006', name: 'Digital Marketing', cat: 'Services', qty: 999, value: 55000, status: 'In Stock', hsn: '9983', type: 'Service' },
  { id: 'ITM-007', name: 'Software Development', cat: 'Software', qty: 50, value: 12000, status: 'In Stock', hsn: '9973', type: 'Service' },
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Alok Mishra', designation: 'Sr. Developer', department: 'Development', joiningDate: '2022-01-15', baseSalary: 80000, allowances: 5000, deductions: 2000, status: 'Active' },
  { id: 'EMP-002', name: 'Sarah Khan', designation: 'HR Manager', department: 'HR', joiningDate: '2023-03-10', baseSalary: 60000, allowances: 5000, deductions: 1000, status: 'Active' },
  { id: 'EMP-003', name: 'John Doe', designation: 'Accountant', department: 'Accounts', joiningDate: '2021-11-01', baseSalary: 50000, allowances: 5000, deductions: 500, status: 'Active' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(DEMO_COMPANY);
  const [activeModule, setActiveModule] = useState<ModuleType>('Dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);

  const login = async (email: string, password?: string) => {
    // ... logic
    if (email === 'adminbill' && password === '123456') {
      setUser(DEMO_USER);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const setCompany = (company: Company) => {
    setCurrentCompany(company);
  };

  const updateCompany = (data: Partial<Company>) => {
    if (currentCompany) {
      setCurrentCompany({ ...currentCompany, ...data });
    }
  };

  const addContact = (contact: Contact) => {
    setContacts(prev => [...prev, contact]);
  };

  const updateContact = (id: string, data: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...data } : inv));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const addInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
  };

  const updateInventoryItem = (id: string, data: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const addEmployee = (emp: Employee) => {
    setEmployees(prev => [...prev, emp]);
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...data } : emp));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const markAttendance = (records: AttendanceRecord[]) => {
    setAttendance(prev => {
      const filtered = prev.filter(p => !records.some(r => r.employeeId === p.employeeId && r.date === p.date));
      return [...filtered, ...records];
    });
  };

  const addLeaveRequest = (leave: LeaveRequest) => {
    setLeaves(prev => [...prev, leave]);
  };

  const updateLeaveRequest = (id: string, data: Partial<LeaveRequest>) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const addSalarySlip = (slip: SalarySlip) => {
    setSalarySlips(prev => [...prev, slip]);
  };

  return (
    <AppContext.Provider 
      value={{ 
        user, 
        currentCompany, 
        activeModule, 
        isAuthenticated, 
        contacts,
        invoices,
        inventory,
        employees,
        attendance,
        leaves,
        salarySlips,
        login, 
        logout, 
        setActiveModule,
        setCompany,
        updateCompany,
        addContact,
        updateContact,
        deleteContact,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        markAttendance,
        addLeaveRequest,
        updateLeaveRequest,
        addSalarySlip
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
