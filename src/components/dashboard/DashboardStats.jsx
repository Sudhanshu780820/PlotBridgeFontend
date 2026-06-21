import React, { useState, useEffect } from "react";

const DashboardStats = () => {
  // 1. Initialize state with default values (0)
  const [statsData, setStatsData] = useState({
    totalListings: 0,
    activeListings: 0,
    soldProperties: 0,
    totalViews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch real data when the component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch from your backend dashboard route
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Send token to identify the user
          }
        });

        const result = await response.json();
        console.log("Dashboard API Response:", result);

        if (response.ok) {
          // Update state with real data from backend
          setStatsData({
            totalListings: result.totalListings || 0,
            activeListings: result.activeListings || 0,
            soldProperties: result.soldProperties || 0,
            totalViews: result.totalViews || 0,
          });
          console.log("Setting state:", {
  totalListings: result.totalListings,
  activeListings: result.activeListings,
  soldProperties: result.soldProperties,
  totalViews: result.totalViews,
});
        } else {
          console.error("Failed to fetch stats:", result.message);
        }
      } catch (error) {
        console.error("Error connecting to server:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []); // Empty array ensures this only runs once when the page loads

  // 3. Format the state into your array structure for rendering
  const stats = [
    { title: "Total Listings", value: statsData.totalListings },
    { title: "Active Listings", value: statsData.activeListings },
    { title: "Sold Properties", value: statsData.soldProperties },
    { title: "Total Views", value: statsData.totalViews },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white p-5 rounded-xl shadow border border-slate-100"
        >
          <h3 className="text-gray-500 font-medium">{item.title}</h3>
          <p className="text-2xl font-bold mt-2 text-slate-800">
            {isLoading ? (
              <span className="text-slate-300 animate-pulse">...</span> // Simple loading effect
            ) : (
              item.value
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;