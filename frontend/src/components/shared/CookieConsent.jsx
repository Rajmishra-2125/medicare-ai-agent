import React from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ShieldCheck, X } from "lucide-react";

export default function CookieConsent() {
  const [hasConsent, setHasConsent] = useLocalStorage("cookie_consent", null);

  if (hasConsent !== null) {
    return null;
  }

  const handleAccept = () => {
    setHasConsent("accepted");
  };

  const handleDecline = () => {
    setHasConsent("declined");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform translate-y-0 transition-all duration-500 ease-in-out">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Your Privacy Matters
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
                We use strictly necessary cookies to keep our healthcare platform secure and functional. With your permission, we'd also like to set optional analytics cookies to help us improve your experience.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 flex-col sm:flex-row">
            <button
              onClick={handleDecline}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors whitespace-nowrap"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 rounded-xl transition-all whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
