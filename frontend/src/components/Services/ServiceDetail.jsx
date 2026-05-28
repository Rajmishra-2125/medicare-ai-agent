import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Video,
  Microscope,
  Pill,
  FileText,
  Ambulance,
  Calendar,
  Phone,
  ArrowLeft,
  CheckCircle,
  Activity,
  Shield,
  Clock,
  Sparkles,
  Zap,
  Camera,
  Mic,
  Wifi,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  MapPin,
  Map,
  MessageSquare,
  Search,
  ShoppingCart,
  Check,
} from "lucide-react";

// Service specific data dictionary
const SERVICES_DATA = {
  "online-consultation": {
    title: "Secure Online Consultation",
    category: "Digital Health",
    themeColor: "from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700",
    shadowColor: "shadow-cyan-500/20",
    bgColor: "bg-cyan-50/50 dark:bg-cyan-950/10",
    icon: Video,
    description: "Connect with certified medical specialists in real-time. Experience HD quality video consultations, secure live chat, and instant digital prescriptions from the comfort of your home.",
    features: [
      "Board-certified physician access in under 15 minutes",
      "Fully encrypted HIPAA-compliant WebRTC channels",
      "Integrated digital prescription shelf with auto-refills",
      "Post-consultation summary and direct follow-up chats",
      "Accepts health insurance copays and direct card payments",
    ],
    pricing: "Starting at ₹75 / Consultation",
    hours: "Available 24/7/365",
  },
  "lab-tests": {
    title: "Advanced Laboratory Testing",
    category: "Diagnostics",
    themeColor: "from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700",
    shadowColor: "shadow-emerald-500/20",
    bgColor: "bg-emerald-50/50 dark:bg-emerald-950/10",
    icon: Microscope,
    description: "Get comprehensive blood profiles, allergy testing, and genetic screenings with our state-of-the-art diagnostic services. Schedule home collection with 100% certified phlebotomists.",
    features: [
      "Certified NABL-accredited diagnostic laboratory testing",
      "Hygiene-certified home sample collection by trained professionals",
      "Digital lab report delivery on your secure patient dashboard",
      "Complimentary consultation with a GP to review test reports",
      "Flexible slots from 6:00 AM to 8:00 PM daily",
    ],
    pricing: "Starting at ₹50 / Test Package",
    hours: "Mon - Sun: 6:00 AM - 9:00 PM",
  },
  "prescription-refills": {
    title: "Prescription Refill Shelf",
    category: "Treatments & Meds",
    themeColor: "from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700",
    shadowColor: "shadow-amber-500/20",
    bgColor: "bg-amber-50/50 dark:bg-amber-950/10",
    icon: Pill,
    description: "Manage your active prescription history, request one-click refills from your attending doctors, and organize automatic monthly home delivery integrations.",
    features: [
      "HIPAA-compliant digital medical prescription record shelves",
      "Direct secure API refill approval flows to your clinic physician",
      "Neighborhood local pharmacy delivery networks within 4 hours",
      "Medication adherence calendar schedules and pill alarm reminders",
      "Substantial discounts on chronic illness long-term orders",
    ],
    pricing: "Refill Requests: Free | Medicines: Varies by Brand",
    hours: "Pharmacies Open 24/7",
  },
  "health-records": {
    title: "Digital Health Records Vault",
    category: "Security & Storage",
    themeColor: "from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700",
    shadowColor: "shadow-violet-500/20",
    bgColor: "bg-violet-50/50 dark:bg-violet-950/10",
    icon: FileText,
    description: "Secure, centralize, and maintain control of your entire medical timeline. Access your lab reports, prescriptions, and immunizations securely even when offline via our PWA.",
    features: [
      "End-to-end AES-256 local database device-level encryption keys",
      "PWA Service Worker static-asset & medical record cache fallback",
      "Centralized chronologically grouped patient timeline display",
      "Instant secure link sharing to authorize emergency-room lookups",
      "Seamless PDF reports export with digital doctor signatures",
    ],
    pricing: "Free | Unlimited Secure Cloud Storage",
    hours: "Instant Access 24/7",
  },
  "emergency-care": {
    title: "24/7 Emergency SOS Dispatch",
    category: "Emergency & Trauma",
    themeColor: "from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700",
    shadowColor: "shadow-red-500/20",
    bgColor: "bg-red-50/50 dark:bg-red-950/10",
    icon: Ambulance,
    description: "Activate immediate ICU-grade critical ambulance response or trauma care. Our automated system locks coordinates, dispatches nearest units, and establishes doctor pre-triage coordination.",
    features: [
      "Average 12-minute ambulance arrival in metro areas",
      "Advanced Life Support (ALS) fully-equipped mobile ICU vehicles",
      "Live GPS vehicle location sharing and dispatcher audio feeds",
      "Pre-arrival triage status feeds piped directly to host hospitals",
      "Board-certified trauma surgery teams standing by on arrival",
    ],
    pricing: "Direct Ambulance: Insurance Copay / Free on Emergency",
    hours: "24/7 Trauma Hotline Active",
  },
};

