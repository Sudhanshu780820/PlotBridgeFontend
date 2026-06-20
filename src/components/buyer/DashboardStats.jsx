import React, { useState, useEffect } from 'react';

export default function SellerDashboardStats() {
  // 1. Set up state to hold the numbers
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    soldProperties: 0,
    totalViews: 0
  });
  
  const [loading, setLoading] = useState(true);

  // 2. Fetch the data when the component mounts
  useEffect(() => {
    const fetchDashboardStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // Handle not logged in

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stats`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` // Provide the token to unlock the route
          }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // 3. Update the state with the live database numbers
          setStats(result.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []); // Empty dependency array means this runs once on load

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      
      {/* 4. Plug the state variables into your UI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Listings Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Listings</p>
          <h3 className="text-3xl font-black text-slate-800">
            {loading ? '...' : stats.totalListings}
          </h3>
        </div>

        {/* Active Listings Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Active Listings</p>
          <h3 className="text-3xl font-black text-slate-800">
            {loading ? '...' : stats.activeListings}
          </h3>
        </div>

        {/* Sold Properties Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Sold Properties</p>
          <h3 className="text-3xl font-black text-slate-800">
            {loading ? '...' : stats.soldProperties}
          </h3>
        </div>

        {/* Total Views Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Views</p>
          <h3 className="text-3xl font-black text-slate-800">
            {loading ? '...' : stats.totalViews}
          </h3>
        </div>

      </div>
    </div>
  );
}