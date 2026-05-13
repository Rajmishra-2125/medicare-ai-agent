import React from 'react';
import { X, Pill, ShieldCheck, User } from 'lucide-react';

const PrescriptionViewerModal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen || !appointment) return null;

  const { prescription, patientId } = appointment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">View Prescription</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Issued on {new Date(appointment.date).toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-8">
            
            {/* Patient Context */}
            <div className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                <div className="w-12 h-12 rounded-full bg-indigo-200 dark:bg-indigo-800 flex shrink-0 items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold overflow-hidden">
                    {patientId?.profileImage ? (
                        <img src={patientId.profileImage} alt={patientId.fullname} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-6 h-6" />
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{patientId?.fullname || 'Patient Details Unavailable'}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">Consultation attached</p>
                </div>
            </div>

            {/* Medications List */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                  <Pill className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">Prescribed Medications</h3>
              </div>
              
              {prescription?.medications?.length > 0 ? (
                  <div className="space-y-3">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl flex items-center justify-between">
                          <div>
                              <p className="font-bold text-gray-900 dark:text-white">{med.name}</p>
                              {med.instructions && <p className="text-sm text-gray-500 mt-1">{med.instructions}</p>}
                          </div>
                          <div className="text-right">
                              <span className="inline-block px-2.5 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 shadow-sm">
                                  {med.frequency}
                              </span>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">for {med.duration}</p>
                          </div>
                      </div>
                    ))}
                  </div>
              ) : (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 dark:bg-gray-800 border-dashed border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                      No medications listed in this prescription.
                  </div>
              )}
            </div>

            {/* General Advice */}
            {prescription?.advice && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Doctor's Advice & Notes</h3>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl text-yellow-900 dark:text-yellow-200 text-sm leading-relaxed">
                        {prescription.advice}
                    </div>
                </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-xl transition-colors">
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrescriptionViewerModal;
