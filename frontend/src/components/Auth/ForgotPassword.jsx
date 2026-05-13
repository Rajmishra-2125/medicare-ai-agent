import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle cooldown timer for the Resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendLink = async (e, isResend = false) => {
    if (e) e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email");
      return;
    }
    
    setErrorMessage("");
    setIsLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setIsSent(true);
      setCountdown(60); // Start 60s cooldown
      toast.success(isResend ? "Recovery email resent!" : (response.data?.message || "Reset link sent!"));
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to send reset link";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Logo / Icon Area */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 mb-6 shadow-sm">
            <KeyRound className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Forgot Password
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 p-8 sm:p-10 animate-fade-in-up transition-all duration-300">
          {isSent ? (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center border-8 border-emerald-100 dark:border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Check your email</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">
                  We've sent a password reset link to <br/>
                  <span className="font-semibold text-slate-900 dark:text-white mt-1 block">{email}</span>
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Didn't receive the email? Check your spam folder or try resending below.
                </p>
                <button
                  onClick={(e) => handleSendLink(e, true)}
                  disabled={countdown > 0 || isLoading}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : countdown > 0 ? (
                    `Resend email in ${countdown}s`
                  ) : (
                    "Click to resend"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={(e) => handleSendLink(e, false)}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className={`block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-medium outline-none shadow-sm ${
                      errorMessage 
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
                    }`}
                    placeholder="name@example.com"
                  />
                </div>
                {errorMessage && (
                  <p className="text-sm font-semibold text-red-500 mt-2 ml-1 animate-fade-in">
                    {errorMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
