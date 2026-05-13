import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { UserRound, Mail, Phone, Calendar, ArrowLeft, ShieldAlert, AlertTriangle, Trash2, Ban, PlayCircle, Shield } from 'lucide-react';
import { updateUserStatus, getAllUsers } from '../../../features/admin/AdminSlice';
import DashboardSkeleton from "../../../components/skeletons/DashboardSkeleton";
import toast from 'react-hot-toast';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { users, isLoading } = useSelector((state) => state.admin);
  
  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch, users]);

  const patient = users?.find(u => u._id === id && u.role === 'PATIENT');

  if (isLoading) return <DashboardSkeleton />;

  if (!patient && users?.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Not Found</h2>
        <button onClick={() => navigate('/admin/patients')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Go Back</button>
      </div>
    );
  }

  if (!patient) return <DashboardSkeleton />;

  const handleUpdateStatus = async (status, actionName) => {
    if (window.confirm(`Are you sure you want to ${actionName} ${patient.fullname}?`)) {
      try {
        await dispatch(updateUserStatus({ userId: patient._id, statusData: { status } })).unwrap();
        toast.success(`Patient account ${actionName.toLowerCase()} successfully`);
      } catch (err) {
        toast.error(`Failed to ${actionName.toLowerCase()} patient`);
      }
    }
  };

  const getStatusBadge = () => {
    switch(patient.accountStatus) {
      case 'ACTIVE':
        return <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-lg text-xs font-black uppercase tracking-tighter">Active</span>;
      case 'SUSPENDED':
        return <span className="px-4 py-1.5 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 rounded-lg text-xs font-black uppercase tracking-tighter">Suspended</span>;
      case 'BANNED':
        return <span className="px-4 py-1.5 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 rounded-lg text-xs font-black uppercase tracking-tighter">Banned</span>;
      case 'DELETED':
      case 'PENDING_DELETION':
        return <span className="px-4 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-lg text-xs font-black uppercase tracking-tighter">Deleted</span>;
      default:
        return <span className="px-4 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-lg text-xs font-black uppercase tracking-tighter">{patient.accountStatus}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 animate-fade-in">
       <button 
         onClick={() => navigate('/admin/patients')} 
         className="mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 transition-colors font-medium"
       >
         <ArrowLeft className="w-5 h-5" />
         Back to Patients
       </button>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Profile Info */}
         <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden relative">
            <div className="h-32 bg-linear-to-r from-indigo-500 to-sky-500 dark:opacity-80" />

            <div className="px-8 pb-8 relative">
               <div className="flex justify-between items-end -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 overflow-hidden shadow-xl shrink-0">
                     {patient.profileImage ? (
                        <img src={patient.profileImage} alt="" className="w-full h-full object-cover" />
                     ) : (
                        <UserRound className="w-full h-full p-8 text-gray-300" />
                     )}
                  </div>
                  <div className="flex gap-2 mb-2">
                     {getStatusBadge()}
                  </div>
               </div>

               <div className="space-y-1 mb-10">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{patient.fullname}</h3>
                  <p className="text-gray-500 dark:text-slate-400 font-medium text-sm">Patient ID: <span className="font-mono">{patient._id}</span></p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 pb-10 border-b border-gray-100 dark:border-slate-800">
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800"><Mail className="w-5 h-5 text-gray-500" /></div>
                        <div>
                           <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Email Address</p>
                           <p className="text-base font-bold text-gray-700 dark:text-slate-200 truncate">{patient.email}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800"><Calendar className="w-5 h-5 text-gray-500" /></div>
                        <div>
                           <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Joined On</p>
                           <p className="text-base font-bold text-gray-700 dark:text-slate-200">{new Date(patient.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800"><Phone className="w-5 h-5 text-gray-500" /></div>
                        <div>
                           <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Phone Number</p>
                           <p className="text-base font-bold text-gray-700 dark:text-slate-200">{patient.phone || "Not provided"}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800"><UserRound className="w-5 h-5 text-gray-500" /></div>
                        <div>
                           <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Gender</p>
                           <p className="text-base font-bold text-gray-700 dark:text-slate-200 capitalize">{patient.gender?.toLowerCase() || "Unspecified"}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Account Actions / Security Panel */}
         <div className="lg:col-span-1 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-slate-800">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <ShieldAlert className="w-5 h-5 text-indigo-500" />
                Account Management
              </h4>
              
              <div className="space-y-3">
                 {patient.accountStatus !== 'ACTIVE' && (
                    <button 
                      onClick={() => handleUpdateStatus('ACTIVE', 'Activate')}
                      className="w-full p-4 flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-2xl transition-all border border-emerald-100/50 dark:border-emerald-500/20"
                    >
                      <div className="flex items-center gap-3 font-semibold text-sm">
                        <PlayCircle className="w-5 h-5" />
                        Activate Account
                      </div>
                    </button>
                 )}

                 {patient.accountStatus !== 'SUSPENDED' && (
                    <button 
                      onClick={() => handleUpdateStatus('SUSPENDED', 'Suspend')}
                      className="w-full p-4 flex items-center justify-between bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl transition-all border border-amber-100/50 dark:border-amber-500/20"
                    >
                      <div className="flex items-center gap-3 font-semibold text-sm">
                        <AlertTriangle className="w-5 h-5" />
                        Suspend Account
                      </div>
                    </button>
                 )}

                 {patient.accountStatus !== 'BANNED' && (
                    <button 
                      onClick={() => handleUpdateStatus('BANNED', 'Ban')}
                      className="w-full p-4 flex items-center justify-between bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 text-orange-700 dark:text-orange-400 rounded-2xl transition-all border border-orange-100/50 dark:border-orange-500/20"
                    >
                      <div className="flex items-center gap-3 font-semibold text-sm">
                        <Ban className="w-5 h-5" />
                        Ban Account
                      </div>
                    </button>
                 )}

                 {patient.accountStatus !== 'DELETED' && (
                    <button 
                      onClick={() => handleUpdateStatus('DELETED', 'Soft Delete')}
                      className="w-full p-4 flex items-center justify-between bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl transition-all border border-red-100/50 dark:border-red-500/20"
                    >
                      <div className="flex items-center gap-3 font-semibold text-sm">
                        <Trash2 className="w-5 h-5" />
                        Delete Account
                      </div>
                    </button>
                 )}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Suspend:</span> Temporarily disables patient access.<br/>
                  <span className="font-bold text-gray-700 dark:text-gray-300">Ban:</span> Permanently blocks the user.<br/>
                  <span className="font-bold text-gray-700 dark:text-gray-300">Delete:</span> Soft-deletes user data from the platform.
                </p>
              </div>
           </div>
         </div>
       </div>
    </div>
  );
};

export default PatientProfile;
