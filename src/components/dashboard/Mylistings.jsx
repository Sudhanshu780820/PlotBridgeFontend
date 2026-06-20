import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Added for Edit button routing
import { Trash2, Edit } from 'lucide-react'; // Added professional icons
import PlotCard from '../PlotCard';

export default function MyListings() {
  const [myPlots, setMyPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("You must be logged in to view your listings.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/my-listings`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setMyPlots(result.data);
        } else {
          setError(result.message || "Failed to load listings");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  // 1. ADDED: Delete Handler Function
  const handleDelete = async (plotId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this property? This action cannot be undone.");
    
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plots/${plotId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        // Remove the deleted plot from the UI immediately without refreshing
        setMyPlots((prevPlots) => prevPlots.filter((plot) => plot._id !== plotId));
        alert("Property deleted successfully!");
      } else {
        alert(result.message || "Failed to delete the property.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while trying to delete the property.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 mt-16 font-sans">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-200">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">My Listings</h1>
              <p className="text-sm text-slate-500 mt-1">Manage and track the properties you have published to the marketplace.</p>
            </div>
            
            <a 
              href="/seller-dashboard/add-property" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors"
            >
              + Add New Property
            </a>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center mb-8">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20 text-slate-500 font-medium flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              Loading your properties...
            </div>
          ) : myPlots.length > 0 ? (
            
            /* Grid Layout for the Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4 px-2">
              {myPlots.map((plot) => (
                <div key={plot._id} className="relative group">
                  <PlotCard plot={plot} />
                  
                  {/* 2. UPDATED: Interactive Overlay Buttons */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    
                    {/* Edit Button (Routes to your edit page) */}
                    <Link 
                      to={`/seller-dashboard/edit-property/${plot._id}`}
                      className="bg-white/90 backdrop-blur text-slate-700 p-2 rounded-lg shadow hover:text-blue-600 transition-colors"
                      title="Edit Property"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    {/* Delete Button (Triggers the handleDelete function) */}
                    <button 
                      onClick={() => handleDelete(plot._id)}
                      className="bg-white/90 backdrop-blur text-red-600 p-2 rounded-lg shadow hover:bg-red-50 hover:text-red-700 transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-24 bg-white border border-dashed border-slate-300 rounded-2xl max-w-2xl mx-auto shadow-sm">
              <span className="text-5xl block mb-4">🏡</span>
              <h3 className="text-xl font-bold text-slate-800">No properties listed yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 mb-6">
                You haven't added any properties to the marketplace. Publish your first plot to start receiving inquiries.
              </p>
              <a 
                href="/seller-dashboard/add-property" 
                className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-colors"
              >
                Create First Listing
              </a>
            </div>
          )}

        </div>
      </div>
    </>
  );
}