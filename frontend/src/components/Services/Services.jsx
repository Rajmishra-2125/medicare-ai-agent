import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Heart,
  Brain,
  Activity,
  Eye,
  Bone,
  Baby,
  Microscope,
  Syringe,
  FlaskConical,
  Pill,
  Scissors,
  Smartphone,
  FileText,
  Clock,
  Shield,
  Award,
  Users,
  TrendingUp,
  Video,
  Home,
  Ambulance,
  HeartPulse,
  TestTube,
  ScanLine,
  Monitor,
  Thermometer,
  Bandage,
  CheckCircle,
  ChevronRight,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Zap,
  Sparkles,
} from "lucide-react";

function Services() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedService, setExpandedService] = useState(null);

  // Service categories
  const categories = [
    { name: "All", icon: Stethoscope },
    { name: "Diagnostics", icon: Microscope },
    { name: "Treatments", icon: Heart },
    { name: "Surgery", icon: Scissors },
    { name: "Emergency", icon: Ambulance },
    { name: "Digital Health", icon: Smartphone },
  ];

  // Main services
  const services = [
    {
      id: 1,
      category: "Diagnostics",
      icon: Microscope,
      title: "Advanced Laboratory Testing",
      shortDescription:
        "Comprehensive diagnostic tests with fast, accurate results",
      fullDescription:
        "Our state-of-the-art laboratory offers a complete range of diagnostic tests including blood work, urinalysis, microbiology, and specialized testing. Results typically available within 24-48 hours.",
      features: [
        "Complete blood count (CBC)",
        "Metabolic panels",
        "Hormone testing",
        "Allergy testing",
        "COVID-19 & infectious disease testing",
        "Genetic testing",
      ],
      price: "Starting at ₹50",
      duration: "15-30 minutes",
      availability: "24/7",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      category: "Diagnostics",
      icon: ScanLine,
      title: "Medical Imaging",
      shortDescription: "Advanced imaging technology for accurate diagnosis",
      fullDescription:
        "Our imaging center features the latest technology including MRI, CT scans, X-rays, ultrasound, and mammography. All scans are reviewed by board-certified radiologists.",
      features: [
        "MRI & CT scans",
        "Digital X-rays",
        "3D Mammography",
        "Ultrasound imaging",
        "Bone density scans",
        "Same-day appointments available",
      ],
      price: "Varies by scan type",
      duration: "30-60 minutes",
      availability: "Mon-Sat, 8 AM - 8 PM",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      id: 3,
      category: "Treatments",
      icon: Heart,
      title: "Cardiology Services",
      shortDescription: "Comprehensive heart care from prevention to treatment",
      fullDescription:
        "Our cardiology department provides complete cardiovascular care including preventive screenings, diagnostic testing, and advanced treatments for heart conditions.",
      features: [
        "Echocardiography",
        "Stress testing",
        "Holter monitoring",
        "Cardiac catheterization",
        "Pacemaker implantation",
        "Heart disease management",
      ],
      price: "Consultation: ₹150",
      duration: "45-60 minutes",
      availability: "Mon-Fri, 9 AM - 5 PM",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      id: 4,
      category: "Treatments",
      icon: Brain,
      title: "Neurology Care",
      shortDescription: "Expert treatment for neurological conditions",
      fullDescription:
        "Specialized care for brain and nervous system disorders including headaches, epilepsy, Parkinson's disease, multiple sclerosis, and stroke recovery.",
      features: [
        "EEG & EMG testing",
        "Stroke prevention & treatment",
        "Epilepsy management",
        "Headache & migraine treatment",
        "Movement disorder care",
        "Memory clinic services",
      ],
      price: "Consultation: ₹140",
      duration: "60 minutes",
      availability: "Mon-Fri, 8 AM - 6 PM",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      id: 5,
      category: "Surgery",
      icon: Scissors,
      title: "Minimally Invasive Surgery",
      shortDescription: "Advanced surgical procedures with faster recovery",
      fullDescription:
        "Our surgical team specializes in minimally invasive techniques including laparoscopic and robotic surgery, offering less pain, shorter hospital stays, and quicker recovery times.",
      features: [
        "Laparoscopic surgery",
        "Robotic-assisted procedures",
        "Arthroscopic surgery",
        "Endoscopic procedures",
        "Same-day surgery options",
        "Comprehensive pre & post-op care",
      ],
      price: "Varies by procedure",
      duration: "1-4 hours",
      availability: "Mon-Fri, scheduled",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: 6,
      category: "Treatments",
      icon: Bone,
      title: "Orthopedic Care",
      shortDescription: "Complete musculoskeletal treatment and rehabilitation",
      fullDescription:
        "Comprehensive orthopedic services including sports medicine, joint replacement, fracture care, and rehabilitation for all bone and joint conditions.",
      features: [
        "Joint replacement surgery",
        "Sports injury treatment",
        "Fracture care",
        "Arthritis management",
        "Physical therapy",
        "Custom bracing & orthotics",
      ],
      price: "Consultation: ₹130",
      duration: "45 minutes",
      availability: "Mon-Sat, 8 AM - 6 PM",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      id: 7,
      category: "Emergency",
      icon: Ambulance,
      title: "24/7 Emergency Care",
      shortDescription: "Round-the-clock emergency medical services",
      fullDescription:
        "Our emergency department is staffed 24/7 with board-certified emergency physicians and trauma specialists ready to handle any medical emergency.",
      features: [
        "Immediate medical attention",
        "Trauma care center",
        "Pediatric emergency services",
        "Cardiac emergency response",
        "Advanced life support",
        "Emergency surgery capabilities",
      ],
      price: "Insurance dependent",
      duration: "Immediate care",
      availability: "24/7/365",
      color: "from-red-600 to-rose-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-700",
    },
    {
      id: 8,
      category: "Digital Health",
      icon: Video,
      title: "Telemedicine Services",
      shortDescription: "Virtual consultations from the comfort of your home",
      fullDescription:
        "Connect with our doctors via secure video consultations for non-emergency medical concerns, follow-up visits, and prescription refills.",
      features: [
        "Video consultations",
        "E-prescriptions",
        "Digital health records",
        "Secure messaging",
        "Remote monitoring",
        "Available 7 days a week",
      ],
      price: "Starting at ₹75",
      duration: "15-30 minutes",
      availability: "Daily, 7 AM - 10 PM",
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      id: 9,
      category: "Treatments",
      icon: Baby,
      title: "Pediatric Care",
      shortDescription:
        "Comprehensive healthcare for infants, children, and teens",
      fullDescription:
        "Specialized care for children from newborn to adolescence including well-child visits, immunizations, and treatment of acute and chronic conditions.",
      features: [
        "Well-child checkups",
        "Immunizations",
        "Growth & development monitoring",
        "Sick visits",
        "ADHD & behavioral health",
        "Sports physicals",
      ],
      price: "Consultation: ₹100",
      duration: "30-45 minutes",
      availability: "Mon-Fri, 8 AM - 6 PM",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
    },
    {
      id: 10,
      category: "Diagnostics",
      icon: Eye,
      title: "Ophthalmology Services",
      shortDescription: "Complete eye care and vision services",
      fullDescription:
        "Comprehensive eye examinations, treatment of eye diseases, LASIK surgery, cataract surgery, and contact lens fittings.",
      features: [
        "Comprehensive eye exams",
        "Cataract surgery",
        "LASIK & refractive surgery",
        "Glaucoma treatment",
        "Retinal care",
        "Contact lens fittings",
      ],
      price: "Exam: ₹120",
      duration: "45-60 minutes",
      availability: "Mon-Fri, 9 AM - 5 PM",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      id: 11,
      category: "Digital Health",
      icon: Smartphone,
      title: "Health Monitoring App",
      shortDescription: "Track your health metrics with our mobile app",
      fullDescription:
        "Our mobile app allows you to track vital signs, medications, appointments, and communicate with your healthcare team all in one place.",
      features: [
        "Vital signs tracking",
        "Medication reminders",
        "Appointment scheduling",
        "Lab results access",
        "Secure messaging with providers",
        "Health goal setting",
      ],
      price: "Free for patients",
      duration: "On-demand",
      availability: "24/7",
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      id: 12,
      category: "Treatments",
      icon: Activity,
      title: "Physical Therapy",
      shortDescription: "Rehabilitation and recovery services",
      fullDescription:
        "Our licensed physical therapists provide personalized treatment plans to help you recover from injuries, surgery, or chronic conditions.",
      features: [
        "Post-surgical rehabilitation",
        "Sports injury recovery",
        "Pain management",
        "Mobility improvement",
        "Strength training",
        "Balance & fall prevention",
      ],
      price: "Session: ₹80",
      duration: "45-60 minutes",
      availability: "Mon-Fri, 7 AM - 7 PM",
      color: "from-lime-500 to-green-500",
      bgColor: "bg-lime-50",
      iconColor: "text-lime-600",
    },
  ];

  // Filter services by category
  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  // Stats
  const stats = [
    { icon: Users, number: "10K+", label: "Patients Served Monthly" },
    { icon: Award, number: "50+", label: "Medical Specialties" },
    { icon: Clock, number: "24/7", label: "Emergency Care" },
    { icon: Star, number: "4.9", label: "Patient Rating" },
  ];

  // Why choose our services
  const whyChooseUs = [
    {
      icon: Shield,
      title: "Advanced Technology",
      description: "State-of-the-art medical equipment and facilities",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Board-certified physicians and specialists",
    },
    {
      icon: Clock,
      title: "Quick Access",
      description: "Same-day and next-day appointments available",
    },
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Personalized treatment plans for every patient",
    },
    {
      icon: DollarSign,
      title: "Affordable Pricing",
      description: "Transparent pricing and insurance accepted",
    },
    {
      icon: Zap,
      title: "Fast Results",
      description: "Quick turnaround on tests and diagnostics",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="rrelative bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 transition-colors duration-200">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Comprehensive Healthcare Services
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              World-Class Medical Services
            </h1>
            <p className="text-xl text-blue-100 dark:text-blue-200 mb-8">
              From routine checkups to advanced treatments, we provide
              comprehensive healthcare services using the latest medical
              technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/appointments"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Calendar className="w-5 h-5" />
                Book a Service
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border-2 border-white/50"
              >
                Explore Services
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-3">
                  <stat.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.number}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section
        className="py-8 sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-200"
        id="services"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Our Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredServices.length} services
            </p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.name
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <category.icon className="w-5 h-5" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-transparent dark:border-gray-700"
              >
                {/* Service Header */}
                <div
                  className={`bg-linear-to-r ${service.color} p-6 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-white/90">{service.shortDescription}</p>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          {service.price}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{service.availability}</span>
                    </div>
                  </div>

                  {/* Features - Collapsible */}
                  <div className="mb-6">
                    <button
                      onClick={() =>
                        setExpandedService(
                          expandedService === service.id ? null : service.id,
                        )
                      }
                      className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>Key Features</span>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform ${expandedService === service.id ? "rotate-90" : ""}`}
                      />
                    </button>

                    {expandedService === service.id && (
                      <div className="space-y-2 animate-in slide-in-from-top">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          {service.fullDescription}
                        </p>
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Link
                      to="/appointments"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-center transition-colors shadow-lg hover:shadow-blue-500/30"
                    >
                      Book Now
                    </Link>
                    <button className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950/20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We combine cutting-edge technology with compassionate care to
              deliver exceptional healthcare services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 hover:shadow-lg transition-all duration-200 border border-transparent dark:border-gray-700"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-xl mb-4">
                  <item.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance & Payment */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Insurance & Payment Options
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                We accept most major insurance plans and offer flexible payment
                options to make quality healthcare accessible to everyone.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      Most Insurance Accepted
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We work with all major insurance providers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      Flexible Payment Plans
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Interest-free payment options available
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      Transparent Pricing
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      No hidden fees or surprise charges
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-blue-500/30"
              >
                Contact Billing
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-transparent dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Accepted Insurance Providers
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Blue Cross",
                  "Aetna",
                  "Cigna",
                  "UnitedHealth",
                  "Medicare",
                  "Medicaid",
                  "Humana",
                  "Kaiser",
                ].map((provider, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center font-semibold text-gray-700 dark:text-gray-300 shadow-sm"
                  >
                    {provider}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
                Don't see your insurance? Contact us to verify coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 text-white transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8">
            Book an appointment today and take the first step towards better
            health
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/appointments"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 dark:text-blue-800 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border-2 border-white/50"
            >
              <Phone className="w-5 h-5" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-8 bg-red-600 dark:bg-red-800 text-white transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Ambulance className="w-10 h-10" />
              <div>
                <h3 className="text-xl font-bold">24/7 Emergency Services</h3>
                <p className="text-red-100 dark:text-red-200">
                  Immediate medical attention when you need it most
                </p>
              </div>
            </div>
            <a
              href="tel:911"
              className="bg-white text-red-600 dark:text-red-800 px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-50 transition-colors"
            >
              Call 911
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
