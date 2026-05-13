import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, CheckCircle, Clock, Loader2, Mail } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorPrescriptions, emailPrescription, fetchDoctorAppointments, updateDoctorAppointmentStatus } from '../../../features/appointments/doctorAppointmentSlice';
import toast from 'react-hot-toast';
import PrescriptionModal from '../components/PrescriptionModal';
import PrescriptionViewerModal from '../components/PrescriptionViewerModal';

const ManagePrescriptions = () => {
  const dispatch = useDispatch();
  const { prescriptions, appointments, isLoading } = useSelector(state => state.doctorAppointments);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewerData, setViewerData] = useState(null);

  useEffect(() => {
    dispatch(fetchDoctorPrescriptions());
    dispatch(fetchDoctorAppointments());
  }, [dispatch]);

  const handleIssuePrescription = async (data) => {
    setIsSubmitting(true);
    try {
      await dispatch(updateDoctorAppointmentStatus({ appointmentId: data.appointmentId, status: "COMPLETED", prescription: data.prescription })).unwrap();
      toast.success("Prescription generated & attached successfully!");
      dispatch(fetchDoctorPrescriptions());
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err || "Failed to save prescription. Ensure all fields are correctly formatted.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailPrescription = (appointmentId) => {
    const loadingId = toast.loading("Sending email...");
    dispatch(emailPrescription(appointmentId))
      .unwrap()
      .then(() => {
        toast.success("Prescription emailed securely!", { id: loadingId });
      })
      .catch((err) => {
        toast.error(err || "Failed to email prescription", { id: loadingId });
      });
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Pill className="w-8 h-8 text-indigo-500" />
            Manage Prescriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Issue and track patient medications</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 transition-all font-medium">
          <Plus className="w-5 h-5" /> New Prescription
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Prescriptions</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-48 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 min-h-50">
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
              ) : prescriptions.length > 0 ? (
                prescriptions.filter(p => p.patientId?.fullname?.toLowerCase().includes(search.toLowerCase())).map(p => {
                  const statusLabel = p.status === 'COMPLETED' ? 'Completed' : 'Active';
                  return (
                    <div key={p._id} className="p-5 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{p.patientId?.fullname || 'Unknown Patient'}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {p.prescription?.medications?.[0]?.name || 'N/A'} · Issued: {new Date(p.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          statusLabel === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {statusLabel === 'Active' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          {statusLabel}
                        </span>
                        <button onClick={() => handleEmailPrescription(p._id)} className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md transition-colors" title="Email Prescription to Patient">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewerData(p)} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">View</button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-500 border-t border-gray-100 dark:border-gray-700">
                  No prescriptions found.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
            <Pill className="absolute -right-4 -top-8 w-32 h-32 text-indigo-400 opacity-20 transform rotate-45 pointer-events-none" />
            <h3 className="text-xl font-bold mb-2">Quick Rx Draft</h3>
            <p className="text-indigo-100 text-sm mb-6">Need to write a prescription quickly? Access your templates.</p>
            <div className="space-y-3 relative z-10">
              <button className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors text-sm font-medium">Antibiotics Protocol (General)</button>
              <button className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors text-sm font-medium">Pain Management (Level 1)</button>
              <button className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors text-sm font-medium">Antihistamine Standard</button>
            </div>
          </div>
        </div>
      </div>
      
      <PrescriptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleIssuePrescription}
        availableAppointments={appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED')}
        isSubmitting={isSubmitting}
      />

      <PrescriptionViewerModal
        isOpen={!!viewerData}
        onClose={() => setViewerData(null)}
        appointment={viewerData}
      />
    </div>
  );
};

export default ManagePrescriptions;
