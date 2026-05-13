import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../../../../context/ThemeContext";

/**
 * Effective Admin Footer with Theme Changer.
 * Integrates directly with the ThemeContext to provide a seamless
 * theme switching experience for admins.
 */
const Footer = () => {
  return (
    <footer className="mt-auto py-4 px-8 border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Copyright and Brand */}
        <div className="flex flex-col items-center justify-center w-full">
          <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              MediCare
            </span>{" "}
            Healthcare System.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
