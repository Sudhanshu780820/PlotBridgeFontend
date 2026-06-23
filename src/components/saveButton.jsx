import { Heart } from "lucide-react";

const handleSave = async (plotId) => {
  try {
    if (savedProperties.includes(plotId)) {
      await axios.delete(
        `${API_BASE_URL}/api/saved-properties/${plotId}`
      );

      setSavedProperties((prev) =>
        prev.filter((id) => id !== plotId)
      );
    } else {
      await axios.post(
        `${API_BASE_URL}/api/saved-properties/${plotId}`
      );

      setSavedProperties((prev) => [...prev, plotId]);
    }
  } catch (err) {
    console.error(err);
  }
};