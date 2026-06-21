const SavedProperties = () => {

const [properties, setProperties] = useState([]);

useEffect(() => {
  const fetchSaved = async () => {
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
  };

  fetchSaved();
}, []);
  return (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {properties.map((plot) => (
    <Link
      key={plot._id}
      to={`/plot/${plot._id}`}
      className="bg-white rounded-xl shadow border overflow-hidden"
    >
      <img
        src={plot.images?.[0]}
        alt={plot.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold">{plot.title}</h3>
        <p className="text-gray-500">{plot.location}</p>

        <p className="text-green-600 font-bold mt-2">
          ₹ {plot.price?.toLocaleString()}
        </p>
      </div>
    </Link>
  ))}
</div>
  );
};
export default SavedProperties