import { Heart } from "lucide-react";

const handleSave = async (plotId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/saved-properties/${plotId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Property Saved");
  } catch (error) {
    console.error(error);
  }
};