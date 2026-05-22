import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-gray-400">
              Your trusted healthcare partner. We connect patients with
              qualified doctors for seamless appointment scheduling and quality
              medical care.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="hover:text-orange-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-orange-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-orange-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/doctors"
                  className="hover:text-orange-500 transition-colors"
                >
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link
                  to="/doctors"
                  className="hover:text-orange-500 transition-colors"
                >
                  Specialties
                </Link>
              </li>
              <li>
                <Link
                  to="/appointments"
                  className="hover:text-orange-500 transition-colors"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-orange-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-orange-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/services"
                  className="hover:text-orange-500 transition-colors"
                >
                  Online Consultation
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-orange-500 transition-colors"
                >
                  Lab Tests
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-orange-500 transition-colors"
                >
                  Prescription Refills
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-orange-500 transition-colors"
                >
                  Health Records
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-orange-500 transition-colors"
                >
                  Emergency Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 shrink-0" />
                <span>
                  123 Medical Center Dr, Suite 100, Healthcare City, HC 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-orange-500 transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className=" shrink-0" />
                <a
                  href="mailto:info@doctorappointment.com"
                  className="hover:text-orange-500 transition-colors"
                >
                  info@doctorappointment.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock size={18} className="mt-1 shrink-0" />
                <div>
                  <p>Mon - Fri: 8:00 AM - 8:00 PM</p>
                  <p>Sat - Sun: 9:00 AM - 5:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2026 Medicare. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy-policy"
                className="hover:text-orange-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-orange-500 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-orange-500 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
