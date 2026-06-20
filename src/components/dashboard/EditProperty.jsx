import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. State for Form Data
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    currency: "USD",
    category: "",
    size: "",
    unit: "sq ft",
    location: "",
    description: "",
  });

  // State for Images
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState(null);

  // State for UI Feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 2. Fetch Existing Plot Data on Load
  useEffect(() => {
    const fetchPlotDetails = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plots/${id}`);
        const result = await response.json();

        if (response.ok) {
          // Pre-fill the form with existing data
          setFormData({
            title: result.title || "",
            price: result.price || "",
            currency: result.currency || "USD",
            category: result.category || "",
            size: result.size || "",
            unit: result.unit || "sq ft",
            location: result.location || "",
            description: result.description || "",
          });
          setExistingImages(result.images || []);
        } else {
          setError("Failed to load property details.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Server error while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlotDetails();
  }, [id]);

  // 3. Handlers for Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewImages(e.target.files);
  };

  // 4. Submit the Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      setSaving(false);
      return;
    }

    // Build FormData to handle both text and files
    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });

    // Append new images if the user selected any
    if (newImages && newImages.length > 0) {
      Array.from(newImages).forEach((file) => {
        dataToSend.append("images", file); // 'images' matches upload.array('images', 5) on backend
      });
    }

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plots/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: Do NOT set 'Content-Type': 'application/json' when using FormData
        },
        body: dataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Property updated successfully!");
        navigate("/seller-dashboard/my-listings"); // Send them back to the listings page
      } else {
        setError(result.message || "Failed to update property.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred while updating.");
    } finally {
      setSaving(false);
    }
  };

  // 5. UI Rendering
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 py-2 mt-6 font-sans w-full">
      <div className="max-w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-6">
          Edit Property
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Current Images
              </label>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {existingImages.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${img}`}
                    alt={`Property ${index}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Uploading new images will replace these existing ones.
              </p>
            </div>
          )}

          {/* New Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Upload New Images (Max 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Text Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-lg p-2.5"
              >
                <option value="">Select Category</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Agricultural">Agricultural</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Price
              </label>
              <div className="flex">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="border border-slate-300 rounded-l-lg p-2.5 bg-slate-50"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                </select>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full border-t border-b border-r border-slate-300 rounded-r-lg p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Size
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-slate-300 rounded-l-lg p-2.5"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="border-t border-b border-r border-slate-300 rounded-r-lg p-2.5 bg-slate-50"
                >
                  <option value="sq ft">sq ft</option>
                  <option value="acres">acres</option>
                  <option value="hectares">hectares</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full border border-slate-300 rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full border border-slate-300 rounded-lg p-2.5"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/seller-dashboard/my-listings")}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
