import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardSkeleton from "../../../components/skeletons/DashboardSkeleton";
import { useNavigate } from 'react-router-dom';
import { 
  getAllUsers, 
  deletePatient,
  reset 
} from '../../../features/admin/AdminSlice';
import { 
  Search, 
  Filter, 
  UserRound, 
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  X,
  AlertCircle,
  Loader2,
  Users,
  Activity,
  UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManagePatient = () => {
  const dispatch = useDispatch();
  const { users, isLoading, isError, message, isSuccess } = useSelector((state) => state.admin);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && message) {
      toast.success(message);
      dispatch(reset());
    }
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  const patients = useMemo(() => {
    if (!users) return [];
    // Only return users with role PATIENT
    return users.filter(user => user.role === 'PATIENT');
  }, [users]);

  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    
    return patients.filter(patient => {
      const nameMatch = patient.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
      const emailMatch = patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let statusMatch = true;
      if (statusFilter === "active") statusMatch = patient.isActive === true;
      else if (statusFilter === "inactive") statusMatch = patient.isActive === false;
      
      return (nameMatch || emailMatch) && statusMatch;
    });
  }, [patients, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    if (!patients) return { total: 0, active: 0, new: 0 };
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    return {
      total: patients.length,
      active: patients.filter(p => p.isActive !== false).length,
      new: patients.filter(p => new Date(p.createdAt) > thirtyDaysAgo).length
    };
  }, [patients]);

  const handleDelete = async () => {
    if (!selectedPatient) return;
    try {
      await dispatch(deletePatient(selectedPatient._id)).unwrap();
      setShowDeleteModal(false);
      setSelectedPatient(null);
    } catch (err) {
      // Handled by useEffect
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 max-w-400 mx-auto animate-fade-in pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Manage Patients</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Review and manage all registered patient accounts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Patients", value: stats.total, icon: Users, color: "indigo" },
          { label: "Active Accounts", value: stats.active, icon: Activity, color: "emerald" },
          { label: "New (Last 30 Days)", value: stats.new, icon: UserPlus, color: "sky" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by patient name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-[15px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Patient List (Table) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Patient</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest hidden sm:table-cell">Contact</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest hidden md:table-cell">Gender</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest hidden lg:table-cell">Joined</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {filteredPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center overflow-hidden border border-white dark:border-slate-800 shadow-sm relative group-hover:scale-105 transition-transform shrink-0">
                          {patient.profileImage ? (
                            <img src={patient.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{patient.fullname}</p>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase font-bold tracking-tight sm:hidden">{patient.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{patient.email}</span>
                        </div>
                        {patient.phone && (
                           <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
                             <Phone className="w-3.5 h-3.5" />
                             <span className="text-xs font-medium">{patient.phone}</span>
                           </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="inline-flex px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase tracking-tight">
                        {patient.gender || "UNSPECIFIED"}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{new Date(patient.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/patients/${patient._id}`)}
                          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedPatient(patient); setShowDeleteModal(true); }}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete Patient"
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
        ) : (
          <div className="p-12 text-center">
             <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-gray-500 dark:text-slate-400 font-medium">No patients found.</p>
             <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Modal: Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 p-8 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                 <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Patient?</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                 Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white">{selectedPatient?.fullname}</span>? This action will permanently delete their account and history.
              </p>
              <div className="flex gap-3">
                 <button onClick={() => { setShowDeleteModal(false); setSelectedPatient(null); }} className="flex-1 py-3 font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition-all">Cancel</button>
                 <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95">Delete Permanently</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ManagePatient;