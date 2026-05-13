import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Pill, Loader2, Share } from 'lucide-react';
import toast from 'react-hot-toast';

const PrescriptionModal = ({ isOpen, onClose, onSubmit, defaultAppointment = null, availableAppointments = [], isSubmitting = false }) => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [advice, setAdvice] = useState('');

  useEffect(() => {
    if (defaultAppointment) {
      setSelectedAppointmentId(defaultAppointment._id);
    } else {
      setSelectedAppointmentId('');
    }
    // Optional: Reset form fields when opened
    if (isOpen) {
      setMedications([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
      setAdvice('');
    }
  }, [isOpen, defaultAppointment]);

  if (!isOpen) return null;

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedication = (index) => {
    const updated = [...medications];
    updated.splice(index, 1);
    setMedications(updated);
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmit = () => {
    if (!selectedAppointmentId) {
      toast.error("Please select a valid appointment context first.");
      return;
    }
    
    // Basic validation
    const validMeds = medications.filter(m => m.name.trim() !== '');
    if (validMeds.length === 0) {
      toast.error("You must add at least one medication to issue a prescription.");
      return;
    }

    onSubmit({
      appointmentId: selectedAppointmentId,
      prescription: {
        medications: validMeds,
        advice
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Write Prescription</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Generate and attach a secure digital prescription</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-6">
            
            {/* Target Selection Logic */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bind to Appointment</label>
              {defaultAppointment ? (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 text-sm font-medium">
                  {defaultAppointment.patientId?.fullname || 'Patient'} - {new Date(defaultAppointment.date).toLocaleDateString()} at {defaultAppointment.timeSlots}
                </div>
              ) : (
                <select 
                  value={selectedAppointmentId}
                  onChange={(e) => setSelectedAppointmentId(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-sm outline-none"
                >
                  <option value="" disabled>Select an available pending/recent appointment</option>
                  {availableAppointments.map(apt => (
                    <option key={apt._id} value={apt._id}>
                      {apt.patientId?.fullname} • {new Date(apt.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Medications List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Medications</label>
                <button onClick={handleAddMedication} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide hover:underline">
                  <Plus className="w-3.5 h-3.5" /> ADD ANOTHER
                </button>
              </div>
              
              <div className="space-y-4">
                {medications.map((med, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl relative group">
                    <button 
                      onClick={() => handleRemoveMedication(index)}
                      className="absolute -right-2 -top-2 p-1.5 bg-white dark:bg-gray-800 text-red-500 hover:text-red-700 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Drug Name</label>
                        <input 
                          type="text" placeholder="e.g. Paracetamol 500mg" value={med.name}
                          onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Frequency</label>
                          <input 
                            type="text" placeholder="e.g. 1-0-1" value={med.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Duration</label>
                          <input 
                            type="text" placeholder="e.g. 5 days" value={med.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Advice */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Doctor's Advice / Notes</label>
              <textarea 
                rows="3"
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                placeholder="Any special instructions, test requests, or general guidelines for the patient..."
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-sm outline-none resize-none"
              ></textarea>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
          <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share className="w-4 h-4" />}
            Issue Prescription
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrescriptionModal;
