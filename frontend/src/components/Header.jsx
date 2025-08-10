import { useState, useRef, useEffect } from "react";
import {
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import fetchUser from "../utils/fetchUser.js";
import apiClient from "../utils/apiClient.js";

export default function Header({
  isDarkMode,
  setIsDarkMode,
  isSidebar,
  setIsSidebar,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "John Doe",
    email: "johndoe@example.com",
    avatar: "",
  });

  useEffect(() => {
    const newUser = fetchUser();
    setUser(newUser);
  }, []);

  const getInitials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const toggleSidebar = () => setIsSidebar(!isSidebar);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    apiClient("/user/logout", { method: "POST" });
    console.log("Sign out clicked");
    setIsDropdownOpen(false);
    navigate("/");
  };

  const handleSettings = () => {
    console.log("Navigate to settings");
    setIsDropdownOpen(false);
    navigate("/account");
  };

  return (
    <div className="flex items-center justify-between max-w-screen p-6 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 h-20 pr-20 pl-20 transition-colors duration-300">
      <button
        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus:outline-none"
        onClick={toggleSidebar}
        aria-label={isSidebar ? "Close menu" : "Open menu"}
      >
        <div className="relative w-8 h-8">
          <Menu
            className={`absolute inset-0 w-8 h-8 text-gray-700 dark:text-gray-300 transition-all duration-300 transform ${
              isSidebar
                ? "opacity-0 rotate-180 scale-75"
                : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <X
            className={`absolute inset-0 w-8 h-8 text-gray-700 dark:text-gray-300 transition-all duration-300 transform ${
              isSidebar
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-180 scale-75"
            }`}
          />
        </div>
      </button>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white dark:text-gray-900" />
        </div>
        <span className="font-bold text-xl text-gray-900 dark:text-white">
          SimpliNotes
        </span>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(user.username)
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm hidden sm:block transition-colors duration-300">
              {user.username}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user.username)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-3">
                    {isDarkMode ? (
                      <Moon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <span>
                    {isDarkMode
                      ? "Switch to Light Mode"
                      : "Switch to Dark Mode"}
                  </span>
                </div>
                <div
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    isDarkMode ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                      isDarkMode ? "translate-x-3" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>

              {/* Settings */}
              <button
                onClick={handleSettings}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <Settings className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                Settings
              </button>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
