import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MessageCircle,
  Bot,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Activity,
  Clock,
  Users,
  Star,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Award,
  Shield,
  Zap,
  CheckCircle,
  TrendingUp,
  Video,
  FileText,
  Ambulance,
  Sparkles,
  Baby,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAgentChat } from "../../features/agent/agentSlice";
import { getAllDoctors } from "../../features/doctors/DoctorSlice";
import { Skeleton } from "../ui/skeleton";

function Home() {
  const dispatch = useDispatch();
  const { doctors, isLoading } = useSelector((state) => state.doctor);

  useEffect(() => {
    if (!doctors || doctors.length === 0) {
      dispatch(getAllDoctors());
    }
  }, [dispatch, doctors]);

  // Dynamic Stats calculations based on database doctors
  const stats = useMemo(() => {
    const defaultStats = [
      { icon: Users, number: "10,000+", label: "Happy Patients" },
      { icon: Stethoscope, number: "50+", label: "Expert Doctors" },
      { icon: Award, number: "15+", label: "Years Experience" },
      { icon: Star, number: "4.9", label: "Average Rating" },
    ];

    if (!doctors || !Array.isArray(doctors) || doctors.length === 0) {
      return defaultStats;
    }

    const doctorCount = doctors.length;

    // Sum of patients across all doctors
    const patientSum = doctors.reduce(
      (acc, doc) => acc + (doc.totalAppointments || doc.reviewCount || 0),
      0
    );

    // Sum of experience across all doctors
    const experienceSum = doctors.reduce(
      (acc, doc) => acc + (parseInt(doc.experience) || 0),
      0
    );

    // Average rating across all doctors
    const ratingSum = doctors.reduce(
      (acc, doc) => acc + (parseFloat(doc.rating) || 0),
      0
    );
    const ratingAvg = ratingSum > 0 ? (ratingSum / doctorCount).toFixed(1) : "0.0";

    return [
      {
        icon: Users,
        number: patientSum > 0 ? `${patientSum.toLocaleString()}+` : `${(doctorCount * 25)}+`,
        label: "Happy Patients",
      },
      {
        icon: Stethoscope,
        number: `${doctorCount}+`,
        label: "Expert Doctors",
      },
      {
        icon: Award,
        number: experienceSum > 0 ? `${experienceSum}+` : "15+",
        label: "Years Experience",
      },
      {
        icon: Star,
        number: ratingAvg !== "0.0" ? ratingAvg : "4.9",
        label: "Average Rating",
      },
    ];
  }, [doctors]);

  // AI Agent Features
  const aiFeatures = [
    {
      icon: Bot,
      title: "AI Booking Assistant",
      description: "Book appointments 24/7 with our intelligent chatbot",
      color: "bg-blue-500",
    },
    {
      icon: Brain,
      title: "Smart Diagnosis",
      description: "Get preliminary insights based on your symptoms",
      color: "bg-purple-500",
    },
    {
      icon: Calendar,
      title: "Auto Scheduling",
      description: "AI finds the best available slots for you",
      color: "bg-green-500",
    },
    {
      icon: MessageCircle,
      title: "24/7 Chat Support",
      description: "Instant answers to your medical queries",
      color: "bg-orange-500",
    },
  ];

  // Dynamic Specialties calculations based on database doctors
  const specialties = useMemo(() => {
    const defaultSpecialties = [
      { icon: Heart, name: "Cardiology" },
      { icon: Brain, name: "Neurology" },
      { icon: Sparkles, name: "Dermatology" },
      { icon: Activity, name: "Orthopedics" },
      { icon: Baby, name: "Pediatrics" },
      { icon: Eye, name: "Ophthalmology" },
    ];

    if (!doctors || !Array.isArray(doctors)) {
      return defaultSpecialties.map((s) => ({ ...s, doctors: 0 }));
    }

    return defaultSpecialties.map((spec) => {
      const count = doctors.filter((doc) => {
        const specName = (doc.specialization || "").toLowerCase().trim();
        const category = spec.name.toLowerCase().trim();
        return specName === category || 
               (category.length >= 5 && specName.startsWith(category.substring(0, 5))) ||
               (specName.length >= 5 && category.startsWith(specName.substring(0, 5))) ||
               specName.includes(category) || 
               category.includes(specName);
      }).length;

      return {
        ...spec,
        doctors: count,
      };
    });
  }, [doctors]);

  // Top Doctors
  const topDoctors = useMemo(() => {
    if (!doctors || !Array.isArray(doctors)) return [];
    return doctors.slice(0, 4).map((doc) => ({
      id: doc._id || doc.doctorId,
      name: doc.doctorDetails?.fullname || doc.doctor || "Doctor",
      specialty: doc.specialization || "General",
      experience: `${parseInt(doc.experience) || 0} years`,
      rating: parseFloat(doc.rating || 4.5).toFixed(1),
      patients: doc.totalAppointments || doc.reviewCount || 100,
      image:
        doc.doctorDetails?.profileImage ||
        `https://ui-avatars.com/api/?name=${doc.doctorDetails?.fullname || doc.doctor || "Doctor"}&background=random`,
    }));
  }, [doctors]);

  // Services
  const services = [
    {
      icon: Video,
      title: "Telemedicine",
      description: "Consult with doctors from home via video call",
    },
    {
      icon: FileText,
      title: "Health Records",
      description: "Access your complete medical history anytime",
    },
    {
      icon: Ambulance,
      title: "Emergency Care",
      description: "24/7 emergency medical services available",
    },
    {
      icon: Activity,
      title: "Health Monitoring",
      description: "Track your vitals and health metrics",
    },
  ];

  // Features
  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and HIPAA compliant",
    },
    {
      icon: Zap,
      title: "Fast Appointments",
      description: "Book in under 60 seconds",
    },
    {
      icon: Clock,
      title: "Flexible Timing",
      description: "Choose slots that work for you",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your health journey",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "John Davis",
      text: "The AI booking assistant made scheduling so easy! Got an appointment in minutes.",
      rating: 5,
      date: "Jan 2026",
    },
    {
      name: "Maria Garcia",
      text: "Excellent doctors and the telemedicine feature is a game-changer for busy parents.",
      rating: 5,
      date: "Dec 2025",
    },
    {
      name: "Robert Chen",
      text: "Best healthcare experience I've had. The AI chat support answered all my questions instantly.",
      rating: 5,
      date: "Jan 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Bot className="w-4 h-4" />
                <span className="text-sm font-medium">
                  AI-Powered Healthcare
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your Health, Our Priority
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Book appointments instantly with our AI assistant. Get expert
                medical care from certified doctors, anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/appointments"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Book Appointment
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => dispatch(toggleAgentChat())}
                  className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border-2 border-white/50"
                >
                  <Bot className="w-5 h-5" />
                  Talk to AI Assistant
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600"
                  alt="Healthcare"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        99.9%
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Success Rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-y dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="text-center flex flex-col items-center">
                    <Skeleton className="w-12 h-12 rounded-full mb-3" />
                    <Skeleton className="h-8 w-20 mb-2 animate-pulse" />
                    <Skeleton className="h-4 w-28 animate-pulse" />
                  </div>
                ))
              : stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-3">
                      <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {stat.number}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                AI-Powered
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Smart Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the future of healthcare with our AI-powered agents
              designed to make your journey easier
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Medical Specialties
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Access expert care across multiple specializations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {specialties.map((specialty, index) => (
              <Link
                key={index}
                to="/doctors"
                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                  <specialty.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {specialty.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {specialty.doctors} Doctors
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Our Top Doctors
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Meet our experienced medical professionals
              </p>
            </div>
            <Link
              to="/doctors"
              className="hidden md:inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
            >
              View All
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <Skeleton className="h-64 w-full rounded-none" />
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-1/2 mb-6" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))
              : topDoctors.map((doctor, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold dark:text-gray-200">
                          {doctor.rating}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                        {doctor.specialty}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span>{doctor.experience}</span>
                        <span>{doctor.patients}+ patients</span>
                      </div>
                      <Link
                        to="/doctors/appointments"
                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive healthcare solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
                  <service.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Why Choose MediCare?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                We combine cutting-edge technology with compassionate care to
                deliver the best healthcare experience.
              </p>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600"
                alt="Medical Team"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-linear-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Patients Say</h2>
            <p className="text-xl text-blue-100">
              Real experiences from real people
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg mb-6 text-white/90">{testimonial.text}</p>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-blue-200">{testimonial.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Book your appointment today and experience healthcare reimagined
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/appointments"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment Now
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              <Phone className="w-5 h-5" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
