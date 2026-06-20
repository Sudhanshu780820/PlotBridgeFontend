import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet marker icon asset paths in React environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const AddPlot = () => {
  // 1. Centralized Form State Management
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    currency: "₹ Rupees",
    category: "Residential",
    size: "",
    unit: "Sq. Ft.",
    location: "",
    description: "",
    lat: 20.5937, // Default center map to India coordinates
    lng: 78.9629,
  });

  const [fileName, setFileName] = useState("");
const [selectedFiles, setSelectedFiles] = useState([]); // <-- Add this new state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Map Event Handler Sub-Component
  // Captures clicks on the open street map grid to register coordinates
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          lat: e.latlng.lat.toFixed(6),
          lng: e.latlng.lng.toFixed(6),
        }));
      },
    });
    return null;
  }

const handleFileChange = (e) => {
  if (e.target.files.length > 0) {
    setFileName(`${e.target.files.length} photo(s) selected`);
    setSelectedFiles(e.target.files); // <-- Store the files in state
  }
};
const uploadToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "plotbridge_upload");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/di8kzu2yp/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return data.secure_url;
};

const handlePublish = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      return;
    }

    // Upload images directly to Cloudinary
    const imageUrls = [];

    for (const file of selectedFiles) {
      const url = await uploadToCloudinary(file);
      imageUrls.push(url);
    }

    // Send ONLY URLs to backend
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        images: imageUrls,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Property listed successfully");
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error(error);
    alert("Failed to publish property");
  }
};
  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed pt-24 pb-12 px-4 sm:px-6 flex justify-center items-center"
        style={{
          backgroundImage: "url('https://plus.unsplash.com/premium_photo-1663948061472-d21b04fc67db?q=80&w=1200&auto=format&fit=crop')",
        }}
      >
        {/* Elegant Glassmorphic Card Container over Unsplash Background */}
        <div className="bg-white/95 backdrop-blur-md text-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-200/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Add Property Listing
            </h1>
            <p className="text-sm text-slate-500 mt-1">Fill out the variables below to place your land plot on our secure digital bridge marketplace.</p>
          </div>

          <form onSubmit={handlePublish} className="space-y-6">
            {/* Property Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Property Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. 5 Acre Organic Farm"
                className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-slate-800 bg-white"
                required
              />
            </div>

            {/* Price & Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Asking Price
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50 transition-all bg-white">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    className="w-full p-3 outline-none text-slate-800 bg-transparent"
                    required
                  />
                  <select 
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-l border-slate-200 px-4 text-sm font-medium text-slate-600 outline-none cursor-pointer"
                  >
                    <option>₹ Rupees</option>
                    <option>$ Dollar</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Land Category
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none text-slate-800 bg-white cursor-pointer focus:border-blue-500"
                >
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Agricultural</option>
                  <option>Industrial</option>
                </select>
              </div>
            </div>

            {/* Area & Location */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Land Size (Area)
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50 transition-all bg-white">
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="e.g. 2400"
                    className="w-full p-3 outline-none text-slate-800 bg-transparent"
                    required
                  />
                  <select 
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-l border-slate-200 px-4 text-sm font-medium text-slate-600 outline-none cursor-pointer"
                  >
                    <option>Sq. Ft.</option>
                    <option>Sq. Meter</option>
                    <option>Acre</option>
                    <option>Hectare</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Exact Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Area, or Landmark"
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-slate-800 bg-white"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Detailed Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe the soil profile, water tables, internal road access dimensions, etc."
                className="w-full border border-slate-200 rounded-xl p-3 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-slate-800 bg-white"
                required
              ></textarea>
            </div>

            {/* Stylized Dropzone Property Photo Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Property Photos
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group">
                <div className="text-center px-4">
                  <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">📸</span>
                  <p className="text-xs font-semibold text-slate-600">
                    {fileName ? fileName : "Upload Plot Pictures"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Select high-quality horizon layout shots (Max 5MB)</p>
                </div>
                <input type="file" multiple className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            {/* Fully Functional Free Interactive Map Section */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pin Exact Location
                </label>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  📍 Lat: {formData.lat} , Lng: {formData.lng}
                </span>
              </div>
              
              {/* Map Rendering Container wrapper */}
              <div className="h-72 border border-slate-200 rounded-2xl overflow-hidden shadow-inner relative z-10 bg-slate-100">
                <MapContainer 
                  center={[formData.lat, formData.lng]} 
                  zoom={5} 
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[formData.lat, formData.lng]} />
                  <MapClickHandler />
                </MapContainer>
              </div>
              <p className="text-[10px] text-slate-400">Click anywhere on the open-source street map interface to re-position your marketplace land coordinates pin.</p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] pt-3 mt-4"
            >
              Publish Listing
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPlot;