import React, { useState } from "react";
import { 
  User, 
  Lock, 
  Settings, 
  Camera,
  Save, 
  Mail, 
  Phone,
  Briefcase,
  Award,
  Stethoscope,
  Building,
  IndianRupee
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserPersonalDetails, updateUserAvatar, changePassword } from "../../../features/auth/AuthSlice";
import doctorService from "../../../services/doctorService";
import toast from "react-hot-toast";

const DoctorSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // User Core Settings
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  // Professional Settings (Mapped to Doctor Schema)
  const [specialization, setSpecialization] = useState(user?.doctorInfo?.specialization || "");
  const [qualification, setQualification] = useState(user?.doctorInfo?.qualification || "");
  const [experience, setExperience] = useState(user?.doctorInfo?.experience || "");
  const [consultationFee, setConsultationFee] = useState(user?.doctorInfo?.consultationFee || "");
  const [clinicName, setClinicName] = useState(user?.doctorInfo?.clinicName || "");
  const [isVisible, setIsVisible] = useState(user?.doctorInfo?.isVisible ?? true);
  const [isAcceptingNewPatients, setIsAcceptingNewPatients] = useState(user?.doctorInfo?.isAcceptingNewPatients ?? true);

  // Security Settings
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  React.useEffect(() => {
    if (user?.role === "DOCTOR") {
      const fetchDetails = async () => {
        try {
          // Import api or use doctorService, we will just use the same robust fetch as Profile.jsx
          const details = await doctorService.getDoctorDetails();
          if (details?.doctorInfo) {
            const info = details.doctorInfo;
            setSpecialization(info.specialization || "");
            setQualification(info.qualification || "");
            setExperience(info.experience || "");
            setConsultationFee(info.consultationFee || "");
            setClinicName(info.clinicName || "");
            setIsVisible(info.isVisible ?? true);
            setIsAcceptingNewPatients(info.isAcceptingNewPatients ?? true);
          }
        } catch (error) {
          console.error("Failed to sync latest doctor settings", error);
        }
      };
      fetchDetails();
    }
  }, [user]);

  const tabs = [
    { id: "profile", label: "Personal Details", icon: User },
    { id: "professional", label: "Clinic & Practice", icon: Settings },
    { id: "security", label: "Security & Passwords", icon: Lock },
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    toast.promise(dispatch(updateUserAvatar(formData)).unwrap(), {
      loading: "Uploading avatar...",
      success: "Profile picture added.",
      error: "Failed to upload avatar"
    });
  };

  const handleProfileSave = () => {
    const userData = { fullname, email, phone };
    toast.promise(dispatch(updateUserPersonalDetails(userData)).unwrap(), {
      loading: "Saving personal details...",
      success: "Personal details updated!",
      error: "Failed to update profile"
    });
  };

  const handleProfessionalSave = async () => {
    if (!specialization || !qualification || !experience || !consultationFee || !clinicName) {
      toast.error("Please fill all professional fields");
      return;
    }

    const doctorData = {
      specialization,
      qualification,
      experience,
      consultationFee,
      clinicName,
      isVisible,
      isAcceptingNewPatients
    };

    const savePromise = doctorService.updateDoctorDetails(doctorData);
    
    toast.promise(savePromise, {
      loading: "Saving clinic details...",
      success: "Clinic details updated securely!",
      error: "Failed to update clinic details"
    });
  };

  const handlePasswordSave = () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (!oldPassword || !newPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    toast.promise(dispatch(changePassword({ oldPassword, newPassword })).unwrap(), {
      loading: "Updating password...",
      success: "Password updated successfully!",
      error: "Failed to change password"
    }).then(() => {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }).catch(() => {});
  };

  return (
    <div className="space-y-6 max-w-300 mx-auto animate-fade-in pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Doctor Settings</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage your professional profile, clinic visibility, and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-3 sticky top-4">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left
                    ${activeTab === tab.id 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-500'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8 min-h-125">
            
            {/* 1. Profile Settings Tab */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Update your core account details and profile picture.</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-indigo-100 dark:border-indigo-500/20">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="Doctor Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-sm border-[3px] border-white dark:border-slate-900 transition-colors cursor-pointer block">
                      <Camera className="w-4 h-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  <div>
                    <label className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors cursor-pointer inline-block">
                      Change Photo
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Dr. Name</label>
                    <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                  <button onClick={handleProfileSave} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Save Personal Info
                  </button>
                </div>
              </div>
            )}

            {/* 2. Professional / Clinic Settings Tab */}
            {activeTab === "professional" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Clinic & Practice Details</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Configure your professional listing and consultation rates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Specialization</label>
                    <div className="relative">
                      <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="e.g. Cardiologist" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Qualification</label>
                    <div className="relative">
                      <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="e.g. MBBS, MD" value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Experience (Years)</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="number" min="0" placeholder="e.g. 10" value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Consultation Fee (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="number" min="0" placeholder="e.g. 150" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Clinic / Hospital Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="e.g. City General Hospital" value={clinicName} onChange={(e) => setClinicName(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                    </div>
                  </div>
                  
                </div>

                <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Accepting New Patients</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Allow new patients to book slots with you.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isAcceptingNewPatients} onChange={() => setIsAcceptingNewPatients(!isAcceptingNewPatients)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Public Directory Visibility</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Show your profile in the main search page.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isVisible} onChange={() => setIsVisible(!isVisible)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                  <button onClick={handleProfessionalSave} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Save Clinic Info
                  </button>
                </div>
              </div>
            )}

            {/* 3. Security Settings Tab */}
            {activeTab === "security" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Security & Password</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Update your password and secure your account.</p>
                </div>

                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Current Password</label>
                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                  <button onClick={handlePasswordSave} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSettings;
