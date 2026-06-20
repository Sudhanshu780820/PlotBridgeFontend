import React from 'react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-blue-50/50 via-white to-transparent pt-20 pb-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main Headline */}
        <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          Find and Secure Your Perfect <span className="text-blue-600">Land Plot</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          The ultimate marketplace bridging land buyers and verified plot owners. Simple, transparent, and completely secure.
        </p>

        {/* Search Bar Widget Component */}
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Location Input */}
            <div className="flex flex-col items-start px-3 py-1 border-b sm:border-b-0 sm:border-r border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</span>
              <input type="text" placeholder="Where are you looking?" className="w-full bg-transparent border-none p-0 pt-1 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm focus:outline-none" />
            </div>
            {/* Type Dropdown */}
            <div className="flex flex-col items-start px-3 py-1 border-b sm:border-b-0 sm:border-r border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Plot Type</span>
              <select className="w-full bg-transparent border-none p-0 pt-1 text-slate-800 focus:ring-0 text-sm focus:outline-none cursor-pointer">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Agricultural</option>
              </select>
            </div>
            {/* Budget Input */}
            <div className="flex flex-col items-start px-3 py-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Budget</span>
              <input type="text" placeholder="Enter budget amount" className="w-full bg-transparent border-none p-0 pt-1 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm focus:outline-none" />
            </div>
          </div>
          {/* Submit Button */}
          <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-md shrink-0">
            Search Properties
          </button>
        </div>
      </div>
    </section>
  );
}