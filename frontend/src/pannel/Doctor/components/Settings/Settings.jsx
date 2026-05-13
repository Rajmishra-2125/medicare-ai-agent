import React, { useState } from 'react';
import { 
    User, 
    Shield, 
    Bell, 
    Moon, 
    LogOut, 
    Trash2, 
    ChevronRight,
    Key,
    Smartphone,
    Mail,
    Globe
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  logout,
  deleteAccount,
  changePassword,
} from "../../features/auth/authSlice";
import toast from 'react-hot-toast';

import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { theme, changeTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');

    // Mock states for toggles
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        marketing: false
    });

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteConfirmText, setDeleteConfirmText] = useState(''); // "DELETE"

    const handleLogout = () => {
        dispatch(logout());
        // Reload or redirect handled by effect in App/Layout usually, 
        // or we manually navigate. For now, dispatching logout clears state.
        window.location.href = '/';
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        dispatch(changePassword(passwordData))
            .unwrap()
            .then(() => {
                 toast.success("Password changed successfully");
                 setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            })
            .catch((error) => {
                toast.error(error || "Failed to change password");
            });
    };

    const confirmDeleteAccount = () => {
        if (deleteConfirmText !== "DELETE") {
             toast.error("Please type DELETE to confirm.");
             return;
        }
        if (!deletePassword) {
            toast.error("Password is required to delete account.");
            return;
        }
        dispatch(deleteAccount({ confirmationPassword: deletePassword, reason: "User requested deletion via settings" }))
            .unwrap()
            .then(() => {
                toast.success("Account deleted successfully");
                setShowDeleteModal(false);
            })
            .catch((error) => {
                toast.error(error || "Failed to delete account");
            });
    };

    const handleToggle = (key) => {
        setNotifications(prev => ({...prev, [key]: !prev[key]}));
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <p className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-gray-100">{user?.fullname}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <p className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-gray-100">{user?.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                    <p className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-gray-100">{user?.phone || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                    <p className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-gray-100">@{user?.username}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                                <p className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-gray-100 min-h-25">
                                    {user?.bio || 'No bio provided.'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                            <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">Danger Zone</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors font-medium border border-red-200 dark:border-red-800"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security</h2>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Password</h3>
                            <form className="space-y-4 max-w-lg" onSubmit={handleChangePassword}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                    <input 
                                        type="password" 
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                    <input 
                                        type="password" 
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                                        required
                                    />
                                </div>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                                    Update Password
                                </button>
                            </form>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Authenticator App</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Secure your account with TOTP.</p>
                                </div>
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm text-gray-700 dark:text-gray-300 transition-colors">
                                    Enable
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h2>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                            {[
                                { key: 'email', label: 'Email Notifications', icon: Mail, desc: 'Receive updates about your appointments via email' },
                                { key: 'push', label: 'Push Notifications', icon: Bell, desc: 'Receive real-time push notifications on your device' },
                                { key: 'sms', label: 'SMS Notifications', icon: Smartphone, desc: 'Receive text messages for urgent updates' },
                                { key: 'marketing', label: 'Marketing Emails', icon: Globe, desc: 'Receive news, offers, and promotion updates' },
                            ].map((item, index) => (
                                <div key={item.key} className={`p-6 flex items-center justify-between ${index !== 3 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle(item.key)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.key] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                                    >
                                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[item.key] ? 'translate-x-6' : ''}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'appearance':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Theme</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <button 
                                    onClick={() => changeTheme('light')}
                                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${
                                        theme === 'light' 
                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' 
                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"></div>
                                    <span className="font-medium dark:text-gray-200">Light</span>
                                </button>
                                <button 
                                    onClick={() => changeTheme('dark')}
                                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${
                                        theme === 'dark' 
                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' 
                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <div className="w-full h-24 bg-gray-900 rounded-lg border border-gray-700"></div>
                                    <span className="font-medium dark:text-gray-200">Dark</span>
                                </button>
                                <button 
                                    onClick={() => changeTheme('system')}
                                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${
                                        theme === 'system' 
                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' 
                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <div className="w-full h-24 bg-linear-to-r from-gray-100 to-gray-900 rounded-lg border border-gray-300 dark:border-gray-600"></div>
                                    <span className="font-medium dark:text-gray-200">System</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24 transition-colors duration-200">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={user?.profileImage || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                                        alt="Profile" 
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-gray-600"
                                    />
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{user?.fullname}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user?.username}</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="p-2 space-y-1">
                                {[
                                    { id: 'profile', icon: User, label: 'Profile Settings' },
                                    { id: 'security', icon: Shield, label: 'Security' },
                                    { id: 'notifications', icon: Bell, label: 'Notifications' },
                                    { id: 'appearance', icon: Moon, label: 'Appearance' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        id={`tab-${item.id}`}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                                            activeTab === item.id 
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            {item.label}
                                        </div>
                                        {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                                    </button>
                                ))}
                            </nav>
                            <div className="p-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        {renderContent()}
                    </div>
                </div>

                {/* Delete Account Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200 border border-gray-200 dark:border-gray-700">
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-red-600 dark:text-red-500 flex items-center gap-2">
                                    <Trash2 className="w-6 h-6" />
                                    Delete Account
                                </h3>
                                <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                This action is <strong>irreversible</strong>. Your account will be scheduled for permanent deletion in 30 days. You will lose access to your appointments and history.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Type "DELETE" to confirm
                                    </label>
                                    <input 
                                        type="text" 
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="DELETE"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Enter your Password
                                    </label>
                                    <input 
                                        type="password" 
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Current Password"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDeleteAccount}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-lg shadow-red-500/30"
                                >
                                    Permanently Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
