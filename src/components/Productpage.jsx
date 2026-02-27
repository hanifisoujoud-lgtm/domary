import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reservationType, setReservationType] = useState('');
  const [formData, setFormData] = useState({
    client_nom: '',
    client_telephone: ''
  });

  console.log(products)

  // Mapping frontend → backend keys
  const categoryMap = {
    heavy: "heavy_equipment",
    farmland: "sell_rent_farmland",
    manure: "fertilizers_manure",
    accessories: "agri_accessories",
    homemade: "purely_homemade",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!categoryMap[category]) {
          throw new Error(`Catégorie "${category}" invalide. Utilisez: ${Object.keys(categoryMap).join(", ")}`);
        }

        const url = `http://localhost:5000/products/category/${category}`;
        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Erreur serveur: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    } else {
      setError("Aucune catégorie spécifiée dans l'URL");
      setLoading(false);
    }
  }, [category]);

  const getCategoryDisplayName = (catKey) => {
    const displayNames = {
      heavy_equipment: "Équipement Lourd",
      sell_rent_farmland: "Vente/Location Terres Agricoles",
      fertilizers_manure: "Engrais et Fumier",
      agri_accessories: "Accessoires Agricoles",
      purely_homemade: "Purement Fait Maison",
    };
    return displayNames[catKey] || catKey;
  };

  const handleReservation = (product, type) => {
    setSelectedProduct(product);
    setReservationType(type);
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    
    try {
      const reservationData = {
        product_id: selectedProduct.id,
        client_nom: formData.client_nom,
        client_telephone: formData.client_telephone,
        type_reservation: reservationType
      };

      const res = await fetch("http://localhost:5000/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur serveur: ${res.status}`);
      }

      const data = await res.json();
      alert(`Réservation ${reservationType} créée avec succès pour ${selectedProduct.nom}!`);
      
      // Reset form and close modal
      setFormData({ client_nom: '', client_telephone: '' });
      setShowModal(false);
      setSelectedProduct(null);
      setReservationType('');
      
    } catch (err) {
      alert("Erreur lors de la réservation: " + err.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setReservationType('');
    setFormData({ client_nom: '', client_telephone: '' });
  };

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <div className="error">{error}</div>;
  if (products.length === 0) return <p>Aucun produit trouvé pour cette catégorie.</p>;

  return (
    <div className="product-page">
      <h1>Produits - {getCategoryDisplayName(categoryMap[category])}</h1>
      <div className="card-product-container">
        {products.map((p) => (
          <div key={p.id} className="cardd">
            <img
              src={p.photo}
              alt={p.nom}
              className="card-image"
              onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
            />
            <div className="card-content">
              <h2>{p.nom}</h2>
              <p>{p.description}</p>
              <span>{getCategoryDisplayName(p.category)}</span>
              {p.created_at && <span>Ajouté le {new Date(p.created_at).toLocaleDateString('fr-FR')}</span>}
              <div className="card-buttons">
                <button onClick={() => handleReservation(p, 'acheter')} className="btn-buy">
                  Acheter
                </button>
                {p.category === "heavy_equipment" || p.category === "sell_rent_farmland" && 
                   <button onClick={() => handleReservation(p, 'louer')} className="btn-rent">
                  Louer
                </button>
                }
             
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Réservation */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Réservation - {reservationType.toUpperCase()}</h3>
              <span onClick={closeModal} className="close-btn">&times;</span>
            </div>
            
            <div className="modal-body">
              <div className="product-info">
                <h4>{selectedProduct?.nom}</h4>
                <p>Type: {reservationType}</p>
              </div>
              
              <form onSubmit={handleSubmitReservation} className="reservation-form">
                <div className="form-group">
                  <label htmlFor="client_nom">Nom complet *</label>
                  <input
                    type="text"
                    id="client_nom"
                    name="client_nom"
                    value={formData.client_nom}
                    onChange={handleFormChange}
                    placeholder="Votre nom complet"
                    required
                    minLength="2"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="client_telephone">Téléphone *</label>
                  <input
                    type="tel"
                    id="client_telephone"
                    name="client_telephone"
                    value={formData.client_telephone}
                    onChange={handleFormChange}
                    placeholder="Votre numéro de téléphone"
                    required
                    minLength="8"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={closeModal} className="btn-cancel">
                    Annuler
                  </button>
                  <button type="submit" className="btn-confirm">
                    Confirmer {reservationType}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}