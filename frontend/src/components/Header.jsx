import { useState, useRef, useEffect } from "react";
import { Settings, LogOut, ChevronDown, Slice } from "lucide-react";
import hamburger from "../assets/hamburger.svg";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null,
  };

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redirect to login page or handle successful logout
        navigate("/");
      } else {
        console.error("Failed to logout");
        // Handle logout error
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }

    setIsDropdownOpen(false);
  };

  // Handle settings
  const handleSettings = () => {
    // Navigate to settings page or open settings modal
    console.log("Navigate to settings");
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between max-w-screen p-6 bg-white shadow-md h-20 pr-20 pl-20">
      <div className="w-10 h-10">
        <img src={hamburger} alt="menu" />
      </div>

      <div>
        <p className="font-extrabold text-2xl text-gray-800">SimpliNotes</p>
      </div>

      {/* User Account Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(user.name)
            )}
          </div>

          {/* Username and Chevron */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-700 font-medium text-sm hidden sm:block">
              {user.name}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleSettings}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                <Settings className="w-4 h-4 mr-3 text-gray-500" />
                Settings
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
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
