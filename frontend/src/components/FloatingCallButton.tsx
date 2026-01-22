import { Phone } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export const FloatingCallButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const phoneNumber = "+919892489040";

  // Hide button on auth and admin pages
  if (location.pathname === "/auth" || location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleCall}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${isHovered ? 'gap-3' : 'gap-0'}`}
        style={{
          padding: isHovered ? "14px 24px 14px 14px" : "14px",
          width: isHovered ? "auto" : "56px",
        }}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Phone icon with pulse animation */}
        <div className="relative z-10 flex items-center justify-center w-7 h-7">
          <Phone className="w-5 h-5 animate-pulse" />
        </div>

        {/* Text that appears on hover */}
        <span
          className="relative z-10 whitespace-nowrap font-medium text-sm transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            maxWidth: isHovered ? "200px" : "0px",
          }}
        >
          Call Us Now
        </span>

        {/* Ripple effect on hover */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity" />
      </button>

      {/* Outer glow ring animation */}
      <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping pointer-events-none" />
    </div>
  );
};
