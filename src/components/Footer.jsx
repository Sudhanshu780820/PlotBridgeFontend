
import React from "react";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">

        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl font-bold">
            Plot<span className="text-blue-500">Bridge</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Connecting buyers and sellers of land across India.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-6 md:mt-0">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-gray-400">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Buy Land</a></li>
            <li><a href="#" className="hover:text-white">Sell Land</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="mt-6 md:mt-0">
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-gray-400">Email: support@plotbridge.com</p>
          <p className="text-gray-400">Phone: +91 98765 43210</p>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
        © 2026 PlotBridge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;