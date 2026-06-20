const QuickActions = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Quick Actions
      </h2>

      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Property
        </button>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          View Listings
        </button>
      </div>
    </div>
  );
};

export default QuickActions;