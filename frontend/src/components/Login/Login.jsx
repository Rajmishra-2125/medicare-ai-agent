import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, googleLogin, reset } from "../../features/auth/AuthSlice";
import { GoogleLogin } from "@react-oauth/google";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      switch (user.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "DOCTOR":
          navigate("/doctor/dashboard");
          break;
        case "PATIENT":
          navigate("/patient/home");
          break;
        default:
          navigate("/");
      }
      return;
    }

    if (isError) {
      toast.error(message);
    }

    if (isSuccess && user) {
      toast.success("Login Successful!");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    // credentialResponse.credential is a JWT ID token (not an access token)
    dispatch(googleLogin({ googleToken: credentialResponse.credential }));
  };

  const handleGoogleError = () => {
    toast.error("Google Login Failed! Please try again.");
  };

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 min-h-screen transition-colors duration-200">
      {/* Top Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 items-center justify-center shadow-sm border space-y-4 flex border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex w-40 justify-center items-center ">
          <Link
            to="/register"
            className="w-1/2 py-2 text-center text-lg font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all -mb-0.5"
          >
            Sign Up
          </Link>
          <div className="w-1/2 py-2 text-center text-lg font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-0.5">
            Login
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 ">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
          <div className="md:flex">
            {/* Left Side - Branding & Features (Hidden on mobile, visible on md+) */}
            <div className="md:w-1/3 bg-linear-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 p-8 text-white">
              <div className="relative z-10">
                <div className="mt-12">
                  <h1 className="text-4xl font-bold mb-4 leading-tight">
                    Welcome Back!
                  </h1>
                  <p className="text-blue-100 text-lg mb-8">
                    Sign in to manage your appointments and health records
                    securely.
                  </p>

                  <div className="space-y-4">
                    {[
                      "Secure access to your data",
                      "Manage upcoming appointments",
                      "View prescription history",
                      "Connect with your doctors",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial Card */}
              <div className="relative z-10 mt-15 bg-blue-700/50 dark:bg-blue-900/50 p-6 rounded-xl backdrop-blur-sm border border-blue-500/50">
                <div className="flex items-center space-x-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="italic text-sm mb-4">
                  "MediCare made healthcare so accessible. Booking appointments
                  is now just a few clicks away!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    <img
                      src="https://i.pravatar.cc/150?img=32"
                      alt="Sarah Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Sarah Johnson</p>
                    <p className="text-xs text-blue-200">Patient since 2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-2/3  p-8">
              <div className="max-w-md mx-auto w-full flex flex-col justify-center h-full">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Please enter your details to sign in.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 transition-colors duration-200">
                  <form className="space-y-6" onSubmit={onSubmit}>
                    {/* Email Address */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email Address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={onChange}
                          placeholder="you@example.com"
                          className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={onChange}
                          placeholder="••••••••"
                          className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm transition-colors"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="text-sm">
                        <Link
                          to="/forgot-password"
                          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Login"
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      shape="rectangular"
                      size="large"
                      width="400"
                      text="signin_with"
                      logo_alignment="left"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
