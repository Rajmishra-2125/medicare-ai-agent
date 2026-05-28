import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Metadata Registry mapping precise route paths to premium document titles
 * and corresponding search-engine optimized description content.
 */
const metadataRegistry = {
  // Public & Auth Routes
  "/": {
    title: "MediCare | Book Doctors & Clinic Appointments Online",
    desc: "Your trusted health partner for finding experienced doctors, scheduling virtual or in-person visits, and managing digital health records safely."
  },
  "/home": {
    title: "MediCare | Book Doctors & Clinic Appointments Online",
    desc: "Your trusted health partner for finding experienced doctors, scheduling virtual or in-person visits, and managing digital health records safely."
  },
  "/about": {
    title: "About MediCare | Connect with Quality Healthcare",
    desc: "Learn about MediCare's mission, our certified healthcare providers, and our dedication to making quality clinical care accessible to everyone."
  },
  "/contact": {
    title: "Contact MediCare | 24/7 Technical & Medical Help",
    desc: "Get in touch with our helpdesk. We are available 24/7 to resolve technical issues, appointment scheduling queries, or system feedback."
  },
  "/services": {
    title: "Healthcare Services & Wellness Portals | MediCare",
    desc: "Explore MediCare's comprehensive medical offerings, from teleconsultations and laboratory diagnostics to prescription refills and emergency care."
  },
  "/services/online-consultation": {
    title: "HD WebRTC Online Telemedicine | MediCare Services",
    desc: "Connect instantly with certified medical experts online via our secure, high-definition, HIPAA-compliant WebRTC video consulting platform."
  },
  "/services/lab-tests": {
    title: "Diagnostics Pricing & Cart Calculator | MediCare Services",
    desc: "Add pathology tests, schedule local blood sample collections, and calculate diagnostic prices dynamically using our secure medical cart."
  },
  "/services/prescription-refills": {
    title: "Active Rx HIPAA Refill Requester | MediCare Services",
    desc: "Submit digital requests to pharmacies for prescription refills safely and quickly under complete HIPAA-compliant data transmission."
  },
  "/services/health-records": {
    title: "AES-256 Record Encryption Vault | MediCare Services",
    desc: "Store and access clinical history, immunization logs, and lab results safely encrypted under state-of-the-art AES-256 standard protocols."
  },
  "/services/emergency-care": {
    title: "24/7 SOS Ambulance Dispatcher | MediCare Services",
    desc: "Trigger emergency rescue requests to dispatch local ambulances and paramedical teams immediately to your exact geographical coordinates."
  },
  "/login": {
    title: "Sign In to Your Account | MediCare Secure Portal",
    desc: "Access your clinical history, appointments ledger, and provider dashboard securely using certified Google OAuth or email authentication."
  },
  "/register": {
    title: "Create a Secure Account | MediCare Online Registration",
    desc: "Register a secure patient profile with MediCare to access local diagnostic programs, expert doctors, and secure health timelines."
  },
  "/verify-email": {
    title: "Email Verification & Address Sync | MediCare Registration",
    desc: "Validate your primary registry credentials and synchronize geographic clinic addresses to finalize your profile setup."
  },
  "/recover-account": {
    title: "Recover Account Credentials | MediCare System Security",
    desc: "Securely retrieve or unlock your primary registry credentials under encrypted password recovery guidelines."
  },
  "/forgot-password": {
    title: "Reset Account Password | MediCare System Security",
    desc: "Initiate verified reset linkages to change credentials safely via registered email accounts."
  },
  "/doctors": {
    title: "Certified Doctors Catalog | Find Generalists & Specialists",
    desc: "Browse our dynamic directories of certified cardiologists, dermatologists, surgeons, and pediatricians near your location."
  },
  "/appointments": {
    title: "Book Clinic & Telehealth Consultations | MediCare Scheduler",
    desc: "Book slots, select time options, choose consultation format, and schedule visits dynamically using our intelligent system."
  },
  "/privacy-policy": {
    title: "Data Confidentiality & Privacy Policy | MediCare Standards",
    desc: "Review detailed guidelines outlining how we transmit, encrypt, and secure clinical records, session caches, and personal profiles."
  },
  "/terms": {
    title: "Terms of Service & Usage Framework | MediCare Regulations",
    desc: "Understand terms governing appointment booking, telehealth workspace conduct, and billing structures on MediCare."
  },
  "/cookies": {
    title: "Cookie Consent & Fallback Storage Policies | MediCare Settings",
    desc: "Read our policies on session tracking, technical fallbacks, and user preference caching setups on MediCare."
  },
  "/cookie-policy": {
    title: "Cookie Consent & Fallback Storage Policies | MediCare Settings",
    desc: "Read our policies on session tracking, technical fallbacks, and user preference caching setups on MediCare."
  },

  // Patient Panel Routes
  "/patient/home": {
    title: "Patient Dashboard | MediCare Portal",
    desc: "Overview of your upcoming appointments, medical alerts, recent laboratory metrics, and automated wellness advice."
  },
  "/patient/profile": {
    title: "My Profile | Patient Portal",
    desc: "Update your full legal name, avatar photo, phone credentials, and primary residential address details cleanly."
  },
  "/patient/appointments": {
    title: "My Appointments & Medical History | Patient Portal",
    desc: "Browse past and upcoming consultation cards, download signed digital prescriptions, or trigger session cancellations."
  },
  "/patient/book-appointment": {
    title: "Book New Appointment | Patient Portal",
    desc: "Select specialists, verify slot calendars, write visit objectives, and secure consultations in a few simple clicks."
  },
  "/patient/doctors": {
    title: "Search Certified Doctors | Patient Portal",
    desc: "Query clinical professional portfolios by city location, price parameters, clinical ratings, and specialty domains."
  },
  "/patient/settings": {
    title: "Account Settings & Preferences | Patient Portal",
    desc: "Configure dark/light aesthetics, toggle background notifications, and modify two-factor credential keys."
  },

  // Doctor Panel Routes
  "/doctor/dashboard": {
    title: "Doctor Dashboard | MediCare Portal",
    desc: "Track daily schedules, total unique patient metrics, and review upcoming online or physical visits."
  },
  "/doctor/appointments": {
    title: "My Appointments & Schedules | Doctor Portal",
    desc: "Manage patient booking logs, authorize digital prescription PDFs, and check in-person clinic slots."
  },
  "/doctor/profile": {
    title: "Professional Profile | Doctor Portal",
    desc: "Edit clinical bios, qualification details, consultation fees, and available work days."
  },
  "/doctor/settings": {
    title: "Portal Settings & Security | Doctor Portal",
    desc: "Adjust notifications configurations, professional credentials, and session workspace setups."
  },

  // Admin Panel Routes
  "/admin/dashboard": {
    title: "Admin Central Dashboard | MediCare System",
    desc: "Audit operational analytics, active clinical records, system-wide billing, and server-side metrics."
  },
  "/admin/manage-doctor": {
    title: "Manage Registered Doctors | Admin Control",
    desc: "Register new clinical accounts, review medical credentials, and oversee professional directories."
  },
  "/admin/manage-patient": {
    title: "Manage Patient Registries | Admin Control",
    desc: "Oversee active user portfolios, verify profiles, and manage clinical file logs."
  },
  "/admin/manage-appointment": {
    title: "Oversee Patient Appointments | Admin Control",
    desc: "Reschedule pending visits, override bookings, and track global appointments statuses."
  },
  "/admin/manage-settings": {
    title: "Global Portal Configurations | Admin Control",
    desc: "Adjust system parameters, API connection points, and legal rules configurations."
  },
  "/admin/manage-payment": {
    title: "Payment Audits & Ledgers | Admin Control",
    desc: "Review cash registers, audit online transactional logs, and oversee global finance records."
  }
};

