const PropertyCard = ({ property }) => {
  return (
    <div className="card">
      <img
        src={property.image}
        alt={property.title}
      />

      <h3>{property.title}</h3>

      <p>{property.location}</p>

      <p>{property.area}</p>

      <h4>{property.price}</h4>

      <button>View Details</button>
    </div>
  );
};

export default PropertyCard;