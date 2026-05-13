import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ClipboardList,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/AuthSlice";
import { clearNotifications } from "../../features/notifications/notificationSlice";
import toast from "react-hot-toast";
import { Bell } from "lucide-react";
import NotificationPanel from "./NotificationPanel";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Real-time notifications from Redux
  const notifications = useSelector((state) => state.notifications.items);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  const handleClear = () => {
    dispatch(clearNotifications());
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    setImageError(false);
  }, [user?.profileImage]);

  const handleLogout = () => {
    if (user?._id || user?.id) {
      sessionStorage.removeItem(`hasSeenWelcome_${user._id || user.id}`);
    }
    dispatch(logout());
    dispatch(reset());
    setIsDropdownOpen(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`shadow sticky z-50 top-0 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <nav className="bg-gray-950 shadow-md border-gray-50 px-4 lg:px-6 py-2.5">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen">
            <Link to="/" className="flex items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/128/15753/15753044.png"
                className="mr-3 h-10 rounded-xl mx-3"
                alt="Logo"
              />
              <div>
                <h1 className="text-xl font-medium text-white">MediCare</h1>
              </div>
            </Link>

            {/* Desktop Login/Signup/Profile */}
            <div className="flex items-center lg:order-2">
              {/* Notification Bell */}
              {user && (
                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  className="p-2 mr-4 text-gray-400 hover:text-white relative"
                >
                  <Bell className="w-6 h-6" />
                  {/* Mock Badge */}
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
                  )}
                </button>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-white hover:text-orange-500 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white overflow-hidden">
                      {user.profileImage && !imageError ? (
                        <img
                          src={user.profileImage}
                          alt={user.fullname}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <span className="hidden md:block font-medium">
                      {/* {user.fullname} */}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-100 dark:border-gray-700 z-50 animate-fade-in-down">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {user?.fullname}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>

                      <Link
                        to="/my-appointments"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <ClipboardList className="h-4 w-4" />
                        My Appointments
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-t border-gray-100 dark:border-gray-700"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/register"
                  className="text-white border-0 hover:border-blue-600 bg-orange-600 hover:bg-indigo-600 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none transition-colors duration-200"
                >
                  Login/Register
                </Link>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg lg:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-colors duration-200"
                aria-controls="mobile-menu-2"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div
              className="hidden justify-start items-center w-full lg:flex lg:w-auto lg:order-1"
              id="desktop-menu"
            >
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `text-sm block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-500" : "text-white"} hover:text-orange-500 lg:p-0 transition-colors`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/doctors"
                    className={({ isActive }) =>
                      `text-sm block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-500" : "text-white"} hover:text-orange-500 lg:p-0 transition-colors`
                    }
                  >
                    Doctors
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/appointments"
                    className={({ isActive }) =>
                      isActive
                        ? "text-sm block py-2 pr-4 pl-3 duration-200 text-orange-500 lg:p-0 transition-colors"
                        : "text-sm block py-2 pr-4 pl-3 duration-200 text-white hover:text-orange-500 lg:p-0 transition-colors"
                    }
                  >
                    Appointments
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/services"
                    className={({ isActive }) =>
                      isActive
                        ? "text-sm block py-2 pr-4 pl-3 duration-200 text-orange-500 lg:p-0 transition-colors"
                        : "text-sm block py-2 pr-4 pl-3 duration-200 text-white hover:text-orange-500 lg:p-0 transition-colors"
                    }
                  >
                    Services
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      isActive
                        ? "text-sm block py-2 pr-4 pl-3 duration-200 text-orange-500 lg:p-0 transition-colors"
                        : "text-sm block py-2 pr-4 pl-3 duration-200 text-white hover:text-orange-500 lg:p-0 transition-colors"
                    }
                  >
                    Contact
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      isActive
                        ? "text-sm block py-2 pr-4 pl-3 duration-200 text-orange-500 lg:p-0 transition-colors"
                        : "text-sm block py-2 pr-4 pl-3 duration-200 text-white hover:text-orange-500 lg:p-0 transition-colors"
                    }
                  >
                    About Us
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } lg:hidden bg-gray-800 border-t border-gray-700`}
          id="mobile-menu-2"
        >
          {/* Mobile Navigation Links */}
          <ul className="flex flex-col font-medium">
            <li>
              <NavLink
                to=""
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block py-3 px-4 text-white hover:bg-gray-700 border-b border-gray-700 transition-colors duration-200 ${
                    isActive ? "bg-gray-700 text-orange-500" : ""
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctors"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block py-3 px-4 text-white hover:bg-gray-700 border-b border-gray-700 transition-colors duration-200 ${
                    isActive ? "bg-gray-700 text-orange-500" : ""
                  }`
                }
              >
                Doctors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/appointments"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block py-3 px-4 text-white hover:bg-gray-700 border-b border-gray-700 transition-colors duration-200 ${
                    isActive ? "bg-gray-700 text-orange-500" : ""
                  }`
                }
              >
                Appointments
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block py-3 px-4 text-white hover:bg-gray-700 border-b border-gray-700 transition-colors duration-200 ${
                    isActive ? "bg-gray-700 text-orange-500" : ""
                  }`
                }
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block py-3 px-4 text-white hover:bg-gray-700 border-b border-gray-700 transition-colors duration-200 ${
                    isActive ? "bg-gray-700 text-orange-500" : ""
                  }`
                }
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block py-3 px-4 text-white hover:bg-gray-700 border-b border-gray-700 transition-colors duration-200 ${
                    isActive ? "bg-gray-700 text-orange-500" : ""
                  }`
                }
              >
                About Us
              </NavLink>
            </li>
          </ul>
        </div>
      </header>

      <NotificationPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClear={handleClear}
      />
    </>
  );
}

export default Header;