/**
 * Automatically intercepts route changes in React Router to intelligently
 * generate and map corresponding <title> and <meta name="description"> strings.
 */
const DynamicMetadata = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    let title = "";
    let desc = "MediCare - Your trusted health partner for online medical appointments.";

    // 1. Precise Match from Registry
    if (metadataRegistry[path]) {
      title = metadataRegistry[path].title;
      desc = metadataRegistry[path].desc;
    }
    // 2. Prefix Match for Dynamic Parameters
    else if (path.startsWith("/patient/payment/")) {
      title = "Secure Payment Checkout | Patient Portal";
      desc = "Enter billing details and secure your scheduled consultation slot using our safe payment portals.";
    } else if (path.startsWith("/consultation/")) {
      title = "Live Consultation Room | MediCare Telehealth";
      desc = "Secure, end-to-end encrypted live audio and video medical workspace.";
    } else if (path.startsWith("/reset-password/")) {
      title = "Create New Password | MediCare System Security";
      desc = "Reset your profile login credentials securely to regain account access.";
    }

    // 3. Fallback Auto-Generation for Unregistered Paths
    if (!title) {
      const segments = path.split('/').filter(Boolean);
      if (segments.length > 0) {
        let lastSegment = segments[segments.length - 1];
        
        // Format Mongo ID strings or long parameters gracefully
        if (lastSegment.length > 15) {
          lastSegment = segments[segments.length - 2] || "Details";
        }
        
        // Convert "my-appointments" to "My Appointments"
        const formattedSegment = lastSegment
             .split('-')
             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
             .join(' ');
        
        // Inject structural mappings based on subdirectories
        if (segments[0] === 'admin') {
          title = `Admin | ${formattedSegment} - Admin Control`;
        } else if (segments[0] === 'doctor') {
          title = `Doctor | ${formattedSegment} - Doctor Portal`;
        } else if (segments[0] === 'patient') {
          title = `Patient | ${formattedSegment} - Patient Portal`;
        } else {
          title = `${formattedSegment} | MediCare`;
        }
      } else {
        title = "MediCare";
      }
    }

    // Apply the title
    document.title = title;

    // Apply the description tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;

  }, [location]);

  return null;
};

export default DynamicMetadata;
