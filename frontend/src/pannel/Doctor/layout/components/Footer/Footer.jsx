import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto py-4 px-8 border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center w-full">
        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-indigo-600 dark:text-indigo-400">MediCare</span>{" "}
          Provider Portal.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
