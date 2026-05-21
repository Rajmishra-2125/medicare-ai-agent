import React from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Activity,
  CreditCard,
  FileText,
  AlertCircle,
  Building,
} from "lucide-react";

const getStatusBadge = (status) => {
  if (!status) return null;
  const statusUpper = status.toUpperCase();
  switch (statusUpper) {
    case "PENDING":
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-semibold rounded-full border border-yellow-200 dark:border-yellow-800">
          Pending
        </span>
      );
    case "CONFIRMED":
    case "UPCOMING":
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-800">
          Confirmed
        </span>
      );
    case "COMPLETED":
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800">
          Completed
        </span>
      );
    case "CANCELLED":
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs font-semibold rounded-full border border-red-200 dark:border-red-800">
          Cancelled
        </span>
      );
    case "RESCHEDULED":
      return (
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-semibold rounded-full border border-indigo-200 dark:border-indigo-800">
          Rescheduled
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 text-xs font-semibold rounded-full">
          {status}
        </span>
      );
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function AppointmentDetailsModal({ appointment, onClose }) {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-center justify-between">
          <div className="flex flex-col text-white">
            <h2 className="text-xl font-bold">Appointment Details</h2>
            <p className="text-blue-100 text-sm mt-1">ID: {appointment.appointmentId || appointment._id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* Status Row */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Appointment Status</p>
              {getStatusBadge(appointment.status)}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Payment Status</p>
              <div className="flex items-center gap-2 justify-end">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className={`font-semibold text-sm ${appointment.paymentStatus === 'PAID' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-500'}`}>
                  {appointment.paymentStatus || 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-blue-500" />
                  Doctor Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">
                    {appointment.doctorId?.doctor || appointment.doctorName || "Unknown Doctor"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {appointment.doctorId?.specialization || "General"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Schedule Details
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">{appointment.timeSlots || appointment.slotNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Reason for Visit
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{appointment.reason || "No reason provided."}"
                  </p>
                </div>
              </div>

              {appointment.status === "CANCELLED" && appointment.cancellationReason && (
                <div>
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4" />
                    Cancellation Reason
                  </h3>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {appointment.cancellationReason}
                    </p>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-purple-500" />
                  Additional Info
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Consultation Fee</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        ₹{appointment.consultationFee || appointment.doctorId?.consultationFee || "0"}
                    </span>
                  </div>
                  {appointment.paymentMethod && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{appointment.paymentMethod.toLowerCase()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailsModal;
