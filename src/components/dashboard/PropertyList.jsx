const PropertyList = () => {
  const properties = [
    {
      title: "5 Acre Farm Land",
      location: "Bhopal",
      price: "₹25,00,000",
    },
    {
      title: "Residential Plot",
      location: "Indore",
      price: "₹12,00,000",
    },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        My Properties
      </h2>

      {properties.map((property, index) => (
        <div
          key={index}
          className="flex justify-between border-b py-4"
        >
          <div>
            <h3 className="font-semibold">
              {property.title}
            </h3>
            <p>{property.location}</p>
          </div>

          <p className="font-bold">
            {property.price}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;