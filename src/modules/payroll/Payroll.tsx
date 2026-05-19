import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CreditCard, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  X,
  UserPlus,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Printer,
  ClipboardList
} from 'lucide-react';
import { handleDownload } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';
import { Employee, AttendanceRecord, LeaveRequest, SalarySlip } from '../../types';

type TabType = 'Employees' | 'Attendance' | 'Leaves' | 'Payroll';

export default function Payroll() {
  const { 
    employees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    attendance,
    markAttendance,
    leaves,
    addLeaveRequest,
    updateLeaveRequest,
    salarySlips,
    addSalarySlip,
    currentCompany
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<TabType>('Employees');
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [isBulkLeaveModal, setIsBulkLeaveModal] = useState(false);
  const [selectedEmployeeForSlip, setSelectedEmployeeForSlip] = useState<Employee | null>(null);

  // Stats
  const stats = [
    { label: 'Total Staff', value: employees.length.toString(), icon: Users, color: 'text-brand-blue', bg: 'bg-blue-50' },
    { label: 'Present Today', value: attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'Present').length.toString(), icon: CheckCircle2, color: 'text-brand-success', bg: 'bg-green-50' },
    { label: 'On Leave', value: employees.filter(e => e.status === 'On Leave').length.toString(), icon: Clock, color: 'text-brand-warning', bg: 'bg-amber-50' },
    { label: 'Payroll Budget', value: `₹${employees.reduce((acc, curr) => acc + curr.baseSalary + curr.allowances, 0).toLocaleString()}`, icon: CreditCard, color: 'text-brand-teal', bg: 'bg-teal-50' },
  ];

  const handleEmployeeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const employeeData: Employee = {
      id: editingEmployee?.id || `EMP-${(employees.length + 1).toString().padStart(3, '0')}`,
      name: formData.get('name') as string,
      designation: formData.get('designation') as string,
      department: formData.get('department') as string,
      joiningDate: formData.get('joiningDate') as string,
      baseSalary: Number(formData.get('baseSalary')),
      allowances: Number(formData.get('allowances')),
      deductions: Number(formData.get('deductions')),
      status: (formData.get('status') as any) || 'Active',
      pan: formData.get('pan') as string,
      bankAccount: formData.get('bankAccount') as string,
      ifsc: formData.get('ifsc') as string,
    };

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employeeData);
    } else {
      addEmployee(employeeData);
    }
    setIsAddingEmployee(false);
    setEditingEmployee(null);
  };

  const handleBulkAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    const newRecords: AttendanceRecord[] = employees.map(emp => ({
      id: `${emp.id}-${today}`,
      employeeId: emp.id,
      date: today,
      status: 'Present'
    }));
    markAttendance(newRecords);
    alert('Marked all active employees as Present for today.');
  };

  const generateSlip = (emp: Employee) => {
    const slip: SalarySlip = {
      id: `SLIP-${emp.id}-${selectedMonth}`,
      employeeId: emp.id,
      month: selectedMonth,
      basic: emp.baseSalary,
      hra: Math.round(emp.baseSalary * 0.4), // Mock HRA 40%
      allowances: emp.allowances,
      pf: Math.round(emp.baseSalary * 0.12), // Mock PF 12%
      tds: Math.round(emp.baseSalary * 0.05), // Mock TDS 5%
      otherDeductions: emp.deductions,
      netPay: (emp.baseSalary + emp.allowances) - (emp.deductions + Math.round(emp.baseSalary * 0.12) + Math.round(emp.baseSalary * 0.05)),
      status: 'Paid'
    };
    addSalarySlip(slip);
    alert(`Salary slip generated for ${emp.name} for ${selectedMonth}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-blue">Payroll & HR Management</h1>
          <p className="text-brand-grey-dark/50">Manage staff, attendance, and salary disbursements</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'Employees' && (
            <button 
              onClick={() => setIsAddingEmployee(true)}
              className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <UserPlus className="w-5 h-5" />
              Add New Staff
            </button>
          )}
          {activeTab === 'Attendance' && (
            <button 
              onClick={handleBulkAttendance}
              className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <CheckCircle className="w-5 h-5" />
              Mark All Present
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl card-shadow border border-brand-grey-dark/5">
            <div className={`p-3 ${stat.bg} rounded-2xl w-fit mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold text-brand-grey-dark/40 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-brand-blue tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-grey-dark/10">
        {(['Employees', 'Attendance', 'Leaves', 'Payroll'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-brand-teal border-b-2 border-brand-teal' : 'text-brand-grey-dark/40 hover:text-brand-blue'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-[2rem] card-shadow border border-brand-grey-dark/5 overflow-hidden">
        {activeTab === 'Employees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="bg-brand-grey-light/30">
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Employee</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Department</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-right">Base Salary</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-brand-grey-dark/40 tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-grey-dark/5">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-brand-grey-light/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center font-bold text-brand-blue">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-blue">{emp.name}</p>
                          <p className="text-[10px] text-brand-grey-dark/40 font-bold uppercase">{emp.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-grey-dark/60">{emp.department}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-brand-blue">₹ {emp.baseSalary.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${emp.status === 'Active' ? 'bg-green-50 text-brand-success' : 'bg-red-50 text-brand-error'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => { setEditingEmployee(emp); setIsAddingEmployee(true); }}
                          className="p-2 hover:bg-brand-grey-light rounded-lg text-brand-grey-dark/40 hover:text-brand-blue transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteEmployee(emp.id)}
                          className="p-2 hover:bg-brand-grey-light rounded-lg text-brand-grey-dark/40 hover:text-brand-error transition-colors"
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
        )}

        {activeTab === 'Attendance' && (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-brand-blue text-xl">Daily Attendance Tracker</h3>
              <div className="flex gap-4 items-center">
                <input 
                  type="date" 
                  defaultValue={new Date().toISOString().split('T')[0]} 
                  className="px-4 py-2 bg-brand-grey-light rounded-xl text-xs font-bold text-brand-blue outline-none border border-brand-grey-dark/5"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map(emp => {
                const todayRecord = attendance.find(a => a.employeeId === emp.id && a.date === new Date().toISOString().split('T')[0]);
                return (
                  <div key={emp.id} className="p-6 bg-brand-grey-light/30 rounded-[2rem] border border-brand-grey-dark/5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-brand-blue">{emp.name}</p>
                      <p className="text-[10px] text-brand-grey-dark/40 uppercase font-black">{emp.designation}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => markAttendance([{ id: `${emp.id}-today`, employeeId: emp.id, date: new Date().toISOString().split('T')[0], status: 'Present' }])}
                        className={`p-2.5 rounded-xl transition-all ${todayRecord?.status === 'Present' ? 'bg-brand-success text-white' : 'bg-white text-brand-grey-dark/30 hover:bg-white'}`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => markAttendance([{ id: `${emp.id}-today`, employeeId: emp.id, date: new Date().toISOString().split('T')[0], status: 'Absent' }])}
                        className={`p-2.5 rounded-xl transition-all ${todayRecord?.status === 'Absent' ? 'bg-brand-error text-white' : 'bg-white text-brand-grey-dark/30 hover:bg-white'}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'Leaves' && (
          <div className="p-8 space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-brand-blue text-xl">Leave Management</h3>
                <button 
                  onClick={() => setIsBulkLeaveModal(true)}
                  className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold flex items-center gap-2"
                >
                   <Plus className="w-4 h-4" /> Bulk Leave Entry
                </button>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                   <p className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest">Active Requests</p>
                   {leaves.length === 0 ? (
                      <div className="p-10 text-center bg-brand-grey-light/20 rounded-3xl border-2 border-dashed border-brand-grey-dark/10">
                         <ClipboardList className="w-12 h-12 text-brand-grey-dark/20 mx-auto mb-4" />
                         <p className="text-sm font-bold text-brand-grey-dark/40">No pending leave requests found.</p>
                      </div>
                   ) : (
                      leaves.map(leave => (
                        <div key={leave.id} className="p-6 bg-white border border-brand-grey-dark/5 rounded-3xl shadow-sm flex justify-between items-center">
                           <div>
                              <p className="font-bold text-brand-blue">{employees.find(e => e.id === leave.employeeId)?.name}</p>
                              <p className="text-xs text-brand-grey-dark/40">{leave.startDate} to {leave.endDate} • {leave.type}</p>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => updateLeaveRequest(leave.id, { status: 'Approved' })} className="p-2 bg-green-50 text-brand-success rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => updateLeaveRequest(leave.id, { status: 'Rejected' })} className="p-2 bg-red-50 text-brand-error rounded-lg"><X className="w-4 h-4" /></button>
                           </div>
                        </div>
                      ))
                   )}
                </div>
                <div className="space-y-4">
                   <div className="p-6 bg-brand-blue rounded-[2.5rem] text-white">
                      <h4 className="font-display font-bold mb-4">Leave Policy Summary</h4>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-xs">
                            <span className="opacity-60">Casual Leaves</span>
                            <span className="font-bold">12 Days / Year</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="opacity-60">Sick Leaves</span>
                            <span className="font-bold">10 Days / Year</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="opacity-60">Paid Leaves</span>
                            <span className="font-bold">15 Days / Year</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'Payroll' && (
          <div className="p-8 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex bg-brand-grey-light p-1.5 rounded-2xl w-fit">
                  {['Monthly Processing', 'Salary Slips'].map(t => (
                    <button key={t} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${t === 'Monthly Processing' ? 'bg-white shadow-md text-brand-blue' : 'text-brand-grey-dark/40 hover:text-brand-blue'}`}>
                       {t}
                    </button>
                  ))}
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-brand-grey-dark/40">Select Month:</span>
                  <input 
                    type="month" 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-black text-brand-blue outline-none"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(emp => (
                  <div key={emp.id} className="bg-white border border-brand-grey-dark/5 rounded-[2.5rem] p-6 shadow-sm flex flex-col hover:shadow-xl transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest mb-1">Employee ID: {emp.id}</p>
                           <h4 className="text-xl font-display font-bold text-brand-blue">{emp.name}</h4>
                        </div>
                        <div className="p-3 bg-brand-grey-light rounded-2xl">
                           <CreditCard className="w-5 h-5 text-brand-blue/30" />
                        </div>
                     </div>
                     <div className="space-y-3 mb-8">
                        <div className="flex justify-between text-xs font-medium">
                           <span className="text-brand-grey-dark/40">Gross Salary</span>
                           <span className="text-brand-blue font-bold">₹ {(emp.baseSalary + emp.allowances).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                           <span className="text-brand-grey-dark/40">Statutory Deductions</span>
                           <span className="text-brand-error font-bold">- ₹ {(emp.deductions + Math.round(emp.baseSalary * 0.17)).toLocaleString()}</span>
                        </div>
                        <div className="h-[1px] bg-brand-grey-dark/5" />
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest">Net Payable</span>
                           <span className="text-xl font-display font-black text-brand-blue">₹ {(emp.baseSalary + emp.allowances - emp.deductions - Math.round(emp.baseSalary * 0.17)).toLocaleString()}</span>
                        </div>
                     </div>
                     <div className="mt-auto grid grid-cols-2 gap-3">
                        <button 
                           onClick={() => setSelectedEmployeeForSlip(emp)}
                           className="py-3 px-4 bg-brand-grey-light text-brand-blue rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                           <Eye className="w-4 h-4" /> View
                        </button>
                        <button 
                           onClick={() => generateSlip(emp)}
                           className="py-3 px-4 bg-brand-teal text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                           <FileText className="w-4 h-4" /> Generate
                        </button>
                     </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddingEmployee && (
          <div className="fixed inset-0 bg-brand-blue/30 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden my-auto"
            >
              <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                <div>
                   <h2 className="text-xl font-display font-bold text-brand-blue">{editingEmployee ? 'Update Staff Member' : 'Enrol New Staff'}</h2>
                   <p className="text-[10px] font-black text-brand-grey-dark/30 uppercase tracking-widest">Employee Personal & Financial Profile</p>
                </div>
                <button onClick={() => { setIsAddingEmployee(false); setEditingEmployee(null); }} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X className="w-5 h-5 text-brand-grey-dark/40" />
                </button>
              </div>
              <form onSubmit={handleEmployeeSubmit} className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="col-span-1 md:col-span-2 space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Full Name</label>
                          <input type="text" name="name" required defaultValue={editingEmployee?.name} className="w-full px-6 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Designation</label>
                          <input type="text" name="designation" required defaultValue={editingEmployee?.designation} className="w-full px-6 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Department</label>
                          <select name="department" defaultValue={editingEmployee?.department} className="w-full px-6 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none">
                             <option value="Development">Development</option>
                             <option value="HR">HR</option>
                             <option value="Accounts">Accounts</option>
                             <option value="Sales">Sales</option>
                             <option value="Operations">Operations</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Joining Date</label>
                          <input type="date" name="joiningDate" required defaultValue={editingEmployee?.joiningDate} className="w-full px-6 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none" />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                         <h4 className="text-[10px] font-black text-brand-teal uppercase tracking-widest border-b border-brand-teal/10 pb-2">Salary & Compensation Provision</h4>
                         <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-brand-grey-dark/40 uppercase ml-1">Base Salary (Monthly)</label>
                              <input type="number" name="baseSalary" required defaultValue={editingEmployee?.baseSalary} className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-bold text-brand-blue focus:outline-none" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-brand-grey-dark/40 uppercase ml-1">Allowances</label>
                              <input type="number" name="allowances" defaultValue={editingEmployee?.allowances} className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-bold text-brand-blue focus:outline-none" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-brand-grey-dark/40 uppercase ml-1">Deductions</label>
                              <input type="number" name="deductions" defaultValue={editingEmployee?.deductions} className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-bold text-brand-blue focus:outline-none" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Staff Status</label>
                        <select name="status" defaultValue={editingEmployee?.status} className="w-full px-6 py-4 bg-brand-grey-light border border-brand-grey-dark/5 rounded-2xl text-sm font-bold text-brand-blue focus:outline-none">
                           <option value="Active">Active</option>
                           <option value="Inactive">Inactive</option>
                           <option value="On Leave">On Leave</option>
                        </select>
                      </div>
                      <div className="p-6 bg-brand-blue/5 rounded-3xl space-y-4 border border-brand-blue/10">
                         <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Bank Details</h4>
                         <div className="space-y-3">
                            <input type="text" name="pan" placeholder="PAN Number" defaultValue={editingEmployee?.pan} className="w-full px-4 py-3 bg-white border border-brand-grey-dark/5 rounded-xl text-[11px] font-bold text-brand-blue outline-none" />
                            <input type="text" name="bankAccount" placeholder="A/C Number" defaultValue={editingEmployee?.bankAccount} className="w-full px-4 py-3 bg-white border border-brand-grey-dark/5 rounded-xl text-[11px] font-bold text-brand-blue outline-none" />
                            <input type="text" name="ifsc" placeholder="IFSC Code" defaultValue={editingEmployee?.ifsc} className="w-full px-4 py-3 bg-white border border-brand-grey-dark/5 rounded-xl text-[11px] font-bold text-brand-blue outline-none" />
                         </div>
                      </div>
                      <button type="submit" className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-blue-900/20 hover:scale-[1.01] transition-all">
                        {editingEmployee ? 'Save Updates' : 'Enrol Staff Member'}
                      </button>
                   </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isBulkLeaveModal && (
          <div className="fixed inset-0 bg-brand-blue/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden"
             >
               <div className="p-8 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                  <h2 className="text-xl font-display font-bold text-brand-blue">Bulk Leave Entry</h2>
                  <button onClick={() => setIsBulkLeaveModal(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                    <X className="w-5 h-5 text-brand-grey-dark/40" />
                  </button>
               </div>
               <form onSubmit={(e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 const startDate = formData.get('startDate') as string;
                 const endDate = formData.get('endDate') as string;
                 const type = formData.get('type') as any;
                 
                 employees.forEach(emp => {
                   addLeaveRequest({
                     id: `LEAVE-${emp.id}-${Date.now()}`,
                     employeeId: emp.id,
                     startDate,
                     endDate,
                     type,
                     reason: 'Bulk Leave Entry',
                     status: 'Approved'
                   });
                 });
                 setIsBulkLeaveModal(false);
                 alert('Bulk leave applied for all employees.');
               }} className="p-10 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Start Date</label>
                       <input type="date" name="startDate" required className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-bold text-brand-blue" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">End Date</label>
                       <input type="date" name="endDate" required className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-bold text-brand-blue" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-brand-grey-dark/40 uppercase tracking-widest ml-1">Leave Type</label>
                    <select name="type" className="w-full px-4 py-3 bg-brand-grey-light border border-brand-grey-dark/5 rounded-xl text-xs font-bold text-brand-blue">
                       <option value="Casual">Casual</option>
                       <option value="Sick">Sick</option>
                       <option value="Paid">Paid</option>
                    </select>
                 </div>
                 <button type="submit" className="w-full py-4 bg-brand-blue text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl hover:scale-[1.01] transition-all">
                    Apply to All Staff
                 </button>
               </form>
             </motion.div>
          </div>
        )}

        {selectedEmployeeForSlip && (
           <div className="fixed inset-0 bg-brand-blue/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 20 }}
                 className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                 <div className="p-6 border-b border-brand-grey-dark/5 flex justify-between items-center bg-brand-grey-light/30">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-brand-teal rounded-2xl text-white">
                          <Printer className="w-5 h-5" />
                       </div>
                       <h3 className="text-xl font-display font-bold text-brand-blue">Pay Slip Preview</h3>
                    </div>
                    <button onClick={() => setSelectedEmployeeForSlip(null)} className="p-2.5 hover:bg-white rounded-full transition-colors">
                       <X className="w-5 h-5 text-brand-grey-dark/40" />
                    </button>
                 </div>
                 <div className="p-10 overflow-y-auto flex-1 bg-brand-grey-light/20 flex justify-center custom-scrollbar">
                    <div className="bg-white p-12 shadow-xl rounded-sm w-full max-w-[800px] font-sans border-t-[8px] border-brand-blue">
                       <div className="flex justify-between items-start border-b border-brand-grey-dark/20 pb-8 mb-8">
                          <div>
                             <h2 className="text-2xl font-black text-brand-blue uppercase">{currentCompany?.name}</h2>
                             <p className="text-xs text-brand-grey-dark/60 mt-1 max-w-xs">{currentCompany?.address}</p>
                          </div>
                          <div className="text-right">
                             <h3 className="text-xl font-black text-brand-teal">PAYSLIP</h3>
                             <p className="text-xs font-bold text-brand-grey-dark/40 uppercase tracking-widest">{selectedMonth}</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-10 mb-10 text-[11px]">
                          <div className="space-y-2">
                             <div className="flex justify-between border-b pb-1"><span className="text-brand-grey-dark/40 font-bold uppercase">Employee Name:</span> <span className="font-bold text-brand-blue">{selectedEmployeeForSlip.name}</span></div>
                             <div className="flex justify-between border-b pb-1"><span className="text-brand-grey-dark/40 font-bold uppercase">Emp ID:</span> <span className="font-bold text-brand-blue">{selectedEmployeeForSlip.id}</span></div>
                             <div className="flex justify-between border-b pb-1"><span className="text-brand-grey-dark/40 font-bold uppercase">Designation:</span> <span className="font-bold text-brand-blue">{selectedEmployeeForSlip.designation}</span></div>
                             <div className="flex justify-between border-b pb-1"><span className="text-brand-grey-dark/40 font-bold uppercase">Department:</span> <span className="font-bold text-brand-blue">{selectedEmployeeForSlip.department}</span></div>
                          </div>
                          <div className="space-y-2">
                             <div className="flex justify-between border-b pb-1"><span className="text-brand-grey-dark/40 font-bold uppercase">Bank A/C:</span> <span className="font-bold text-brand-blue">{selectedEmployeeForSlip.bankAccount || 'N/A'}</span></div>
                             <div className="flex justify-between border-b pb-1"><span className="text-brand-grey-dark/40 font-bold uppercase">PAN:</span> <span className="font-bold text-brand-blue">{selectedEmployeeForSlip.pan || 'N/A'}</span></div>
                             <div className="flex justify-between border-b pb-1"><span className="text-brand-grey-dark/40 font-bold uppercase">IFSC:</span> <span className="font-bold text-brand-blue">{selectedEmployeeForSlip.ifsc || 'N/A'}</span></div>
                             <div className="flex justify-between border-b pb-1"><span className="text-brand-grey-dark/40 font-bold uppercase">Days Payable:</span> <span className="font-bold text-brand-blue">30</span></div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-0 border border-brand-grey-dark/20 text-[11px]">
                          <div className="border-r border-brand-grey-dark/20">
                             <div className="bg-brand-grey-light/50 p-2 font-black uppercase text-[9px] tracking-widest border-b">Earnings</div>
                             <div className="p-4 space-y-3">
                                <div className="flex justify-between"><span>Basic Salary</span> <span>{selectedEmployeeForSlip.baseSalary.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>House Rent Allowance (HRA)</span> <span>{(selectedEmployeeForSlip.baseSalary * 0.4).toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Other Allowances</span> <span>{selectedEmployeeForSlip.allowances.toLocaleString()}</span></div>
                                <div className="pt-2 border-t font-black flex justify-between text-brand-blue"><span>Total Earnings</span> <span>{(selectedEmployeeForSlip.baseSalary * 1.4 + selectedEmployeeForSlip.allowances).toLocaleString()}</span></div>
                             </div>
                          </div>
                          <div>
                             <div className="bg-brand-grey-light/50 p-2 font-black uppercase text-[9px] tracking-widest border-b">Deductions</div>
                             <div className="p-4 space-y-3">
                                <div className="flex justify-between"><span>Provident Fund (PF)</span> <span>{(selectedEmployeeForSlip.baseSalary * 0.12).toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Income Tax (TDS)</span> <span>{(selectedEmployeeForSlip.baseSalary * 0.05).toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Other Deductions</span> <span>{selectedEmployeeForSlip.deductions.toLocaleString()}</span></div>
                                <div className="pt-2 border-t font-black flex justify-between text-brand-error"><span>Total Deductions</span> <span>{(selectedEmployeeForSlip.baseSalary * 0.17 + selectedEmployeeForSlip.deductions).toLocaleString()}</span></div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="mt-8 bg-brand-blue/5 p-6 rounded-xl flex justify-between items-center border border-brand-blue/10">
                          <div>
                             <p className="text-[9px] font-black text-brand-grey-dark/40 uppercase tracking-widest mb-1">Net Salary Payable</p>
                             <h4 className="text-sm font-black text-brand-blue uppercase italic">In Words: Rupees {((selectedEmployeeForSlip.baseSalary * 1.4 + selectedEmployeeForSlip.allowances) - (selectedEmployeeForSlip.baseSalary * 0.17 + selectedEmployeeForSlip.deductions)).toLocaleString()} Only</h4>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black text-brand-blue">₹ {((selectedEmployeeForSlip.baseSalary * 1.4 + selectedEmployeeForSlip.allowances) - (selectedEmployeeForSlip.baseSalary * 0.17 + selectedEmployeeForSlip.deductions)).toLocaleString()}</p>
                          </div>
                       </div>

                       <div className="mt-16 flex justify-between items-end">
                          <div className="w-40 border-t border-brand-grey-dark/40 pt-2 text-center text-[9px] font-bold text-brand-grey-dark/40 uppercase">Employer Signature</div>
                          <div className="w-40 border-t border-brand-grey-dark/40 pt-2 text-center text-[9px] font-bold text-brand-grey-dark/40 uppercase">Employee Signature</div>
                       </div>
                    </div>
                 </div>
                 <div className="p-6 bg-brand-grey-light/30 border-t border-brand-grey-dark/5 flex justify-end gap-3">
                    <button className="px-8 py-3 bg-brand-blue text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2">
                       <Printer className="w-4 h-4" /> Print Payslip
                    </button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
