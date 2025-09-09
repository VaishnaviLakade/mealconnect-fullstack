import React from "react";
import {
  FaHandsHelping,
  FaUsers,
  FaChartLine,
  FaCheckCircle,
  FaMedal,
} from "react-icons/fa";
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

export default function Landing() {

  const [active, setActive] = useState(0);

  const testimonials = [
    {
      name: "Anjali, NGO Volunteer",
      message: "Thanks to MealConnect, we serve 2X more people than before!",
      image: "/peep.png",
    },
    {
      name: "Ravi, Restaurant Owner",
      message: "A fantastic initiative! We reduce waste and help our community.",
      image: "/peep2.png",
    },
    {
      name: "Meera, College Student",
      message: "Donating leftover food has never been easier.",
      image: "/peep1.png",
    },
  ];

useEffect(() => {
  const interval = setInterval(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, 5000); // Change every 5s
  return () => clearInterval(interval);
}, [testimonials.length]);


  
  return (

    
    <div className="bg-[#F5F7FA] min-h-screen text-gray-800 font-sans">
      {/* Hero Section */}
      <header className="relative text-center py-24 px-6 bg-cover bg-center" style={{ backgroundImage: `url('/home.png')` }}>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-purple-200"
          >
            Connecting Surplus Food with Hungry Hands 🍽️
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl mt-4 font-semibold text-white"
          >
            Donate extra food. Help someone in need. Fight food wastage.
          </motion.h3>
          <div className="mt-8 flex justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-700"
            >
              Donate Now →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="bg-white text-purple-600 px-6 py-3 rounded-full text-lg hover:bg-purple-100"
            >
              Request Food →
            </motion.button>
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section className="text-center py-20 bg-white">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 max-w-6xl mx-auto">
          {[
            { title: "Donate", desc: "Add leftover food", icon: "🍱" },
            { title: "Match", desc: "AI connects to nearest NGO", icon: "🤖" },
            { title: "Pickup", desc: "NGO gets notified", icon: "🚚" },
            { title: "Impact", desc: "Food reaches the hungry", icon: "❤️" },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-50 p-6 rounded-lg shadow-md"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-purple-600">{step.title}</h3>
              <p className="text-gray-600 mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="text-center py-20 bg-[#f0f2f5]">
        <h2 className="text-4xl font-extrabold text-gray-900">Our Impact</h2>
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {[
            { icon: <FaUsers className="text-purple-600 text-4xl mx-auto" />, text: "Active Donors: 350+" },
            { icon: <FaChartLine className="text-purple-600 text-4xl mx-auto" />, text: "Meals Delivered: 12,452+" },
            { icon: <FaHandsHelping className="text-purple-600 text-4xl mx-auto" />, text: "Partner NGOs: 42" },
            { icon: <FaCheckCircle className="text-purple-600 text-4xl mx-auto" />, text: "96% Wasted Meals Saved" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 w-64 bg-white rounded-lg shadow-md"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mt-4">{item.text}</h3>
            </motion.div>
          ))}
        </div>
      </section>

     {/* Testimonials */}
<section className="text-center py-20 bg-white">
  <h2 className="text-4xl font-extrabold text-gray-900 mb-12">What People Say</h2>
  <div className="relative max-w-4xl mx-auto">
    <AnimatePresence mode="wait">
      <motion.div
        key={testimonials[active].name}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-center gap-10"
      >
        <img
          src={testimonials[active].image}
          alt="Testimonial"
          className="w-full md:w-1/2 max-w-md rounded-xl shadow-lg"
        />
        <div className="text-gray-700 italic max-w-md text-left">
          <p>“{testimonials[active].message}”</p>
          <p className="mt-4 font-semibold text-purple-600">— {testimonials[active].name}</p>
        </div>
      </motion.div>
    </AnimatePresence>
    <div className="flex justify-center mt-8 gap-3">
      {testimonials.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setActive(idx)}
          className={`w-3 h-3 rounded-full ${idx === active ? "bg-purple-600" : "bg-gray-300"}`}
        ></button>
      ))}
    </div>
  </div>
</section>

      {/* Recognition & Rewards */}
      <section className="text-center py-20 bg-gray-100">
        <h2 className="text-4xl font-extrabold text-gray-900">Rewards & Recognition</h2>
        <div className="flex justify-center mt-10 gap-10">
          {[1, 2, 3].map((level) => (
            <motion.div
              key={level}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-md p-6 rounded-lg w-60"
            >
              <FaMedal className="text-3xl text-yellow-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-purple-700">Top Donor Level {level}</h3>
              <p className="text-sm mt-2 text-gray-600">Donated {level * 10}+ times</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="text-center py-20 bg-white">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Our Mission</h2>
        <p className="text-lg max-w-3xl mx-auto text-gray-700">
          <strong>Mission:</strong> “Zero Hunger, Zero Waste” <br />
          <strong>Vision:</strong> “To create an ecosystem of generosity through technology.”
        </p>
      </section>
    </div>
  );
}
