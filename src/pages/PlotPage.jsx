import React, { useState, useEffect } from 'react';
import PlotCard from '../components/PlotCard';
import Navbar from '../components/Navbar';

export default function PlotsPage() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 1. Fetch real data from your backend



  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plots`);
        const result = await response.json();
        
        if (result.success) {
          setPlots(result.data); // Store the database plots in state
        }
      } catch (error) {
        console.error("Error fetching plots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, []);

  // 2. Filter the live plots based on the selected category
  const filteredPlots = selectedCategory === 'All' 
    ? plots 
    : plots.filter(plot => plot.category === selectedCategory);

  return (
    <>
      <Navbar/>
      <div className="min-h-screen mt-3 bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        {/* Expanded max-width to allow 6 cards to fit comfortably */}
        <div className="max-w-[1400px] mx-auto">
          
          {/* Page Heading and Context */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-200">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Verified Marketplace</h1>
              <p className="text-sm text-slate-500 mt-1">Browse verified structural land layouts with confirmed digital map positioning tags.</p>
            </div>

            {/* Interactive filter */}
            <div className="flex flex-wrap gap-2 items-center bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
              {['All', 'Residential', 'Commercial', 'Agricultural'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Card Display Grid with Loading State */}
          {loading ? (
            <div className="text-center py-20 text-slate-500 font-medium">
              Loading available properties...
            </div>
          ) : filteredPlots.length > 0 ? (
            /* Changed to xl:grid-cols-6 with gap-4. 
              Added py-4 px-2 so the zooming hover effect on cards doesn't get clipped.
            */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 py-4 px-2">
              {filteredPlots.map((plot) => (
                // Use MongoDB's built-in _id as the unique key
                <PlotCard key={plot._id} plot={plot} /> 
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl max-w-md mx-auto">
              <span className="text-3xl">🏜️</span>
              <h3 className="font-bold text-slate-800 mt-3">No property listings found</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">No listings currently match your category filter requirements.</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}