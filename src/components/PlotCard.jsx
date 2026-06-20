// 1. FIXED: Correct Link import for navigation
import { Link } from 'react-router-dom';
import React from 'react';

export default function PlotCard({ plot }) {
  // Smart Image Resolver
  let displayImage = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80";
  
 
  
  if (plot.images && plot.images.length > 0) {
    // 1. If it has the new Cloudinary array format, use the first image directly!
    displayImage = plot.images[0];
  } else if (plot.image) {
    // 2. If it's an older test plot using a single image string, use that directly!
    displayImage = plot.image; 
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-2xl hover:scale-110 hover:z-10 transform origin-center transition-all duration-300 flex flex-col cursor-pointer">
      
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img 
          src={displayImage} 
          alt={plot.title} 
          className="w-full h-full object-cover transition-transform duration-500" 
        />
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-slate-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide shadow-sm">
          {plot.category}
        </span>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-800 leading-snug group-hover:text-blue-600 transition-colors truncate">
            {plot.title}
          </h3>
          <p className="text-slate-500 text-xs mb-2 mt-1 flex items-center gap-1 truncate">
            📍 {plot.location}
          </p>
          
          <div className="flex gap-2 mb-3 border-t border-slate-100 pt-2">
            <div className="text-[10px] flex-1">
              <span className="block text-slate-400 font-medium">Area</span>
              <span className="font-semibold text-slate-700">{plot.size} {plot.unit}</span>
            </div>
            <div className="text-[10px]">
              <span className="block text-slate-400 font-medium">Status</span>
              <span className="font-semibold text-emerald-600">Verified ✓</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-auto">
          <div>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Price</span>
            <span className="text-sm font-extrabold text-slate-900">
              {plot.currency === '₹ Rupees' ? '₹' : (plot.currency || '₹')}
              {plot.price ? plot.price.toLocaleString('en-IN') : '0'}
            </span>
          </div>
         
          {/* 2 & 3. FIXED: Removed button wrapper, styled Link directly, used _id */}
          <Link 
            to={`/plots/${plot._id}`} 
            className="inline-block bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-medium py-1.5 px-3 rounded-lg text-[10px] transition-all"
          >
            Details
          </Link>
        
        </div>
      </div>
    </div>
  );
}