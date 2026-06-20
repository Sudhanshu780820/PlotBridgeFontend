import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Maximize, Eye, Calendar, 
  CheckCircle, ArrowLeft, Image as ImageIcon, 
  Map as MapIcon, Share2, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Add these to your existing imports
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Vite/React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
const [isStartingChat, setIsStartingChat] = useState(false);
  const navigate = useNavigate();
const handleContactSeller = async () => {
    // Assuming your plot object contains a 'seller' field with the seller's ID
    if (!plot.seller) {
      alert("Seller information is currently unavailable.");
      return;
    }

    setIsStartingChat(true);
    try {
      const token = localStorage.getItem('token');
      
      // Make the request to the API route we planned earlier
      const response = await axios.post('/api/conversations/start', {
        sellerId: plot.seller._id || plot.seller, // Works whether seller is populated or just an ID
        plotId: plot._id
      }, {
        headers: {
          'Authorization': `Bearer ${token}` // Important: Send the token so backend knows who the buyer is
        }
      });

      // Redirect to the chat page using the new conversation ID
      const conversationId = response.data._id;
      navigate(`/chat/${conversationId}`);
      
    } catch (err) {
      console.error("Error starting conversation:", err);
      alert("Could not start chat. Please try again.");
    } finally {
      setIsStartingChat(false);
    }
  };
  // --- NEW CHAT LOGIC END ---

const PlotDetails = () => {
  const { id } = useParams();
  const [plot, setPlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the image gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchPlotDetails = async () => {
      try {
        const response = await fetch(`/api/plots/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch plot details');

        const data = await response.json();
        setPlot(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlotDetails();
  }, [id]);

  // Helper to format currency
  const formatPrice = (price, currency) => {
    const symbol = currency === '₹ Rupees' || currency === 'INR' ? '₹' : currency;
    return `${symbol}${price.toLocaleString('en-IN')}`;
  };

  // Helper to resolve image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80";
    if (imagePath.startsWith('http')) return imagePath;
    return `${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;
  if (!plot) return null;

  // Prepare images array
  const displayImages = plot.images?.length > 0 
    ? plot.images.map(getImageUrl) 
    : ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"]; // Fallback

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex justify-between items-center">
          <Link to="/plots" className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Listings
          </Link>
          <div className="flex gap-3">
            <button className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 shadow-sm transition">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 shadow-sm transition">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Header Area */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                {plot.category}
              </span>
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                plot.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                plot.status === 'Sold' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {plot.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {plot.title}
            </h1>
            <p className="text-slate-500 mt-2 flex items-center text-lg">
              <MapPin className="w-5 h-5 mr-1 text-slate-400" />
              {plot.location}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-4xl font-extrabold text-blue-600">
              {formatPrice(plot.price, plot.currency)}
            </div>
            <p className="text-slate-500 font-medium mt-1">
              ₹{(plot.price / plot.size).toFixed(0).toLocaleString('en-IN')} / {plot.unit}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Side - 2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100 mb-2">
                <img 
                  src={displayImages[activeImageIndex]} 
                  alt={plot.title} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>
              
              {/* Thumbnails */}
              {displayImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 px-1 custom-scrollbar">
                  {displayImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-wrap justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Maximize className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Area</p>
                  <p className="text-lg font-bold text-slate-900">{plot.size} <span className="text-sm font-medium text-slate-500">{plot.unit}</span></p>
                </div>
              </div>
              
              <div className="w-px h-12 bg-slate-200 hidden md:block"></div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Property Type</p>
                  <p className="text-lg font-bold text-slate-900">{plot.category}</p>
                </div>
              </div>

              <div className="w-px h-12 bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Page Views</p>
                  <p className="text-lg font-bold text-slate-900">{plot.views} <span className="text-sm font-medium text-slate-500">views</span></p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-slate-400" /> Description
              </h2>
              <div className="prose max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                {plot.description}
              </div>
            </div>

            {/* Map Placeholder Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapIcon className="w-6 h-6 text-slate-400" /> Location Map
              </h2>
              <p className="text-slate-500 mb-4 text-sm">Coordinates: {plot.lat}, {plot.lng}</p>
              
              {/* Map Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapIcon className="w-6 h-6 text-slate-400" /> Location Map
              </h2>
              <p className="text-slate-500 mb-4 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {plot.location}
              </p>
              
              {/* The Real Interactive Map */}
              <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-200 z-0 relative">
                <MapContainer 
                  center={[plot.lat, plot.lng]} 
                  zoom={15} 
                  scrollWheelZoom={false} 
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[plot.lat, plot.lng]}>
                    <Popup>
                      <div className="text-center">
                        <strong>{plot.title}</strong><br />
                        {plot.category} • {plot.size} {plot.unit}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
            </div>

          </div>

          {/* Sidebar (Right Side - 1/3 width) */}
          <div className="lg:col-span-1">
            {/* Sticky Container */}
            <div className="sticky top-6 space-y-6">
              
              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Interested in this land?</h3>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                  <p className="text-sm text-slate-500 mb-1">Listed By</p>
                  {/* If you populated the seller object in backend, you can show their name here */}
                  <p className="font-semibold text-slate-800">Verified Seller</p> 
                  <p className="text-xs text-slate-400 mt-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Listed on {new Date(plot.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                                 {/* UPDATE THIS BUTTON */}
                   <button 
                     onClick={handleContactSeller}
                     disabled={isStartingChat}
                     className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-200 transition-all mb-3 text-lg flex justify-center items-center ${
                       isStartingChat ? 'opacity-75 cursor-not-allowed' : ''
                     }`}
                        >
                     {isStartingChat ? (
                       <>
                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                         Starting Chat...
                       </>
                     ) : (
                       'Contact Seller'
                     )}
                   </button>                 
                <button className="w-full bg-white hover:bg-slate-50 text-blue-600 border-2 border-blue-100 hover:border-blue-200 font-bold py-3.5 px-4 rounded-xl transition-all">
                  Schedule Site Visit
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  PlotBridge protects your privacy. No spam.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlotDetails;