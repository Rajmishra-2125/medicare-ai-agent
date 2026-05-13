import React, { useEffect, useState } from 'react';
import { CalendarRange, Calendar as CalendarIcon, Clock, Video, Building, RefreshCw, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorAppointments, updateDoctorAppointmentStatus } from '../../../features/appointments/doctorAppointmentSlice';
import toast from 'react-hot-toast';
import PrescriptionModal from '../components/Prescriptions/PrescriptionModal';

const DoctorAppointments = () => {
  const dispatch = useDispatch();
  const { appointments, isLoading } = useSelector(state => state.doctorAppointments);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeApt, setActiveApt] = useState(null);

  useEffect(() => {
    dispatch(fetchDoctorAppointments());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDoctorAppointments());
    setRefreshing(false);
  };

  const handleStatusChange = (e, apt) => {
    const status = e.target.value;
    if (status === 'COMPLETED') {
      setActiveApt(apt);
      setIsModalOpen(true);
      // Let React uncontrolled value remain as is until Redux syncs via proper payload handling in `handleIssuePrescription`
      e.target.value = apt.status; 
    } else if (status) {
      dispatch(updateDoctorAppointmentStatus({ appointmentId: apt._id, status }));
    }
  };

  const handleIssuePrescription = async (data) => {
    setIsSubmitting(true);
    try {
      await dispatch(updateDoctorAppointmentStatus({ appointmentId: data.appointmentId, status: "COMPLETED", prescription: data.prescription })).unwrap();
      toast.success("Success! Patient discharged and files appended.");
      dispatch(fetchDoctorAppointments());
      setIsModalOpen(false);
      setActiveApt(null);
    } catch (e) {
      toast.error(e || "Failed to generate prescription successfully");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarRange className="w-8 h-8 text-blue-600" />
            Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your schedule and consultations</p>
        </div>
        <button 
          onClick={handleRefresh} 
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          {refreshing || isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-100">
        <div className="p-6">
          <div className="grid gap-4">
            {isLoading && !refreshing ? (
              <div className="p-12 flex justify-center w-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : appointments.length > 0 ? (
              appointments.map((apt) => (
                <div key={apt._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-sm transition-all bg-gray-50/50 dark:bg-gray-900/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{apt.patientId?.name || apt.patientId?.fullname || "Unknown Patient"}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(apt.date).toLocaleDateString()} at {apt.timeSlots}</span>
                        <span className="flex items-center gap-1">
                          {apt.meetingType === 'ONLINE' ? <Video className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />} 
                          {apt.meetingType || 'In-Person'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      ['CONFIRMED', 'COMPLETED'].includes(apt.status) ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' : 
                      apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                    }`}>
                      {apt.status}
                    </span>
                    <select 
                      className="text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 outline-none cursor-pointer"
                      onChange={(e) => handleStatusChange(e, apt)}
                      value={apt.status}
                      disabled={['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(apt.status)}
                    >
                      <option value="" disabled>Update Status</option>
                      <option value="PENDING" disabled>Pending</option>
                      <option value="CONFIRMED">Confirm</option>
                      <option value="COMPLETED">Mark Completed</option>
                      <option value="CANCELLED">Cancel</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl">
                No appointments found.
              </div>
            )}
          </div>
        </div>
      </div>
      
      <PrescriptionModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setActiveApt(null); }}
        onSubmit={handleIssuePrescription}
        defaultAppointment={activeApt}
        availableAppointments={appointments}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default DoctorAppointments;
