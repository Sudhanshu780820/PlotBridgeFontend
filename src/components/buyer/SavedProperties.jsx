import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/saved-properties`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProperties(res.data);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading saved properties...
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow border p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-700">
          No Saved Properties
        </h2>
        <p className="text-slate-500 mt-2">
          Save properties by clicking the ❤️ icon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Saved Properties
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((plot) => (
          <Link
            key={plot._id}
            to={`/plots/${plot._id}`}
            className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={
                plot.images?.[0] ||
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"
              }
              alt={plot.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold text-lg">
                {plot.title}
              </h3>

              <p className="text-gray-500 mt-1">
                📍 {plot.location}
              </p>

              <p className="text-green-600 font-bold mt-3">
                ₹ {plot.price?.toLocaleString("en-IN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SavedProperties;