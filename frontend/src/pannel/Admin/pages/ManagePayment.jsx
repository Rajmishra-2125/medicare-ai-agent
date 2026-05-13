import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAppointments } from "../../../features/admin/AdminSlice";
import DashboardSkeleton from "../../../components/skeletons/DashboardSkeleton";
import { generateInvoice } from "../../../utils/generateInvoice";
import { 
  CreditCard, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const ManagePayment = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { appointments, isLoading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  const transactions = useMemo(() => {
    if (!appointments) return [];
    return appointments.map(apt => ({
      id: apt._id,
      patient: apt.patientId?.fullname || "Deleted User",
      patientEmail: apt.patientId?.email || "",
      doctor: `Dr. ${apt.doctorId?.doctor || "Unknown"}`,
      specialization: apt.doctorId?.specialization || "",
      amount: apt.consultationFee || apt.doctorId?.consultationFee || 0,
      date: apt.date,
      status: apt.paymentStatus || (apt.status === "COMPLETED" ? "PAID" : "PENDING"),
      method: apt.paymentMethod || "Online",
      appointmentStatus: apt.status
    })).filter(txn => {
      const search = searchTerm.toLowerCase();
      return txn.id.toLowerCase().includes(search) || 
             txn.patient.toLowerCase().includes(search) || 
             txn.doctor.toLowerCase().includes(search);
    });
  }, [appointments, searchTerm]);

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let pendingPayments = 0;
    let completedTxn = 0;
    let refunds = 0;

    if (appointments) {
      appointments.forEach(apt => {
        const fee = apt.consultationFee || apt.doctorId?.consultationFee || 0;
        const pStatus = apt.paymentStatus || (apt.status === "COMPLETED" ? "PAID" : "PENDING");
        
        if (pStatus === 'PAID') {
          totalRevenue += fee;
          completedTxn += 1;
        } else if (pStatus === 'PENDING') {
          pendingPayments += fee;
        } else if (pStatus === 'REFUNDED') {
          refunds += fee;
        }
      });
    }

    return [
      { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+12.5%", isIncrease: true, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
      { label: "Pending Payments", value: `₹${pendingPayments.toLocaleString()}`, change: "-2.4%", isIncrease: false, icon: Clock, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-500/10" },
      { label: "Successful Transactions", value: completedTxn.toLocaleString(), change: "+8.2%", isIncrease: true, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
      { label: "Refunds", value: `₹${refunds.toLocaleString()}`, change: "+1.1%", isIncrease: true, icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-500/10" },
    ];
  }, [appointments]);

  const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
      case "PAID":
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> PAID</span>;
      case "PENDING":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"><Clock className="w-3.5 h-3.5" /> PENDING</span>;
      case "FAILED":
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"><XCircle className="w-3.5 h-3.5" /> FAILED</span>;
      case "REFUNDED":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400"><CreditCard className="w-3.5 h-3.5" /> REFUNDED</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">{status}</span>;
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
      <div className="space-y-6 max-w-400 mx-auto animate-fade-in pb-8">
        {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Payments & Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage all billing, invoices, and financial records.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stat.isIncrease ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-500/10'}`}>
                {stat.isIncrease ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400 font-semibold">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Patient details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {transactions.length > 0 ? (
                transactions.map((txn, index) => (
                  <tr key={txn.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{txn.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{new Date(txn.date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">{new Date(txn.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{txn.patient}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">{txn.doctor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">₹{txn.amount}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">
                      {txn.method}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(txn.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                         onClick={() => generateInvoice(txn)}
                         title="Download PDF Invoice"
                         className="p-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex items-center text-sm text-gray-500 dark:text-slate-400">
          <span>Showing {transactions.length} entries</span>
        </div>
      </div>
    </div>
  );
};

export default ManagePayment;