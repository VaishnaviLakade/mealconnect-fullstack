import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../utils/auth";
import mc from "../assets/mclogo.png"; // Ensure the correct import

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate("/home");
  };

  return (
    <nav className="bg-white shadow-md p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={mc} alt="MealConnect Logo" className="h-20 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-lg">
          {["Home", "About", "Contact Us"].map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.1, color: "#9333ea" }} // Purple hover effect
              className="cursor-pointer text-gray-700 hover:text-purple-600 font-medium"
            >
              <Link to={`/${item.toLowerCase().replace(/\s/g, "-")}`}>{item}</Link>
            </motion.li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4">
          {isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-full text-lg hover:bg-red-600"
            >
              Logout
            </motion.button>
          ) : (
            <Link to="/donor-login">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-700"
              >
                Donor Login / Signup
              </motion.button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 text-2xl">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white px-4 pb-4"
        >
          {["Home", "Donate", "Request", "Track", "Foundation", "How to help?", "Volunteers", "Events", "About", "Contact Us"].map((item, index) => (
            <Link
              key={index}
              to={`/${item.toLowerCase().replace(/\s/g, "-")}`}
              className="block text-gray-700 hover:text-purple-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block text-center text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg mt-2 w-full"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/donor-login"
              className="block text-center text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg mt-2"
              onClick={() => setIsOpen(false)}
            >
              Donor Login / Signup
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
}