function ServiceDetail() {
  const { serviceType } = useParams();
  const service = SERVICES_DATA[serviceType];

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-orange-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Service Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          The requested service page does not exist or has been relocated.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Services
        </Link>
      </div>
    );
  }

  const IconComponent = service.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Header */}
      <section className={`relative bg-gradient-to-br ${service.themeColor} text-white py-16 transition-all duration-300`}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_40%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold mb-6 transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                {service.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light max-w-3xl leading-relaxed">
                {service.description}
              </p>
            </div>
            
            <div className="hidden lg:flex justify-end">
              <div className={`p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 ${service.shadowColor} shadow-2xl hover:scale-105 transition-transform duration-300`}>
                <IconComponent className="w-24 h-24 text-white drop-shadow-[0_4px_12px_rgba(255,255,255,0.2)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column - Details, Features, Info */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Features Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 transition-colors duration-200">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                What We Offer
              </h2>
              <div className="space-y-4">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="mt-1 shrink-0 p-1 bg-green-50 dark:bg-green-950/30 rounded-lg text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex items-center gap-4 transition-colors duration-200">
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl text-orange-600 dark:text-orange-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Service Hours</p>
                  <p className="font-bold text-gray-950 dark:text-white mt-0.5">{service.hours}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex items-center gap-4 transition-colors duration-200">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl text-green-600 dark:text-green-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Pricing Guide</p>
                  <p className="font-bold text-gray-950 dark:text-white mt-0.5">{service.pricing}</p>
                </div>
              </div>
            </div>

            {/* General Help Alert */}
            <div className="bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 flex items-start gap-4">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-300">HIPAA & GDPR Protected Care</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400/90 mt-1">
                  Medicare complies with global patient confidentiality laws. All telemetry calls, electronic medical charts, pharmacy refills, and labs utilize military-grade encryption systems.
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex gap-4">
              <Link
                to="/appointments"
                className={`flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r ${service.themeColor} text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-lg ${service.shadowColor} hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all`}
              >
                <Calendar className="w-5 h-5" />
                Book Scheduled Service
              </Link>
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl transition-all border border-gray-200 dark:border-gray-700"
              >
                <Phone className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          {/* Right Column - Dedicated Custom Interactive Simulation Tool */}
          <div className="lg:col-span-5">
            <div className={`sticky top-6 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden ${service.shadowColor} transition-colors duration-200`}>
              
              {/* Widget Header */}
              <div className={`bg-gradient-to-r ${service.themeColor} p-6 text-white flex items-center justify-between`}>
                <div>
                  <h3 className="font-extrabold text-xl tracking-tight">Interactive Service Portal</h3>
                  <p className="text-white/80 text-xs mt-0.5">Live validation & scheduling simulator</p>
                </div>
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/10">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Dynamic Widget Rendering based on serviceType */}
              <div className="p-6">
                {serviceType === "online-consultation" && <OnlineConsultationWidget />}
                {serviceType === "lab-tests" && <LabTestsWidget />}
                {serviceType === "prescription-refills" && <PrescriptionRefillsWidget />}
                {serviceType === "health-records" && <HealthRecordsWidget />}
                {serviceType === "emergency-care" && <EmergencyCareWidget />}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

/* ==========================================================================
   1. ONLINE CONSULTATION WIDGET - WebRTC / Video Signal Media Checker
   ========================================================================== */
function OnlineConsultationWidget() {
  const [testState, setTestState] = useState("idle"); // idle, testing, finished
  const [progress, setProgress] = useState(0);
  const [devices, setDevices] = useState({ camera: false, mic: false, network: 0 });
  const [latency, setLatency] = useState(0);
  const intervalRef = useRef(null);

  const startTest = () => {
    setTestState("testing");
    setProgress(0);
    setDevices({ camera: false, mic: false, network: 0 });
    setLatency(0);

    let currentProgress = 0;
    intervalRef.current = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress === 25) {
        setDevices(prev => ({ ...prev, camera: true }));
      }
      if (currentProgress === 55) {
        setDevices(prev => ({ ...prev, mic: true }));
      }
      if (currentProgress === 80) {
        setDevices(prev => ({ ...prev, network: 98 }));
        setLatency(Math.floor(Math.random() * 20) + 12);
      }

      if (currentProgress >= 100) {
        clearInterval(intervalRef.current);
        setTestState("finished");
      }
    }, 150);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">WebRTC Telemedicine Check</h4>
        <p className="text-sm text-gray-500 mt-1">Verify your hardware & network readiness before connecting with doctors.</p>
      </div>

      {testState === "idle" && (
        <div className="text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <Video className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-sm font-bold text-gray-800 dark:text-gray-300">Ready to diagnose connection?</p>
          <p className="text-xs text-gray-500 mt-1">This will scan your webcam, microphone feeds, and connection speed.</p>
          <button
            onClick={startTest}
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md"
          >
            Start Video Signal Test
          </button>
        </div>
      )}

      {testState === "testing" && (
        <div className="space-y-5 p-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-50 dark:bg-blue-900/20">
                Testing hardware pipelines
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {progress}%
              </span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-blue-50 dark:bg-slate-800">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-150"
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Camera className="w-4 h-4" />
                <span>Webcam Capture</span>
              </div>
              {devices.camera ? (
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">DETECTED</span>
              ) : (
                <span className="text-xs text-gray-400 animate-pulse">CONNECTING...</span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mic className="w-4 h-4" />
                <span>Microphone Core</span>
              </div>
              {devices.mic ? (
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">DETECTED</span>
              ) : (
                <span className="text-xs text-gray-400 animate-pulse">CONNECTING...</span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Wifi className="w-4 h-4" />
                <span>Connection Quality</span>
              </div>
              {devices.network > 0 ? (
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">EXCELLENT ({latency}ms)</span>
              ) : (
                <span className="text-xs text-gray-400 animate-pulse">MEASURING LATENCY...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {testState === "finished" && (
        <div className="space-y-5">
          <div className="bg-green-50 dark:bg-green-950/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30 text-center">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <h5 className="font-extrabold text-green-900 dark:text-green-400">Connection Fully Approved</h5>
            <p className="text-xs text-green-700 dark:text-green-500 mt-1">Your device successfully meets Medicare WebRTC consultation criteria.</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Video Pipeline:</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">1080p WebCam (Ready)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Audio Stream:</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">Digital Input (Ready)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Latency Check:</span>
              <span className="font-bold text-green-600">{latency} ms</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startTest}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all"
            >
              Re-Test Connection
            </button>
            <Link
              to="/appointments"
              className="flex-2 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md"
            >
              Join Consult Room
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   2. LAB TESTS WIDGET - Dynamic Selector & Home Collection Booking
   ========================================================================== */
const LAB_TEST_ITEMS = [
  { id: "cbc", name: "Complete Blood Count (CBC)", price: 35, category: "Haematology" },
  { id: "thy", name: "Thyroid Profile (T3, T4, TSH)", price: 65, category: "Hormone" },
  { id: "lpd", name: "Lipid Profile (Cholesterol)", price: 45, category: "Cardiac" },
  { id: "kdy", name: "Kidney Function Test (KFT)", price: 55, category: "Renal" },
  { id: "diab", name: "Diabetes HbA1c Test", price: 40, category: "Metabolic" },
];

function LabTestsWidget() {
  const [selectedTests, setSelectedTests] = useState([]);
  const [homeCollection, setHomeCollection] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const toggleTest = (test) => {
    if (selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const clearAll = () => setSelectedTests([]);

  const subtotal = selectedTests.reduce((sum, t) => sum + t.price, 0);
  const collectionFee = homeCollection && selectedTests.length > 0 ? 15 : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + collectionFee + tax;

  const filteredTests = LAB_TEST_ITEMS.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">Diagnostics Cart Estimator</h4>
        <p className="text-sm text-gray-500 mt-1">Select required checkups and estimate fees with home collection options.</p>
      </div>

      {!checkoutComplete ? (
        <>
          {/* Test Selector */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search diagnostics (e.g. CBC, HbA1c)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {filteredTests.map((test) => {
                const isSelected = selectedTests.some(t => t.id === test.id);
                return (
                  <button
                    key={test.id}
                    onClick={() => toggleTest(test)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                        : "border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{test.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{test.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">₹{test.price}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 dark:border-gray-600"
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Home Collection Toggle */}
          {selectedTests.length > 0 && (
            <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-gray-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Home Sample Collection</p>
                  <p className="text-xs text-gray-400 mt-0.5">Phlebotomist visits your address (+₹15)</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={homeCollection}
                onChange={() => setHomeCollection(!homeCollection)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-gray-300"
              />
            </label>
          )}

          {/* Pricing Summary */}
          {selectedTests.length > 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 space-y-2 border border-gray-100 dark:border-gray-800/80">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tests Subtotal:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">₹{subtotal}</span>
              </div>
              {homeCollection && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Home Collection Fee:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">₹{collectionFee}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax & Lab Handling (8%):</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">₹{tax}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700/50 pt-2 flex justify-between font-black text-gray-900 dark:text-white text-base">
                <span>Total Estimated Cost:</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{total}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              Select one or more diagnostic tests to generate an estimate.
            </div>
          )}

          {/* Checkout Button */}
          {selectedTests.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={clearAll}
                className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCheckoutComplete(true)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md"
              >
                Request Cart Scheduling
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-5">
          <div className="bg-emerald-50 dark:bg-emerald-950/15 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h5 className="font-extrabold text-emerald-900 dark:text-emerald-400">Diagnostics Request Lodged</h5>
            <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">Our customer care will call you shortly to confirm sample slot and dispatch phlebotomists.</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between font-bold">
              <span className="text-gray-500">Selected Tests:</span>
              <span className="text-gray-800 dark:text-gray-200">{selectedTests.length} Items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Collection mode:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{homeCollection ? "Home Address Sample" : "Lab Self-visit"}</span>
            </div>
            <div className="flex justify-between font-black border-t border-gray-200 dark:border-gray-700 pt-2 text-gray-900 dark:text-white">
              <span>Total Fees due:</span>
              <span className="text-emerald-600">₹{total}</span>
            </div>
          </div>

          <button
            onClick={() => setCheckoutComplete(false)}
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl transition-all"
          >
            Modify Diagnostics Cart
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   3. PRESCRIPTION REFILLS WIDGET - Refill validation workflow
   ========================================================================== */
const MOCK_ACTIVE_PRESCRIPTIONS = {
  "rx-9988": { doctor: "Dr. Sandeep Sharma", date: "24-May-2026", meds: "Metformin 500mg, Atorvastatin 10mg", remainingRefills: 2, pharmacy: "Apollo Pharmacy" },
  "rx-4412": { doctor: "Dr. Priya Patel", date: "10-May-2026", meds: "Amoxicillin 250mg", remainingRefills: 0, pharmacy: "MedPlus Pharmacy" },
};

function PrescriptionRefillsWidget() {
  const [rxQuery, setRxQuery] = useState("");
  const [activeRx, setActiveRx] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState("search"); // search, detail, ordered

  const searchPrescription = () => {
    setErrorMsg("");
    const key = rxQuery.toLowerCase().trim();
    if (MOCK_ACTIVE_PRESCRIPTIONS[key]) {
      setActiveRx({ id: key, ...MOCK_ACTIVE_PRESCRIPTIONS[key] });
      setStatus("detail");
    } else {
      setErrorMsg("Prescription ID not found. Enter rx-9988 or rx-4412 for validation.");
    }
  };

  const processRefill = () => {
    setStatus("ordered");
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">Active Rx Refill Requester</h4>
        <p className="text-sm text-gray-500 mt-1">Lookup your digital prescription and request one-click doctor refill authorization.</p>
      </div>

      {status === "search" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Prescription ID (Rx ID)</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={rxQuery}
                onChange={(e) => setRxQuery(e.target.value)}
                placeholder="Enter Rx ID (try: rx-9988 or rx-4412)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            {errorMsg && <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>}
          </div>

          <button
            onClick={searchPrescription}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-md"
          >
            Verify Prescription Status
          </button>
        </div>
      )}

      {status === "detail" && activeRx && (
        <div className="space-y-5">
          <div className="bg-amber-50/50 dark:bg-amber-950/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20 space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="font-bold text-gray-800 dark:text-gray-200 uppercase">{activeRx.id}</span>
              <span className="text-xs text-gray-500">{activeRx.date}</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Attending Doctor</p>
              <p className="font-bold text-gray-900 dark:text-white">{activeRx.doctor}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Prescribed Medicines</p>
              <p className="font-medium text-gray-700 dark:text-gray-300">{activeRx.meds}</p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-gray-500 font-semibold uppercase">Refills Left</p>
              {activeRx.remainingRefills > 0 ? (
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">{activeRx.remainingRefills} Refills Left</span>
              ) : (
                <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full">Expired / Zero Refills</span>
              )}
            </div>
          </div>

          {activeRx.remainingRefills > 0 ? (
            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl space-y-2 text-sm">
                <p className="text-xs text-gray-500 font-semibold uppercase">Nominated Pharmacy</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 dark:text-gray-200">{activeRx.pharmacy}</span>
                  <span className="text-xs font-bold text-emerald-600 uppercase">Auto-dispatch ready</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setStatus("search")}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all"
                >
                  Change ID
                </button>
                <button
                  onClick={processRefill}
                  className="flex-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md"
                >
                  Confirm Refill Dispatch
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/15 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 dark:text-red-400">
                  This prescription has 0 refills remaining. You must book a quick online follow-up consultation with your attending doctor to renew your authorization before dispatching drugs.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStatus("search")}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all"
                >
                  Change ID
                </button>
                <Link
                  to="/appointments"
                  className="flex-2 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md"
                >
                  Book Consultation Room
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {status === "ordered" && (
        <div className="space-y-5">
          <div className="bg-green-50 dark:bg-green-950/15 p-5 rounded-2xl border border-green-100 dark:border-green-900/30 text-center">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <h5 className="font-extrabold text-green-900 dark:text-green-400">Refill Dispatched successfully</h5>
            <p className="text-xs text-green-700 dark:text-green-500 mt-1">Our pharmacy partner is packaging your prescription. Delivery estimated within 4 hours.</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between font-bold">
              <span className="text-gray-500">Refill Approved:</span>
              <span className="text-gray-800 dark:text-gray-200 uppercase">{activeRx.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Partner Pharmacy:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{activeRx.pharmacy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Remaining Refills Left:</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{activeRx.remainingRefills - 1}</span>
            </div>
          </div>

          <button
            onClick={() => setStatus("search")}
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl transition-all"
          >
            Refill Another Prescription
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. HEALTH RECORDS WIDGET - Secure encryption vault upload simulator
   ========================================================================== */
function HealthRecordsWidget() {
  const [files, setFiles] = useState([]);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [vaultStatus, setVaultStatus] = useState("unlocked"); // unlocked, encrypting, locked
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      encrypted: false,
      date: new Date().toLocaleDateString(),
    }));
    setFiles([...files, ...uploadedFiles]);
    setVaultStatus("unlocked");
  };

  const lockVault = () => {
    if (files.length === 0) return;
    setIsEncrypting(true);
    setVaultStatus("encrypting");

    setTimeout(() => {
      setFiles(prev => prev.map(f => ({ ...f, encrypted: true })));
      setIsEncrypting(false);
      setVaultStatus("locked");
    }, 2000);
  };

  const unlockVault = () => {
    setVaultStatus("unlocked");
    setFiles(prev => prev.map(f => ({ ...f, encrypted: false })));
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, idx) => idx !== index));
    if (files.length <= 1) setVaultStatus("unlocked");
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">Secure AES-256 Record Vault</h4>
        <p className="text-sm text-gray-500 mt-1">Upload health charts, immunizations, or reports and simulate client-side secure vault locking.</p>
      </div>

      {/* File Dropper / Input */}
      {vaultStatus === "unlocked" && (
        <div
          onClick={() => fileInputRef.current.click()}
          className="text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-violet-500 dark:hover:border-violet-500 transition-colors cursor-pointer"
        >
          <FileText className="w-10 h-10 text-violet-500 mx-auto mb-2 animate-bounce" />
          <p className="text-sm font-bold text-gray-800 dark:text-gray-300">Drag or Click to upload record</p>
          <p className="text-xs text-gray-500 mt-1">Supports PDF, JPG, PNG up to 10MB</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />
        </div>
      )}

      {/* Uploaded Files Queue */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase">
            <span>Staged Records ({files.length})</span>
            <span>Vault Status</span>
          </div>

          <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-2 max-w-[70%]">
                  <FileText className="w-4 h-4 text-violet-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{file.size} | {file.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.encrypted ? (
                    <span className="text-[10px] font-bold text-violet-600 bg-violet-50 dark:bg-violet-950/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> AES-256
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Unlock className="w-2.5 h-2.5" /> STAGED
                    </span>
                  )}
                  {vaultStatus === "unlocked" && (
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Vault Controls */}
          {vaultStatus === "encrypting" && (
            <div className="p-4 bg-violet-50 dark:bg-violet-950/15 rounded-2xl border border-violet-100 dark:border-violet-900/30 text-center space-y-2">
              <Lock className="w-8 h-8 text-violet-600 mx-auto animate-spin" />
              <h5 className="font-extrabold text-violet-900 dark:text-violet-400">Locking local vaults...</h5>
              <p className="text-xs text-violet-700 dark:text-violet-500 mt-1">Generating unique client-side key hashes and applying AES-256 algorithm.</p>
            </div>
          )}

          {vaultStatus === "locked" && (
            <div className="p-4 bg-green-50 dark:bg-green-950/15 rounded-2xl border border-green-100 dark:border-green-900/30 text-center space-y-2">
              <Lock className="w-8 h-8 text-green-600 mx-auto" />
              <h5 className="font-extrabold text-green-900 dark:text-green-400">Database Vault Encryption Locked</h5>
              <p className="text-xs text-green-700 dark:text-green-500 mt-1">Your documents are secured offline in your browser's encrypted IndexedDB storage shell.</p>
            </div>
          )}

          {vaultStatus === "unlocked" && (
            <button
              onClick={lockVault}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Lock & Encrypt Vault
            </button>
          )}

          {vaultStatus === "locked" && (
            <button
              onClick={unlockVault}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" /> Unlock Vault / Add Files
            </button>
          )}
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-4 text-gray-400 text-xs">
          Upload at least one document to activate the secure encryption simulator.
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   5. EMERGENCY CARE WIDGET - SOS GPS tracking & Dispatcher chat simulator
   ========================================================================== */
function EmergencyCareWidget() {
  const [sosState, setSosState] = useState("inactive"); // inactive, dispatching, onway, arrived
  const [coordinates, setCoordinates] = useState(null);
  const [dispatchTime, setDispatchTime] = useState(12);
  const [chatMessages, setChatMessages] = useState([]);
  const [timerCount, setTimerCount] = useState(12);
  const intervalRef = useRef(null);

  const activateSOS = () => {
    setSosState("dispatching");
    setCoordinates({ lat: "28.6139° N", lng: "77.2090° E" }); // Mock Location
    setChatMessages([
      { sender: "System", text: "SOS TRIPLE-ALPHA BEACON EMITTED SUCCESSFULLY." },
      { sender: "System", text: "Acquiring cellular GPS telemetry coordinates..." },
    ]);

    setTimeout(() => {
      setSosState("onway");
      setChatMessages(prev => [
        ...prev,
        { sender: "System", text: `Coordinates Lock: 28.6139° N, 77.2090° E (Accuracy: ±3 meters)` },
        { sender: "Dispatcher", text: "Medicare Dispatch Center here. An Advanced Life Support ICU Ambulance has been dispatched to your current location immediately. ETA is 12 minutes. Please remain calm." }
      ]);
      setTimerCount(12);
    }, 2500);
  };

  useEffect(() => {
    if (sosState === "onway") {
      intervalRef.current = setInterval(() => {
        setTimerCount(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setSosState("arrived");
            setChatMessages(c => [...c, { sender: "Dispatcher", text: "Ambulance unit is arriving on scene now. Flashing beacon lights visible." }]);
            return 0;
          }
          if (prev === 9) {
            setChatMessages(c => [...c, { sender: "Dispatcher", text: "Unit is crossing the main medical corridor junction. Traffic pre-clearance activated." }]);
          }
          if (prev === 4) {
            setChatMessages(c => [...c, { sender: "Dispatcher", text: "Phlebotomists and surgeons have finalized pre-triage files. Emergency team standing by." }]);
          }
          return prev - 1;
        });
      }, 3000); // 3 seconds per simulated minute
    }

    return () => clearInterval(intervalRef.current);
  }, [sosState]);

  const cancelSOS = () => {
    clearInterval(intervalRef.current);
    setSosState("inactive");
    setCoordinates(null);
    setChatMessages([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">SOS Emergency Dispatch</h4>
        <p className="text-sm text-gray-500 mt-1">Initiate immediate satellite beacon lock to coordinate crisis response teams.</p>
      </div>

      {sosState === "inactive" && (
        <div className="text-center p-8 bg-red-50/50 dark:bg-red-950/10 rounded-2xl border border-dashed border-red-200 dark:border-red-900/30">
          <button
            onClick={activateSOS}
            className="w-28 h-28 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xl rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border-4 border-white dark:border-gray-900 mx-auto flex items-center justify-center transition-all animate-pulse"
          >
            SOS
          </button>
          <p className="text-sm font-bold text-red-900 dark:text-red-400 mt-5">Ready to dispatch crisis support?</p>
          <p className="text-xs text-red-700 dark:text-red-500/80 mt-1">Click the button above to test emergency triangulation and response scheduling.</p>
        </div>
      )}

      {sosState === "dispatching" && (
        <div className="p-5 bg-red-600 text-white rounded-2xl text-center space-y-4 animate-pulse">
          <Ambulance className="w-12 h-12 mx-auto animate-bounce" />
          <div>
            <h5 className="font-black text-lg">LOCKING SATELLITE BEACON...</h5>
            <p className="text-xs text-red-100 mt-1">Acquiring cellular network routing arrays. Remain standing by.</p>
          </div>
        </div>
      )}

      {(sosState === "onway" || sosState === "arrived") && (
        <div className="space-y-4">
          {/* Dispatch Info */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2 text-sm">
            <div className="flex justify-between font-bold">
              <span className="text-gray-500">SOS Geolocation:</span>
              <span className="text-red-600">{coordinates?.lat}, {coordinates?.lng}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Estimated Arrival:</span>
              {sosState === "onway" ? (
                <span className="font-bold text-orange-600 dark:text-amber-500 animate-pulse">{timerCount} Minutes (On the way)</span>
              ) : (
                <span className="font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">ARRIVED ON SCENE</span>
              )}
            </div>
          </div>

          {/* Dispatch Chat Stream */}
          <div className="border border-gray-150 dark:border-gray-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/10 space-y-3 max-h-44 overflow-y-auto">
            <p className="text-[10px] text-gray-400 font-bold text-center border-b pb-1 dark:border-gray-800">EMERGENCY DIALOG PROTOCOL ACTIVE</p>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="text-xs">
                {msg.sender === "System" && (
                  <p className="text-slate-500 italic font-mono">{msg.text}</p>
                )}
                {msg.sender === "Dispatcher" && (
                  <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-850 mt-1">
                    <span className="font-extrabold text-red-600 block text-[10px] uppercase">🚨 Dispatch Officer</span>
                    <p className="text-gray-800 dark:text-gray-200 font-medium mt-0.5 leading-relaxed">{msg.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={cancelSOS}
            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl transition-all"
          >
            Cancel SOS Dispatch Signal
          </button>
        </div>
      )}
    </div>
  );
}

export default ServiceDetail;
