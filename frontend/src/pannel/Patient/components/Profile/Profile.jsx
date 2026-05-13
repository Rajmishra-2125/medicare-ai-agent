import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  reset,
  updateUserPersonalDetails,
  updateProfileAddress,
  updateUserAvatar,
} from "../../features/auth/authSlice";
import { Camera, User, Mail, Phone, MapPin, Calendar, Save, X, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../shared/Spinner";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  // updating personal details
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user?.fullname || "",
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        gender: user?.gender || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      })
    }
  }, [user]);

   const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmittingPersonalDetails = (e) => {
     e.preventDefault();
     dispatch(updateUserPersonalDetails(formData));
   };

  // updating Address details
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formAddressData, setFormAddressData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Pre-fill form with user's address
  useEffect(() => {
    if (user) {
      setFormAddressData({
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
        country: user.address?.country || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
      setIsEditing(false);
      setIsEditingAddress(false);
    }
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);


  const handleChangeAddress = (e) => {
    setFormAddressData({ ...formAddressData, [e.target.name]: e.target.value });
  };
  const handleSubmittingAddress = (e) => {
    e.preventDefault();
    dispatch(updateProfileAddress(formAddressData));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      dispatch(updateUserAvatar(formData));
    }
  };

  if (!user) {
    toast.error(message);
    return;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl max-h-1/3 mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 text-center transition-colors duration-200">
              <div className="relative inline-block mb-4 group">
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-60 h-60 rounded-full object-cover mx-auto border-4 border-gray-100 dark:border-gray-700 shadow-sm"
                      />
                    ) : (
                      <div className="w-60 h-60 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto border-4 border-gray-100 dark:border-gray-700 shadow-sm text-gray-400">
                        <User className="w-30 h-30" />
                      </div>
                    )}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 transition-colors shadow-md group-hover:scale-110 transform duration-200"
                    >
                      <Camera className="w-8 h-8" />
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {user.fullname}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-light uppercase text-sm mt-1 mb-4">
                {user.role}
              </p>
              <p className="text-gray-500 dark:text-gray-400 font-medium uppercase text-sm mt-1 mb-4"></p>

              <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6 text-left space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <User className="w-5 h-5 mr-3 text-blue-500" />
                  <span>{user.username}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Phone className="w-5 h-5 mr-3 text-blue-500" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Mail className="w-5 h-5 mr-3 text-blue-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                  <span>
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details Form Personal Details*/}
          <div className="md:w-3xl">
            <div className="lg:col-span-2 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Personal Details
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                      {/* Save button is in the form */}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <form onSubmit={handleSubmittingPersonalDetails}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                              isEditing
                                ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Username
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                              isEditing
                                ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                              isEditing
                                ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                              isEditing
                                ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            isEditing
                              ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                              : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            isEditing
                              ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                              : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          }`}
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <div className="mt-8 flex justify-end">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm disabled:opacity-70"
                        >
                          {isLoading ? (
                            <Spinner />
                          ) : (
                            <>
                              <Save className="w-5 h-5 mr-2" /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Creating address form  */}

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Address Details
                  </h3>
                  {!isEditingAddress ? (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Address
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsEditingAddress(false)}
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                      {/* Save button is in the form */}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <form onSubmit={handleSubmittingAddress}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formAddressData.street}
                          onChange={handleChangeAddress}
                          disabled={!isEditingAddress}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            isEditingAddress
                              ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                              : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formAddressData.city}
                          onChange={handleChangeAddress}
                          disabled={!isEditingAddress}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            isEditingAddress
                              ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                              : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formAddressData.state}
                          onChange={handleChangeAddress}
                          disabled={!isEditingAddress}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            isEditingAddress
                              ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                              : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formAddressData.zipCode}
                          onChange={handleChangeAddress}
                          disabled={!isEditingAddress}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            isEditingAddress
                              ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                              : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formAddressData.country}
                          onChange={handleChangeAddress}
                          disabled={!isEditingAddress}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            isEditingAddress
                              ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                              : "bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          }`}
                        />
                      </div>
                    </div>
                    {isEditingAddress && (
                      <div className="mt-8 flex justify-end">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm disabled:opacity-70"
                        >
                          {isLoading ? (
                            <Spinner />
                          ) : (
                            <>
                              <Save className="w-5 h-5 mr-2" /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>

             {/* Starts with doctor section */}
                <>
                
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
