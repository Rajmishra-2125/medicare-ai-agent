import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, register, reset } from "../../features/auth/authSlice";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const EmailVerification = () => {
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, message } = useSelector((state) => state.auth);
  const formData = location.state?.registrationData;

  useEffect(() => {
    // If no form data was passed, redirect back to register
    if (!formData) {
      navigate("/register", { replace: true });
      return;
    }
  }, [formData, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (isError && message) {
      setErrorMessage(message);
    }
  }, [isError, message]);

  useEffect(() => {
    // If user is successfully authenticated and not just in OTP phase anymore
    if (user && !user.isOTP) {
      toast.success("Account successfully created!");
      switch (user.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "DOCTOR":
          navigate("/doctor/dashboard");
          break;
        case "PATIENT":
          navigate("/");
          break;
        default:
          navigate("/");
      }
    }
    
    // We only reset on unmount to not lose the error state during render
    return () => {
        if (!window.location.pathname.includes('/verify-email')) {
             dispatch(reset());
        }
    };
  }, [user, navigate, dispatch]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
        setErrorMessage("Please enter a valid 6-digit code.");
        return;
    }

    setErrorMessage(""); // clear previous errors

    const finalData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword") finalData.append(key, formData[key]);
    });
    finalData.append("otp", otpCode);
    
    dispatch(verifyOTP(finalData));
  };

  const handleResend = () => {
    if (countdown > 0) return;
    
    setErrorMessage("");
    const registrationData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword") registrationData.append(key, formData[key]);
    });

    dispatch(register(registrationData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("A new verification code has been sent!");
        setCountdown(60);
      }
    });
  };

  if (!formData) return null; // Prevent flicker while redirecting

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Logo / Icon Area */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 mb-6 shadow-sm">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Verify Your Email
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
            We sent a 6-digit confirmation code to <br/>
            <strong className="text-slate-700 dark:text-slate-300">{formData.email}</strong>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 p-8 sm:p-10 animate-fade-in-up transition-all duration-300">
          <form className="space-y-6" onSubmit={handleVerify}>
            <div className="space-y-2 text-center">
              <label htmlFor="otp" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                Enter Verification Code
              </label>
              
              <input
                id="otp"
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  if (errorMessage) setErrorMessage("");
                }}
                className={`block w-full text-center text-3xl tracking-[0.5em] py-4 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold outline-none shadow-sm ${
                  errorMessage 
                    ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20 focus:border-red-500' 
                    : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
                placeholder="------"
              />
              
              {errorMessage && (
                <p className="text-sm font-semibold text-red-500 mt-3 animate-fade-in text-left ml-2">
                  {errorMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={otpCode.length !== 6 || isLoading}
              className="w-full flex items-center justify-center py-4 px-4 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Verify Account"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center">
              Didn't receive the code? Check your spam folder or try resending.
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {countdown > 0 ? (
                `Resend code in ${countdown}s`
              ) : (
                "Resend Code"
              )}
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Link
            to="/register"
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
