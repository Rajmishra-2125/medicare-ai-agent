import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Calendar,
  Ambulance,
  Headphones,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronDown,
  ChevronUp,
  User,
  Building,
  FileText,
  Loader2,
  Navigation,
  MapPinned,
  PhoneCall,
} from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    department: "",
    message: "",
    preferredContact: "email",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Contact information
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [
        { label: "Main Line", value: "+1 (555) 123-4567" },
        { label: "Appointments", value: "+1 (555) 123-4568" },
        { label: "Emergency", value: "911" },
      ],
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        { label: "General Inquiries", value: "info@medicare.com" },
        { label: "Appointments", value: "appointments@medicare.com" },
        { label: "Billing", value: "billing@medicare.com" },
      ],
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: MapPin,
      title: "Location",
      details: [
        { label: "Address", value: "123 Healthcare Avenue" },
        { label: "City", value: "New York, NY 10001" },
        { label: "Country", value: "United States" },
      ],
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Clock,
      title: "Hours",
      details: [
        { label: "Monday - Friday", value: "8:00 AM - 8:00 PM" },
        { label: "Saturday", value: "9:00 AM - 6:00 PM" },
        { label: "Sunday", value: "10:00 AM - 4:00 PM" },
      ],
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
    },
  ];

  // Departments
  const departments = [
    "General Inquiry",
    "Appointment Scheduling",
    "Billing & Insurance",
    "Medical Records",
    "Patient Services",
    "Technical Support",
    "Feedback & Complaints",
    "Other",
  ];

  // Office locations
  const locations = [
    {
      name: "Main Medical Center",
      address: "123 Healthcare Avenue, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      hours: "Mon-Fri: 8AM-8PM, Sat: 9AM-6PM",
      services: ["Emergency Care", "Surgery", "Diagnostics"],
    },
    {
      name: "Downtown Clinic",
      address: "456 Medical Plaza, New York, NY 10002",
      phone: "+1 (555) 123-4569",
      hours: "Mon-Fri: 9AM-6PM",
      services: ["Primary Care", "Pediatrics", "Lab Services"],
    },
    {
      name: "Uptown Specialty Center",
      address: "789 Specialist Drive, New York, NY 10003",
      phone: "+1 (555) 123-4570",
      hours: "Mon-Sat: 8AM-7PM",
      services: ["Cardiology", "Neurology", "Orthopedics"],
    },
  ];

  // FAQs
  const faqs = [
    {
      question: "How do I schedule an appointment?",
      answer:
        "You can schedule an appointment through our online booking system, by calling our appointment line at +1 (555) 123-4568, or by using our AI booking assistant available 24/7 on our website.",
    },
    {
      question: "What insurance plans do you accept?",
      answer:
        "We accept most major insurance plans including Blue Cross, Aetna, Cigna, UnitedHealth, Medicare, and Medicaid. Please contact our billing department to verify your specific coverage.",
    },
    {
      question: "Do you offer telemedicine services?",
      answer:
        "Yes! We offer virtual consultations for non-emergency medical concerns. You can book a telemedicine appointment through our website or mobile app.",
    },
    {
      question: "What should I bring to my first appointment?",
      answer:
        "Please bring a valid ID, your insurance card, a list of current medications, any relevant medical records, and arrive 15 minutes early to complete necessary paperwork.",
    },
    {
      question: "How can I access my medical records?",
      answer:
        "You can access your medical records through our patient portal on our website or mobile app. If you need assistance, contact our medical records department at records@medicare.com.",
    },
    {
      question: "Do you have emergency services?",
      answer:
        "Yes, our Main Medical Center has a 24/7 emergency department staffed by board-certified emergency physicians. For life-threatening emergencies, always call 911.",
    },
    {
      question: "What are your payment options?",
      answer:
        "We accept cash, credit/debit cards, and most insurance plans. We also offer flexible payment plans for qualifying patients. Contact our billing department for more information.",
    },
    {
      question: "Can I request a specific doctor?",
      answer:
        "Yes, you can request a specific doctor when booking your appointment. We'll do our best to accommodate your preference based on availability.",
    },
  ];

  // Social media links
  const socialLinks = [
    {
      icon: Facebook,
      name: "Facebook",
      url: "#",
      color: "hover:text-blue-600",
    },
    { icon: Twitter, name: "Twitter", url: "#", color: "hover:text-sky-500" },
    {
      icon: Instagram,
      name: "Instagram",
      url: "#",
      color: "hover:text-pink-600",
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      url: "#",
      color: "hover:text-blue-700",
    },
    { icon: Youtube, name: "YouTube", url: "#", color: "hover:text-red-600" },
  ];

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

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.department) errors.department = "Please select a department";
    if (!formData.message.trim()) errors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      errors.message = "Message must be at least 10 characters";

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

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          department: "",
          message: "",
          preferredContact: "email",
        });
        setSubmitSuccess(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-20 transition-colors duration-200">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Have questions? We're here to help. Contact us through any of the
              channels below or fill out our contact form.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`bg-linear-to-r ${info.color} p-6 text-white`}>
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
                    <info.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">{info.title}</h3>
                </div>
                <div className="p-6 space-y-3">
                  {info.details.map((detail, idx) => (
                    <div key={idx}>
                      <p className="text-xs text-gray-500 mb-1">
                        {detail.label}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 transition-colors duration-200">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Send Us a Message
                </h2>

                {!submitSuccess ? (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      {/* Name and Email */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                formErrors.name
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            />
                          </div>
                          {formErrors.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.name}
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
                              placeholder="john@example.com"
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                formErrors.email
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            />
                          </div>
                          {formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Phone and Department */}
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
                              placeholder="+1 (555) 123-4567"
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                formErrors.phone
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            />
                          </div>
                          {formErrors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Department *
                          </label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                formErrors.department
                                  ? "border-red-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              <option value="">Select Department</option>
                              {departments.map((dept, idx) => (
                                <option key={idx} value={dept}>
                                  {dept}
                                </option>
                              ))}
                            </select>
                          </div>
                          {formErrors.department && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.department}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subject *
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              formErrors.subject
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="What is this regarding?"
                          />
                        </div>
                        {formErrors.subject && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.subject}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us more about your inquiry..."
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            formErrors.message
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          rows="6"
                        />
                        {formErrors.message && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.message}
                          </p>
                        )}
                      </div>

                      {/* Preferred Contact Method */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Preferred Contact Method
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value="email"
                              checked={formData.preferredContact === "email"}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              Email
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value="phone"
                              checked={formData.preferredContact === "phone"}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              Phone
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Thank you for contacting us. We'll get back to you within
                      24 hours.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/doctors/appointments"
                    className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 rounded-lg transition-colors group"
                  >
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Book Appointment
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Schedule online
                      </p>
                    </div>
                  </Link>

                  <a
                    href="tel:+15551234568"
                    className="flex items-center gap-3 p-4 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 rounded-lg transition-colors"
                  >
                    <PhoneCall className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Call Us Now
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        +1 (555) 123-4568
                      </p>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Live Chat
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Chat with support
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-linear-to-br from-red-500 to-rose-600 rounded-2xl shadow-md p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Ambulance className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Emergency?</h3>
                </div>
                <p className="text-red-100 mb-4">
                  For medical emergencies, please call 911 immediately or visit
                  our emergency department.
                </p>
                <a
                  href="tel:911"
                  className="block w-full bg-white text-red-600 py-3 rounded-lg font-bold text-center hover:bg-red-50 transition-colors"
                >
                  Call 911
                </a>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Connect With Us
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      className={`flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors ${social.color}`}
                      title={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Support Hours */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-900/30">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-3">
                  <Headphones className="w-5 h-5" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Support Hours
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Mon - Fri:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      8 AM - 8 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Saturday:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      9 AM - 6 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Sunday:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      10 AM - 4 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Locations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Visit us at any of our convenient locations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-3 mb-4">
                  <MapPinned className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {location.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {location.address}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{location.hours}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    SERVICES AVAILABLE
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {location.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors">
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0">
        <div className="w-full h-[450px] bg-gray-200 relative overflow-hidden shadow-inner">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6175402450847!2d-73.98888748459388!3d40.74844047932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1683100000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Medicare Medical Office Map"
            className="filter grayscale-30 dark:invert dark:hue-rotate-180 opacity-90 hover:opacity-100 transition-all duration-300"
          ></iframe>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Find answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Contact our support team
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
