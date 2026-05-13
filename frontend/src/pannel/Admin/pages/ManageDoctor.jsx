import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from '../../../components/common/Skeleton';
import DoctorProfileModal from '../components/DoctorProfileModal';
import { 
  getAllDoctors, 
  approveDoctor, 
  rejectDoctor, 
  deleteDoctor, 
  createDoctor,
  reset 
} from '../../../features/admin/AdminSlice';
import { 
  Search, 
  Filter, 
  UserRound, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Eye,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
  X,
  UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageDoctor = () => {
  const dispatch = useDispatch();
  const { doctors, isLoading, isError, message, isSuccess } = useSelector((state) => state.admin);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [specFilter, setSpecFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Create Form State
  const [doctorForm, setDoctorForm] = useState({
    fullname: "",
    email: "",
    password: "password123",
    phone: "",
    gender: "MALE",
    specialization: "",
    experience: "",
    consultationFee: "",
    licenseNumber: "",
    clinicName: "MediCare Clinic"
  });

  useEffect(() => {
    dispatch(getAllDoctors());
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

  const specializations = useMemo(() => {
    if (!doctors) return [];
    const specs = doctors.map(d => d.specialization).filter(Boolean);
    return ["all", ...new Set(specs)];
  }, [doctors]);

  const { pendingDoctors, approvedDoctors } = useMemo(() => {
    if (!doctors) return { pendingDoctors: [], approvedDoctors: [] };
    
    const filtered = doctors.filter(doc => {
      const nameMatch = doc.doctorId?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        doc.doctor?.toLowerCase().includes(searchTerm.toLowerCase());
      const emailMatch = doc.doctorId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const specMatch = specFilter === "all" || doc.specialization === specFilter;
      
      let statusMatch = true;
      if (statusFilter === "approved") statusMatch = doc.isVerified === true;
      else if (statusFilter === "pending") statusMatch = doc.isVerified === false;
      
      return (nameMatch || emailMatch) && specMatch && statusMatch;
    });

    return {
      pendingDoctors: filtered.filter(d => !d.isVerified),
      approvedDoctors: filtered.filter(d => d.isVerified)
    };
  }, [doctors, searchTerm, specFilter, statusFilter]);

  const stats = useMemo(() => {
    if (!doctors) return { total: 0, approved: 0, pending: 0 };
    return {
      total: doctors.length,
      approved: doctors.filter(d => d.isVerified).length,
      pending: doctors.filter(d => !d.isVerified).length
    };
  }, [doctors]);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createDoctor(doctorForm)).unwrap();
      setShowCreateModal(false);
      setDoctorForm({
        fullname: "", email: "", password: "password123", phone: "", 
        gender: "MALE", specialization: "", experience: "", 
        consultationFee: "", licenseNumber: "", clinicName: "MediCare Clinic"
      });
    } catch (err) {
      // Errors are handled by the global useEffect via isError state
    }
  };

  const handleApprove = async (id) => {
    try {
      await dispatch(approveDoctor(id)).unwrap();
    } catch (err) {
      // Handled by useEffect
    }
  };

  const handleReject = async (id) => {
    try {
      await dispatch(rejectDoctor(id)).unwrap();
    } catch (err) {
      // Handled by useEffect
    }
  };

  const handleDelete = async () => {
    if (!selectedDoctor) return;
    try {
      await dispatch(deleteDoctor(selectedDoctor._id)).unwrap();
      setShowDeleteModal(false);
      setSelectedDoctor(null);
    } catch (err) {
      // Handled by useEffect
    }
  };

  if (isLoading && !doctors?.length) {
    return (
      <div className="space-y-6 max-w-400 mx-auto animate-fade-in pb-10">
        <div className="flex flex-col gap-2 mb-8">
           <Skeleton className="h-8 w-64 rounded-lg" />
           <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800 p-5 flex flex-col shadow-sm h-50">
              <div className="flex items-start gap-4">
                 <Skeleton variant="circle" className="w-14 h-14 shrink-0" />
                 <div className="flex-1 space-y-2 pt-1">
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                 </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                 <Skeleton className="h-12 w-full rounded-lg" />
                 <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-400 mx-auto animate-fade-in pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Manage Doctors</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Review applications and manage doctor profiles</p>
        </div>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Add New Doctor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Doctors", value: stats.total, icon: UserRound, color: "indigo" },
          { label: "Approved Providers", value: stats.approved, icon: ShieldCheck, color: "emerald" },
          { label: "Pending Review", value: stats.pending, icon: Clock, color: "amber" },
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
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-[15px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <select 
              value={specFilter}
              onChange={(e) => setSpecFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm capitalize"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec === "all" ? "All Specializations" : spec}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm capitalize"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Review</option>
            </select>
            <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Pending Applications Section */}
      {pendingDoctors.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </div>
              Pending Applications
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 text-xs font-black ring-1 ring-amber-500/20">{pendingDoctors.length} New</span>
            </h2>
          </div>
          
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[24px] shadow-2xl shadow-indigo-500/5 border border-white dark:border-slate-800 overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-br from-amber-50/50 to-transparent dark:from-amber-900/10 dark:to-transparent pointer-events-none" />
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800/80">
                    <th className="px-8 py-5 text-[10px] font-black text-amber-600/80 dark:text-amber-500/70 uppercase tracking-[0.2em] whitespace-nowrap">Applicant Profile</th>
                    <th className="px-8 py-5 text-[10px] font-black text-amber-600/80 dark:text-amber-500/70 uppercase tracking-[0.2em] whitespace-nowrap">Specialization</th>
                    <th className="px-8 py-5 text-[10px] font-black text-amber-600/80 dark:text-amber-500/70 uppercase tracking-[0.2em] whitespace-nowrap text-right">Review Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                  {pendingDoctors.map((doc) => (
                    <tr key={doc._id} className="hover:bg-white dark:hover:bg-slate-800/50 transition-all duration-300 group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4 py-1">
                          <div className="w-12 h-12 rounded-[16px] bg-indigo-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-white dark:border-slate-700 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                            {doc.doctorId?.profileImage ? (
                              <img src={doc.doctorId.profileImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <UserRound className="w-6 h-6 text-indigo-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 dark:text-white text-base group-hover:text-indigo-600 transition-colors">{doc.doctorId?.fullname || doc.doctor}</p>
                            <p className="text-[11px] text-gray-500 dark:text-slate-400 uppercase font-black tracking-widest mt-0.5">{doc.doctorId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-black uppercase tracking-widest border border-amber-200/50 dark:border-amber-500/20 shadow-sm">
                          {doc.specialization}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => { setSelectedDoctor(doc); setShowDetailModal(true); }}
                            className="p-2.5 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-500/20"
                            title="Inspect Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1"></div>
                          <button 
                            onClick={() => handleReject(doc._id)}
                            className="px-4 py-2 bg-white dark:bg-slate-800 text-red-500 border border-red-100 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-xs font-black transition-all flex items-center gap-2 active:scale-95 shadow-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button 
                            onClick={() => handleApprove(doc._id)}
                            className="px-5 py-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
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
      )}

      {/* Verified Provider Registry (Card Grid) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Verified Provider Registry
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 text-xs font-black">{approvedDoctors.length}</span>
          </h2>
        </div>

        {approvedDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {approvedDoctors.map((doc) => (
              <div key={doc._id} className="bg-white dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-600 transition-colors group flex flex-col shadow-sm">
                <div className="p-5 flex-1 relative">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-slate-700 shrink-0 relative">
                      {doc.doctorId?.profileImage ? (
                        <img src={doc.doctorId.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserRound className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="absolute right-0 bottom-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 border-solid z-10 flex items-center justify-center">
                        <CheckCircle2 className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight truncate">{doc.doctorId?.fullname || doc.doctor}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{doc.specialization}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-4 bg-gray-50/50 dark:bg-slate-800/30 p-3 rounded-lg border border-gray-100 dark:border-slate-800">
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-400 tracking-wider">Rating</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-amber-500 text-[13px]">★</span>
                        <span className="text-[13px] font-semibold text-gray-800 dark:text-slate-200">{doc.rating || "5.0"}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-medium text-gray-400 tracking-wider">Experience</p>
                      <p className="text-[13px] font-semibold text-gray-800 dark:text-slate-200 mt-0.5">{doc.experience} Years</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-800 flex divide-x divide-gray-100 dark:divide-slate-800">
                  <button 
                    onClick={() => { setSelectedDoctor(doc); setShowDetailModal(true); }}
                    className="flex-1 py-3 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-2"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => { setSelectedDoctor(doc); setShowDeleteModal(true); }}
                    className="px-4 py-3 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center"
                    title="Remove Provider"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 p-12 text-center">
             <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-gray-500 dark:text-slate-400 font-medium">No verified doctors found.</p>
             <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {(pendingDoctors.length === 0 && approvedDoctors.length === 0) && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-20 text-center border border-gray-100 dark:border-slate-800">
           <div className="max-w-xs mx-auto">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No matching results</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm">We couldn't find any doctors matching "{searchTerm}". Try clearing your filters.</p>
           </div>
        </div>
      )}

      {/* Modal: Create Doctor */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl w-full max-w-3xl rounded-[32px] shadow-2xl shadow-indigo-900/20 border border-white dark:border-slate-800 overflow-hidden transform animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="px-10 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-10 -mt-10 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Register New Professional</h3>
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mt-1">Official Hospital Registry</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-3 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 text-gray-400 rounded-[16px] transition-all shadow-sm ring-1 ring-gray-100 dark:ring-slate-700 relative z-10"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateDoctor} className="flex-1 overflow-y-auto overflow-x-hidden">
               <div className="p-10 space-y-12">
                  {/* Account Section */}
                  <div className="relative bg-white dark:bg-slate-800/50 p-8 rounded-[24px] border border-gray-100 dark:border-slate-700/50 shadow-sm">
                    <div className="absolute -top-4 left-8 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-500/20">System Identity</div>
                    <div className="grid grid-cols-2 gap-8 mt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-black text-gray-700 dark:text-slate-300">Legal Full Name</label>
                          <input required type="text" value={doctorForm.fullname} onChange={e => setDoctorForm({...doctorForm, fullname: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. Dr. Sarah Connor"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-gray-700 dark:text-slate-300">Email Address</label>
                          <input required type="email" value={doctorForm.email} onChange={e => setDoctorForm({...doctorForm, email: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="sarah@medicare.com"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-gray-700 dark:text-slate-300">Phone Directory</label>
                          <input required type="tel" value={doctorForm.phone} onChange={e => setDoctorForm({...doctorForm, phone: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" placeholder="+1 (555) 000-0000"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-gray-700 dark:text-slate-300">Biological Gender</label>
                          <select value={doctorForm.gender} onChange={e => setDoctorForm({...doctorForm, gender: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none">
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                    </div>
                  </div>

                  {/* Professional Section */}
                  <div className="relative bg-linear-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 dark:to-transparent p-8 rounded-[24px] border border-emerald-100/50 dark:border-emerald-500/20 shadow-sm">
                    <div className="absolute -top-4 left-8 px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20">Professional Credentials</div>
                    <div className="grid grid-cols-2 gap-8 mt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 dark:text-slate-300">Clinical Specialization</label>
                        <input required type="text" value={doctorForm.specialization} onChange={e => setDoctorForm({...doctorForm, specialization: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 border border-emerald-100/50 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. Cardiologist"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-black text-gray-700 dark:text-slate-300">Total Exp. (Yrs)</label>
                          <input required type="number" value={doctorForm.experience} onChange={e => setDoctorForm({...doctorForm, experience: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 border border-emerald-100/50 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-black text-gray-700 dark:text-slate-300">Tariff Rate ($)</label>
                          <input required type="number" value={doctorForm.consultationFee} onChange={e => setDoctorForm({...doctorForm, consultationFee: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 border border-emerald-100/50 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"/>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 dark:text-slate-300">Medical License Number</label>
                        <input required type="text" value={doctorForm.licenseNumber} onChange={e => setDoctorForm({...doctorForm, licenseNumber: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 border border-emerald-100/50 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none" placeholder="LIC-12345678"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 dark:text-slate-300">Hospital / Facility Name</label>
                        <input type="text" value={doctorForm.clinicName} onChange={e => setDoctorForm({...doctorForm, clinicName: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 border border-emerald-100/50 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none" placeholder="MediCare Clinic"/>
                      </div>
                    </div>
                  </div>
               </div>
              
              <div className="sticky bottom-0 px-10 py-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 flex gap-4 shrink-0">
                 <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 bg-white dark:bg-slate-800 rounded-2xl font-black text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all border border-gray-200 dark:border-slate-700 flex items-center justify-center gap-2 shadow-sm">
                   Cancel Setup
                 </button>
                 <button type="submit" className="flex-2 py-4 bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2">
                   <UserPlus className="w-5 h-5" />
                   Generate Registration Token
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detail View */}
      {showDetailModal && selectedDoctor && (
        <DoctorProfileModal 
          doctor={selectedDoctor} 
          onClose={() => setShowDetailModal(false)} 
          onApprove={(id) => { handleApprove(id); setShowDetailModal(false); }} 
        />
      )}

      {/* Modal: Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 p-8 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                 <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Doctor?</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                 Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white font-serif">Dr. {selectedDoctor?.doctorId?.fullname || selectedDoctor?.doctor}</span>? This action will permanently delete their account and profile.
              </p>
              <div className="flex gap-3">
                 <button onClick={() => { setShowDeleteModal(false); setSelectedDoctor(null); }} className="flex-1 py-3 font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition-all">Cancel</button>
                 <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95">Delete Permanently</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctor;