import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: '',
    profilePhotoPath: '', 
    identityCardPath: '', 
  });

  // Load user data from local storage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        userType: user.userType || '',
        profilePhotoPath: user.profilePhoto || '',
        identityCardPath: user.identityCard || '', 
      });
    }
  }, []);

  // Helper to extract initials safely for the avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-4 bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section with Edit Button */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Overview</h1>
              <p className="text-sm text-slate-500 mt-1">View your PlotBridge identity and verification details.</p>
            </div>
            
            {/* The Edit Profile Button */}
            <button 
              onClick={() => alert("Navigate to Edit Profile page!") /* Replace with navigate('/edit-profile') */}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-blue-700 bg-blue-100/80 hover:bg-blue-200/80 transition-colors shadow-sm w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: Profile Visual Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center text-center">
              <div className="relative group">
                
                {/* Profile Avatar Frame */}
                <div className="w-32 h-32 rounded-full ring-4 ring-blue-50 bg-slate-100 overflow-hidden mb-4 flex items-center justify-center border border-slate-200">
                  {formData.profilePhotoPath ? (
                    <img 
                      src={formData.profilePhotoPath} // FIXED: Using Cloudinary URL directly
                      className="w-full h-full object-cover" 
                      alt="Profile" 
                    />
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">
                      {getInitials(formData.fullName)}
                    </span>
                  )}
                </div>

                <span className="absolute bottom-4 right-1 bg-emerald-500 text-white p-1.5 rounded-full text-xs shadow-md border-2 border-white" title="Identity Verified">
                  ✓
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-800">{formData.fullName || 'Your Name'}</h2>
              <p className="text-sm text-slate-400 font-medium mb-3">{formData.email}</p>
              
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                🛡️ Verified {formData.userType || 'User'}
              </span>

              <div className="w-full border-t border-slate-100 mt-6 pt-6 text-left space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Account Status</span>
                  <span className="text-emerald-600 font-bold uppercase tracking-wider">Active KYC</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Trust Score</span>
                  <span className="text-slate-700 font-bold">9.8 / 10</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Read-Only Personal Details */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Personal Details</h3>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Row 1: Full Name & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50/50 cursor-default focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50/50 cursor-default focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row 2: Phone Number & User Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50/50 cursor-default focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">User Type</label>
                    <input
                      type="text"
                      value={formData.userType}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50/50 cursor-default focus:outline-none"
                    />
                  </div>
                </div>

                {/* Verification Document Read-Only View */}
                <div className="pt-6 border-t border-slate-100">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">Identity Document</label>
                  
                  {formData.identityCardPath ? (
                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          {formData.identityCardPath.toLowerCase().endsWith('.pdf') ? (
                            <span className="text-xl">📄</span>
                          ) : (
                            <img src={formData.identityCardPath} alt="Document thumbnail" className="w-full h-full object-cover opacity-80" /> // FIXED: Using Cloudinary URL directly
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Verification ID</p>
                          <p className="text-xs text-emerald-600 font-medium">Verified ✓</p>
                        </div>
                      </div>
                      
                      <a 
                        href={formData.identityCardPath} // FIXED: Using Cloudinary URL directly
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-blue-600 hover:bg-slate-50 transition-colors"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100 inline-block">
                      No document uploaded.
                    </p>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}