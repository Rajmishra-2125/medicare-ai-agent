import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardSkeleton from "../../../components/skeletons/DashboardSkeleton";
import { 
  getAllAppointments, 
  getAllDoctors, 
  getAllUsers, 
  getAllSlots,
  createSlot, 
  bookAppointment, 
  rescheduleAppointment 
} from '../../../features/admin/AdminSlice';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  Loader2,
  ChevronRight,
  UserRound,
  Plus,
  RefreshCw,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageAppointment = () => {
  const dispatch = useDispatch();
  const { appointments, doctors, users, slots, isLoading, isError, message } = useSelector((state) => state.admin);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Form states
  const [slotForm, setSlotForm] = useState({
    doctorId: "",
    date: "",
    startTime: "",
    endTime: "",
    slotduration: "30 mins"
  });

  const [bookForm, setBookForm] = useState({
    patientId: "",
    doctorId: "",
    slotId: "",
    reason: ""
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    newSlotId: "",
    reason: ""
  });

  useEffect(() => {
    dispatch(getAllAppointments());
    dispatch(getAllDoctors());
    dispatch(getAllUsers());
    dispatch(getAllSlots());
  }, [dispatch]);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    
    return appointments.filter(apt => {
      const patientName = apt.patientId?.fullname || "";
      const doctorName = apt.doctorId?.doctor || "";
      const patientMatch = patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const doctorMatch = doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === "all" || apt.status.toLowerCase() === statusFilter.toLowerCase();
      
      return (patientMatch || doctorMatch) && statusMatch;
    });
  }, [appointments, searchTerm, statusFilter]);

  const availableSlotsForDoctor = useMemo(() => {
    const dId = bookForm.doctorId || (selectedAppointment?.doctorId?._id || selectedAppointment?.doctorId);
    if (!dId || !slots) return [];
    return slots.filter(s => (s.doctorId?._id === dId || s.doctorId === dId) && s.status === "AVAILABLE");
  }, [slots, bookForm.doctorId, selectedAppointment]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createSlot(slotForm)).unwrap();
      toast.success("Slot created successfully");
      setShowSlotModal(false);
      setSlotForm({ doctorId: "", date: "", startTime: "", endTime: "", slotduration: "30 mins" });
    } catch (err) {
      toast.error(err || "Failed to create slot");
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await dispatch(bookAppointment(bookForm)).unwrap();
      toast.success("Appointment booked successfully");
      setShowBookModal(false);
      setBookForm({ patientId: "", doctorId: "", slotId: "", reason: "" });
      dispatch(getAllSlots()); // Refresh available slots
    } catch (err) {
      toast.error(err || "Failed to book appointment");
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    try {
      await dispatch(rescheduleAppointment({ 
        appointmentId: selectedAppointment?._id, 
        rescheduleData: rescheduleForm 
      })).unwrap();
      toast.success("Appointment rescheduled successfully");
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setRescheduleForm({ newSlotId: "", reason: "" });
      dispatch(getAllSlots()); // Refresh available slots
    } catch (err) {
      toast.error(err || "Failed to reschedule");
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      case 'RESCHEDULED': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'CONFIRMED': return <Calendar className="w-3.5 h-3.5" />;
      case 'PENDING': return <Clock className="w-3.5 h-3.5" />;
      case 'CANCELLED': return <XCircle className="w-3.5 h-3.5" />;
      case 'RESCHEDULED': return <RefreshCw className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 max-w-400 mx-auto animate-fade-in pb-10 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Manage Appointments</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">View and oversee all patient-doctor scheduling</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSlotModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Slot
          </button>
          
          <button 
            onClick={() => setShowBookModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            Book New
          </button>

          <div className="h-8 w-px bg-gray-200 dark:bg-slate-800 mx-1 hidden md:block" />

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full md:w-48 transition-all shadow-sm"
            />
          </div>
          
          <div className="relative inline-block">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer shadow-sm capitalize"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Appointments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                <th className="px-6 py-4 text-[13px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-[13px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-[13px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-[13px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[13px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center overflow-hidden shrink-0">
                          {apt.patientId?.profileImage ? (
                            <img src={apt.patientId.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-[15px]">{apt.patientId?.fullname || "Deleted User"}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{apt.patientId?.phone || "No phone"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <UserRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-[14px]">Dr. {apt.doctorId?.doctor || "Doctor"}</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{apt.doctorId?.specialization || "General"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(apt.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {apt.timeSlots}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(apt.status)}`}>
                        {getStatusIcon(apt.status)}
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowRescheduleModal(true);
                          }}
                          title="Reschedule"
                          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-500">No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Slot */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Slot</h3>
              <button onClick={() => setShowSlotModal(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateSlot} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Select Doctor</label>
                <select 
                  required
                  value={slotForm.doctorId}
                  onChange={(e) => setSlotForm({...slotForm, doctorId: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.doctor}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Date</label>
                  <input type="date" required value={slotForm.date} onChange={(e) => setSlotForm({...slotForm, date: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Duration</label>
                  <input type="text" value={slotForm.slotduration} onChange={(e) => setSlotForm({...slotForm, slotduration: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Start Time</label>
                  <input type="text" placeholder="e.g. 09:00 AM" required value={slotForm.startTime} onChange={(e) => setSlotForm({...slotForm, startTime: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 dark:text-slate-300">End Time</label>
                  <input type="text" placeholder="e.g. 09:30 AM" required value={slotForm.endTime} onChange={(e) => setSlotForm({...slotForm, endTime: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"/>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 mt-4">Create Slot</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Book Appointment */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Book New Appointment</h3>
              <button onClick={() => setShowBookModal(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Patient</label>
                <select required value={bookForm.patientId} onChange={(e) => setBookForm({...bookForm, patientId: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                  <option value="">Select Patient...</option>
                  {users.filter(u => u.role === "PATIENT").map(u => <option key={u._id} value={u._id}>{u.fullname}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Doctor</label>
                <select required value={bookForm.doctorId} onChange={(e) => setBookForm({...bookForm, doctorId: e.target.value, slotId: ""})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                  <option value="">Select Doctor...</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.doctor} ({d.specialization})</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Available Slot</label>
                <select required value={bookForm.slotId} onChange={(e) => setBookForm({...bookForm, slotId: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" disabled={!bookForm.doctorId}>
                  <option value="">{bookForm.doctorId ? "Choose a slot..." : "Select doctor first"}</option>
                  {availableSlotsForDoctor.map(s => (
                    <option key={s._id} value={s._id}>
                      {new Date(s.date).toLocaleDateString()} | {s.startTime} - {s.endTime}
                    </option>
                  ))}
                </select>
                {bookForm.doctorId && availableSlotsForDoctor.length === 0 && <p className="text-[11px] text-red-500 font-medium">No available slots for this doctor.</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Reason</label>
                <textarea required value={bookForm.reason} onChange={(e) => setBookForm({...bookForm, reason: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm h-20 resize-none" placeholder="E.g. Regular checkup..."/>
              </div>
              <button type="submit" disabled={!bookForm.slotId} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 mt-4">Confirm Booking</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reschedule */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reschedule Appointment</h3>
              <button onClick={() => setShowRescheduleModal(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <div className="px-6 pt-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Current Schedule</p>
                <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                  {new Date(selectedAppointment?.date).toLocaleDateString()} | {selectedAppointment?.timeSlots}
                </p>
              </div>
            </div>
            <form onSubmit={handleReschedule} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Select New Slot</label>
                <select required value={rescheduleForm.newSlotId} onChange={(e) => setRescheduleForm({...rescheduleForm, newSlotId: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                  <option value="">Choose new slot...</option>
                  {availableSlotsForDoctor.map(s => (
                    <option key={s._id} value={s._id}>
                      {new Date(s.date).toLocaleDateString()} | {s.startTime} - {s.endTime}
                    </option>
                  ))}
                </select>
                {availableSlotsForDoctor.length === 0 && <p className="text-[11px] text-red-500 font-medium">No other available slots to reschedule to.</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300">Reason for change</label>
                <textarea value={rescheduleForm.reason} onChange={(e) => setRescheduleForm({...rescheduleForm, reason: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm h-20 resize-none" placeholder="E.g. Doctor unavailable..."/>
              </div>
              <button type="submit" disabled={!rescheduleForm.newSlotId} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 mt-4 uppercase text-xs tracking-widest">Reschedule Now</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointment;