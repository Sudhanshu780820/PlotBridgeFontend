import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FeaturedPlots() { // Removed the unused 'plot' parameter here
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        // FIXED: Use the dynamic Vite environment variable for Vercel deployment
       const response = await fetch('/api/plots');
        const result = await response.json();
        
        if (result.success) {
          setPlots(result.data.slice(0, 3)); 
        }
      } catch (error) {
        console.error("Error fetching plots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Featured Land Listings</h2>
          <p className="text-slate-500 mt-1">Explore premium verified plots available for purchase</p>
        </div>
        <Link to="/plots" className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
          View All Plots &rarr;
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading premium plots...</div>
      ) : plots.length === 0 ? (
        <div className="text-center py-10 text-slate-500">No plots available yet. Be the first to list one!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {plots.map((plot) => (
            <div key={plot._id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img 
                  // FIXED: Removed the extra curly braces around plot.images[0]
                  src={plot.images && plot.images.length > 0 
                        ? plot.images[0] 
                        : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"} 
                  alt={plot.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-800 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wide shadow-sm">
                  {plot.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                    {plot.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 mt-1 flex items-center gap-1 truncate">
                    📍 {plot.location}
                  </p>
                  <div className="flex gap-4 mb-6 border-t border-slate-100 pt-4">
                    <div className="text-xs">
                      <span className="block text-slate-400 font-medium">Area Size</span>
                      <span className="font-semibold text-slate-700">{plot.size} {plot.unit}</span>
                    </div>
                    <div className="text-xs">
                      <span className="block text-slate-400 font-medium">Status</span>
                      <span className="font-semibold text-emerald-600">Verified ✓</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {plot.currency === '₹ Rupees' ? '₹' : '$'}{plot.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  {/* FIXED: Moved button classes directly onto the Link component */}
                  <Link 
                    to={`/plots/${plot._id}`} 
                    className="bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-medium py-2 px-4 rounded-xl text-sm transition-all"
                  >
                    View Details
                  </Link>
                  
                </div>
              </div>
            </div>
          ))}

        </div>
      )}
    </section>
  );
}