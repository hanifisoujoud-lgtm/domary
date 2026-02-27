import React, { useState, useEffect } from "react";

export default function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState(""); // "", "acheter", "louer"

  // Fetch reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Filter reservations when filterType changes
  useEffect(() => {
    if (filterType === "") {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(reservations.filter(res => res.type_reservation === filterType));
    }
  }, [reservations, filterType]);

  // Fetch all reservations from backend
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/reservations");
      
      if (!res.ok) {
        throw new Error(`Erreur serveur: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Réservations récupérées:", data); // Debug
      setReservations(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du fetch des réservations:", err);
      setError(err.message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete reservation function
  const handleDeleteReservation = async (reservationId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      try {
        const res = await fetch(`http://localhost:5000/reservations/${reservationId}`, {
          method: "DELETE"
        });
        
        if (res.ok) {
          alert("Réservation supprimée avec succès");
          fetchReservations(); // Refresh the list
        } else {
          const errorData = await res.json().catch(() => ({}));
          alert("Erreur lors de la suppression: " + (errorData.message || "Erreur serveur"));
        }
      } catch (err) {
        alert("Erreur: " + err.message);
      }
    }
  };

  // Get display name for categories
  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      heavy_equipment: "Équipement Lourd",
      sell_rent_farmland: "Vente/Location Terres",
      fertilizers_manure: "Engrais et Fumier",
      agri_accessories: "Accessoires Agricoles",
      purely_homemade: "Fait Maison"
    };
    return categoryNames[category] || category;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Date invalide";
    }
  };

  return (
    <div className="reservation-page">
      <div className="reservation-header">
        <h1>Gestion des Réservations</h1>
        <div className="reservation-controls">
          <button onClick={fetchReservations} className="refresh-btn">
            🔄 Actualiser
          </button>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            <option value="acheter">Achats seulement</option>
            <option value="louer">Locations seulement</option>
          </select>
        </div>
      </div>

      <div className="reservation-stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p className="stat-number">{reservations.length}</p>
        </div>
        <div className="stat-card">
          <h3>Achats</h3>
          <p className="stat-number stat-buy">
            {reservations.filter(r => r.type_reservation === 'acheter').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Locations</h3>
          <p className="stat-number stat-rent">
            {reservations.filter(r => r.type_reservation === 'louer').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Affichées</h3>
          <p className="stat-number">{filteredReservations.length}</p>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <p>Chargement des réservations...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p>Erreur: {error}</p>
          <button onClick={fetchReservations}>Réessayer</button>
        </div>
      )}

      {!loading && !error && (
        <div className="reservation-content">
          {filteredReservations.length > 0 ? (
            <div className="table-container">
              <table className="reservation-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Téléphone</th>
                    <th>Produit</th>
                    <th>Catégorie</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>#{reservation.id}</td>
                      <td className="client-name">{reservation.client_nom}</td>
                      <td className="phone-number">
                        <a href={`tel:${reservation.client_telephone}`}>
                          {reservation.client_telephone}
                        </a>
                      </td>
                      <td className="product-name">
                        {reservation.product_nom || `Produit ID: ${reservation.product_id}`}
                      </td>
                      <td>
                        <span className="category-badge">
                          {getCategoryDisplayName(reservation.product_category)}
                        </span>
                      </td>
                      <td>
                        <span className={`type-badge ${reservation.type_reservation}`}>
                          {reservation.type_reservation === 'acheter' ? '💰 Achat' : '🏠 Location'}
                        </span>
                      </td>
                      <td className="date-cell">
                        {formatDate(reservation.created_at)}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDeleteReservation(reservation.id)}
                          className="delete-btn"
                          title="Supprimer cette réservation"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-reservations">
              <h3>Aucune réservation trouvée</h3>
              <p>
                {filterType 
                  ? `Aucune réservation de type "${filterType}" n'a été trouvée.`
                  : "Aucune réservation n'a encore été effectuée."
                }
              </p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .reservation-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .reservation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .reservation-header h1 {
          margin: 0;
          color: #333;
        }

        .reservation-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .refresh-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .refresh-btn:hover {
          background: #218838;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .reservation-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
          text-transform: uppercase;
        }

        .stat-number {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .stat-buy {
          color: #007bff;
        }

        .stat-rent {
          color: #ffc107;
        }

        .table-container {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .reservation-table {
          width: 100%;
          border-collapse: collapse;
        }

        .reservation-table th,
        .reservation-table td {
          padding: 12px 8px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .reservation-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
          font-size: 12px;
          text-transform: uppercase;
        }

        .client-name {
          font-weight: 600;
          color: #333;
        }

        .phone-number a {
          color: #007bff;
          text-decoration: none;
        }

        .phone-number a:hover {
          text-decoration: underline;
        }

        .product-name {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .category-badge {
          background: #6c757d;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          white-space: nowrap;
        }

        .type-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .type-badge.acheter {
          background: #e3f2fd;
          color: #1976d2;
        }

        .type-badge.louer {
          background: #fff3e0;
          color: #f57c00;
        }

        .date-cell {
          font-size: 12px;
          color: #666;
          white-space: nowrap;
        }

        .delete-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .delete-btn:hover {
          background: #c82333;
        }

        .loading-container,
        .error-container {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .error-container button {
          margin-top: 10px;
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .no-reservations {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .no-reservations h3 {
          margin: 0 0 15px 0;
          color: #666;
        }

        .no-reservations p {
          color: #999;
          margin: 0;
        }

        @media (max-width: 768px) {
          .reservation-page {
            padding: 10px;
          }
          
          .reservation-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .reservation-controls {
            justify-content: center;
          }
          
          .reservation-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}