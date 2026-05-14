import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  MapPin,
  FileText,
  CreditCard,
  Bot,
  Video,
  Building,
  Users,
  Activity,
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Star,
} from "lucide-react";
import MyAppointments from "./MyAppointments";
import appointmentService from "../../../../services/appointmentService";
import doctorService from "../../../../services/doctorService";

function Appointments() {
  const location = useLocation();
  const selectedDoctor = location.state?.doctor;

  const [activeTab, setActiveTab] = useState("book"); // book, myAppointments, aiAssistant
  const [showAIChat, setShowAIChat] = useState(false);

  // Booking Form State
  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    selectedDoctor: selectedDoctor?.id || "",
    specialty: selectedDoctor?.specialty || "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "in-person", // in-person or video
    reason: "",
    symptoms: "",
    insurance: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedAppointmentDetails, setBookedAppointmentDetails] =
    useState(null);

  // AI Chat State
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // My Appointments State
  const [myAppointments, setMyAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // All Doctors State for dropdown
  const [allDoctors, setAllDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch all doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const data = await doctorService.getAllDoctors();
        
        // Map the data to match expected structure
        const mappedDoctors = data.map(doc => ({
          id: doc._id,
          name: doc.doctorDetails?.fullname || doc.doctor || "Doctor",
          specialty: doc.specialization || "General",
          doctorId: doc.doctorId, // Keep the actual doctor user ID for API calls
        }));
        
        // Sort the data alphabetically
        const sortedDoctors = mappedDoctors.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setAllDoctors(sortedDoctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch appointments on mount and when tab changes to myAppointments
  useEffect(() => {
    fetchAppointments();
  }, [activeTab]);

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const data = await appointmentService.getMyAppointments();
      const appointmentsList = data.data || data || []; // Handle potential nesting
      setMyAppointments(Array.isArray(appointmentsList) ? appointmentsList : []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
// ... (keep existing code)

        {/* My Appointments Tab */}
        {activeTab === "myAppointments" && (
          <MyAppointments 
            appointments={myAppointments} 
            loading={loadingAppointments}
            onRefresh={fetchAppointments}
          />
        )}

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle route based tab selection
  useEffect(() => {
    if (location.pathname === "/my-appointments") {
      setActiveTab("myAppointments");
    }
  }, [location.pathname]);

  // Initialize AI Chat
  useEffect(() => {
    if (activeTab === "aiAssistant" && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hello! I'm your AI appointment booking assistant. I can help you:

• Book appointments with our doctors
• Check available time slots
• Answer questions about our specialists
• Reschedule existing appointments

How can I assist you today?`,
        },
      ]);
    }
  }, [activeTab]);

  // Available time slots
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  // Doctors list for dropdown - will be fetched from backend
  const [doctors, setDoctors] = useState([
    { name: "Dr. Sarah Smith", specialty: "Cardiology", username: "sarahsmith" },
    { name: "Dr. Michael Johnson", specialty: "Neurology", username: "michaeljohnson" },
    { name: "Dr. Emily Lee", specialty: "Dermatology", username: "emilylee" },
    { name: "Dr. James Wilson", specialty: "Orthopedics", username: "jameswilson" },
    { name: "Dr. Olivia Martinez", specialty: "Pediatrics", username: "oliviamartinez" },
    { name: "Dr. David Chen", specialty: "Ophthalmology", username: "davidchen" },
  ]);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        if (data && data.length > 0) {
          const formattedDoctors = data.map((doc) => ({
            name: doc.fullName,
            specialty: doc.specialty,
            username: doc.username,
          }));
          setDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        // Keep the default doctors if fetch fails
      }
    };
    fetchDoctors();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle doctor selection
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const doctor = allDoctors.find((d) => d.id === doctorId);
    setFormData((prev) => ({
      ...prev,
      selectedDoctor: doctorId,
      specialty: doctor?.specialty || "",
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.patientName.trim()) errors.patientName = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.age) errors.age = "Age is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.selectedDoctor)
      errors.selectedDoctor = "Please select a doctor";
    if (!formData.appointmentDate) errors.appointmentDate = "Date is required";
    if (!formData.appointmentTime) errors.appointmentTime = "Time is required";
    if (!formData.reason.trim()) errors.reason = "Reason is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the doctor's details from the selected doctor ID
      const doctor = allDoctors.find((d) => d.id === formData.selectedDoctor);
      
      if (!doctor || !doctor.doctorId) {
        throw new Error("Doctor not found");
      }

      // Book appointment via API
      const appointmentData = {
        slotNumber: parseInt(formData.appointmentTime.replace(/[^0-9]/g, "")) || 1, // Extract slot number from time
        date: new Date(formData.appointmentDate).toISOString(),
        username: doctor.doctorId, // Use doctorId from the doctor object
        reason: formData.reason,
      };

      const response = await appointmentService.bookAppointment(appointmentData);
      
      setBookedAppointmentDetails({
        id: response._id,
        doctorName: doctor.name, // Use doctor name instead of ID
        specialty: formData.specialty,
        date: formData.appointmentDate,
        time: formData.appointmentTime,
        type: formData.appointmentType === "video" ? "Video Consultation" : "In-Person",
        status: "Pending",
      });
      
      setBookingSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patientName: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      address: "",
      selectedDoctor: "",
      specialty: "",
      appointmentDate: "",
      appointmentTime: "",
      appointmentType: "in-person",
      reason: "",
      symptoms: "",
      insurance: "",
    });
    setBookingSuccess(false);
    setBookedAppointmentDetails(null);
    setFormErrors({});
  };

  // AI Chat functionality
  const callClaudeAPI = async (conversationHistory) => {
    const systemPrompt = `You are a helpful medical appointment booking assistant for MediCare. You can:
1. Help book appointments with doctors
2. Provide information about available specialists
3. Suggest appropriate doctors based on symptoms
4. Answer questions about appointment procedures

Our available doctors:
- Dr. Sarah Smith (Cardiology)
- Dr. Michael Johnson (Neurology)
- Dr. Emily Lee (Dermatology)
- Dr. James Wilson (Orthopedics)
- Dr. Olivia Martinez (Pediatrics)
- Dr. David Chen (Ophthalmology)

Available time slots: 9:00 AM - 5:00 PM, Monday to Friday

When you have gathered: patient name, preferred doctor, date, and time, respond with a JSON object:
{
  "booking_confirmed": true,
  "patient_name": "John Doe",
  "doctor": "Dr. Sarah Smith",
  "specialty": "Cardiology",
  "date": "2026-02-10",
  "time": "10:00 AM",
  "confirmation_message": "Your appointment is confirmed!"
}

Otherwise, continue the conversation naturally to gather information.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: conversationHistory,
        }),
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error("AI Error:", error);
      return "I apologize, but I'm having trouble connecting right now. Please try again or use the booking form.";
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setChatInput("");
    setIsChatLoading(true);

    const conversationHistory = updatedMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const assistantResponse = await callClaudeAPI(conversationHistory);

    // Check for booking confirmation
    try {
      const jsonMatch = assistantResponse.match(
        /\{[\s\S]*"booking_confirmed"[\s\S]*\}/,
      );
      if (jsonMatch) {
        const bookingData = JSON.parse(jsonMatch[0]);
        if (bookingData.booking_confirmed) {
          const appointmentId =
            "APT" + String(Math.floor(Math.random() * 10000)).padStart(4, "0");
          const newAppointment = {
            id: appointmentId,
            doctorName: bookingData.doctor,
            specialty: bookingData.specialty,
            date: bookingData.date,
            time: bookingData.time,
            type: "In-Person",
            status: "Upcoming",
            location: "Hospital",
            patientName: bookingData.patient_name,
            image:
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
          };
          setMyAppointments((prev) => [newAppointment, ...prev]);
        }
      }
    } catch (e) {
      // Not a booking confirmation
    }

    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        content: assistantResponse,
      },
    ]);
    setIsChatLoading(false);
  };

  const handleChatKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/doctors"
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Book Appointment
              </h1>
              <p className="text-xl text-blue-100 dark:text-blue-200 mt-2">
                Schedule your consultation with our expert doctors
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8 transition-colors duration-200">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("book")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-colors ${
                  activeTab === "book"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </button>
              <button
                onClick={() => setActiveTab("myAppointments")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-colors ${
                  activeTab === "myAppointments"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Activity className="w-5 h-5" />
                My Appointments
                {myAppointments.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {myAppointments.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("aiAssistant")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-colors ${
                  activeTab === "aiAssistant"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Bot className="w-5 h-5" />
                AI Assistant
              </button>
            </nav>
          </div>
        </div>

        {/* Book Appointment Tab */}
        {activeTab === "book" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              {!bookingSuccess ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 transition-colors duration-200">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Patient Information
                  </h2>

                  <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="space-y-6 mb-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              name="patientName"
                              value={formData.patientName}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                                formErrors.patientName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="John Doe"
                            />
                          </div>
                          {formErrors.patientName && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.patientName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                                formErrors.email
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="john@example.com"
                            />
                          </div>
                          {formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                                formErrors.phone
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="+1 234 567 8900"
                            />
                          </div>
                          {formErrors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.phone}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Age *
                            </label>
                            <input
                              type="number"
                              name="age"
                              value={formData.age}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                                formErrors.age
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="30"
                              min="1"
                              max="120"
                            />
                            {formErrors.age && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.age}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Gender *
                            </label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                                formErrors.gender
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Select</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            {formErrors.gender && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.gender}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            placeholder="123 Main St, City, State"
                            rows="2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Appointment Details
                    </h3>
                    <div className="space-y-6 mb-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select Doctor *
                          </label>
                          <select
                            name="selectedDoctor"
                            value={formData.selectedDoctor}
                            onChange={handleDoctorChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                              formErrors.selectedDoctor
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                          <option value="">Choose a doctor</option>
                            {loadingDoctors ? (
                              <option disabled>Loading doctors...</option>
                            ) : (
                              allDoctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                  {doctor.name}
                                </option>
                              ))
                            )}
                          </select>
                          {formErrors.selectedDoctor && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.selectedDoctor}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Specialty
                          </label>
                          <input
                            type="text"
                            name="specialty"
                            value={formData.specialty}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                            placeholder="Auto-filled"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Appointment Date *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="date"
                              name="appointmentDate"
                              value={formData.appointmentDate}
                              onChange={handleInputChange}
                              min={today}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                                formErrors.appointmentDate
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                          {formErrors.appointmentDate && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.appointmentDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Appointment Time *
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                              name="appointmentTime"
                              value={formData.appointmentTime}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                                formErrors.appointmentTime
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Select time</option>
                              {timeSlots.map((time, idx) => (
                                <option key={idx} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                          {formErrors.appointmentTime && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.appointmentTime}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Appointment Type *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                appointmentType: "in-person",
                              }))
                            }
                            className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                              formData.appointmentType === "in-person"
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <Building className="w-5 h-5" />
                            <span className="font-semibold">In-Person</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                appointmentType: "video",
                              }))
                            }
                            className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                              formData.appointmentType === "video"
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <Video className="w-5 h-5" />
                            <span className="font-semibold">Video Call</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Reason for Visit *
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                              formErrors.reason
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Please describe your reason for booking..."
                            rows="3"
                          />
                        </div>
                        {formErrors.reason && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.reason}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Symptoms (Optional)
                        </label>
                        <textarea
                          name="symptoms"
                          value={formData.symptoms}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="List any current symptoms..."
                          rows="2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Insurance Provider (Optional)
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="insurance"
                            value={formData.insurance}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                            placeholder="Insurance company name"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Book Appointment
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Success Message
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 transition-colors duration-200">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Appointment Confirmed!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                      Your appointment has been successfully booked
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
                      <div className="grid md:grid-cols-2 gap-4 text-left">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Appointment ID
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {bookedAppointmentDetails?.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Patient Name
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {formData.patientName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Doctor
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {formData.selectedDoctor}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Specialty
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {formData.specialty}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Date & Time
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {formData.appointmentDate} at{" "}
                            {formData.appointmentTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Type
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {formData.appointmentType === "video"
                              ? "Video Consultation"
                              : "In-Person Visit"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setActiveTab("myAppointments")}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <Activity className="w-5 h-5" />
                        View My Appointments
                      </button>
                      <button
                        onClick={resetForm}
                        className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <Calendar className="w-5 h-5" />
                        Book Another
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              {/* Quick Tips */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Before Your Appointment
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Arrive 15 minutes early</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Bring insurance card and ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500 mt-0.5 shrink-0" />
                    <span>List current medications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500 mt-0.5 shrink-0" />
                    <span>Prepare questions for doctor</span>
                  </li>
                </ul>
              </div>

              {/* Need Help */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-transparent dark:border-gray-700 transition-colors duration-200">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab("aiAssistant")}
                    className="w-full flex items-center gap-3 p-3 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 rounded-lg transition-colors border border-transparent dark:border-gray-700"
                  >
                    <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        AI Assistant
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Get instant help
                      </p>
                    </div>
                  </button>
                  <a
                    href="tel:+1234567890"
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors border border-transparent dark:border-gray-600"
                  >
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Call Us
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        +1 234 567 890
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Selected Doctor Info */}
              {selectedDoctor && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-transparent dark:border-gray-700 transition-colors duration-200">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                    Selected Doctor
                  </h3>
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {selectedDoctor.name}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        {selectedDoctor.specialty}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {selectedDoctor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Appointments Tab */}
        {activeTab === "myAppointments" && (
          <MyAppointments 
            appointments={myAppointments} 
            loading={loadingAppointments}
            onRefresh={fetchAppointments}
          />
        )}

        {/* AI Assistant Tab */}
        {activeTab === "aiAssistant" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 p-6">
              <div className="flex items-center gap-3 text-white">
                <Bot className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">AI Booking Assistant</h2>
                  <p className="text-blue-100 dark:text-blue-200">
                    Get instant help with appointment booking
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-150">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md rounded-bl-none border border-gray-100 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.role === "assistant" && (
                          <Bot className="w-5 h-5 mt-1 shrink-0 text-blue-600 dark:text-blue-400" />
                        )}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md border border-gray-100 dark:border-gray-700">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleChatKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                    disabled={isChatLoading}
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  AI assistant can help you book appointments, find doctors, and
                  answer questions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
