import React, { useState } from "react";

export default function AddUserProduct() {
  const [formData, setFormData] = useState({
    nom: "",
    photo: "",
    description: "",
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear previous messages when user starts typing
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setMessageType("");
    
    console.log("=== USER PRODUCT SUBMISSION ===");
    console.log("FormData envoyé:", formData);
    
    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      console.log("Status de la réponse:", res.status);
      
      const responseText = await res.text();
      console.log("Réponse complète:", responseText);
      
      if (!res.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || "Erreur serveur";
        } catch {
          errorMessage = responseText || "Erreur serveur";
        }
        throw new Error(errorMessage);
      }
      
      // Si succès
      const data = JSON.parse(responseText);
      console.log("Succès:", data);
      
      setMessage("Votre produit a été ajouté avec succès ! Il sera visible dans la catégorie correspondante.");
      setMessageType("success");
      
      // Reset form
      setFormData({
        nom: "",
        photo: "",
        description: "",
        category: "",
      });
      
    } catch (err) {
      console.error("Erreur complète:", err);
      setMessage("Erreur lors de l'ajout : " + err.message);
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nom: "",
      photo: "",
      description: "",
      category: "",
    });
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="add-user-product-container">
      <div className="form-header">
        <h2>Ajouter un Produit</h2>
        <p className="form-subtitle">
          Partagez vos produits agricoles avec notre communauté
        </p>
      </div>

      {/* Message de feedback */}
      {message && (
        <div className={`message ${messageType}`}>
          <div className="message-content">
            {messageType === "success" ? "✅ " : "❌ "}
            {message}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="user-product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nom">
              Nom du produit *
              <span className="label-hint">Ex: Tracteur John Deere, Terrain 5ha</span>
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Entrez le nom de votre produit..."
              required
              minLength="3"
              maxLength="100"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="photo">
              Lien de la photo *
              <span className="label-hint">URL de l'image de votre produit</span>
            </label>
            <input
              type="url"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://exemple.com/image.jpg"
              required
            />
            {formData.photo && (
              <div className="image-preview">
                <img 
                  src={formData.photo} 
                  alt="Aperçu"
                  onError={(e) => { 
                    e.target.style.display = 'none';
                  }}
                  onLoad={(e) => { 
                    e.target.style.display = 'block';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">
              Catégorie *
              <span className="label-hint">Choisissez la catégorie appropriée</span>
            </label>
            <select 
              id="category"
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
            >
              <option value="">-- Sélectionnez une catégorie --</option>
              <option value="heavy_equipment">🚜 Équipement Lourd</option>
              <option value="sell_rent_farmland">🏞️ Vente/Location de Terres</option>
              <option value="fertilizers_manure">🌱 Engrais et Fumier</option>
              <option value="agri_accessories">🔧 Accessoires Agricoles</option>
              <option value="purely_homemade">🏠 Produits Faits Maison</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="description">
              Description *
              <span className="label-hint">Décrivez votre produit en détail (min. 20 caractères)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre produit : état, caractéristiques, prix, conditions de vente/location..."
              rows={6}
              required
              minLength="20"
              maxLength="1000"
            />
            <div className="char-counter">
              {formData.description.length}/1000 caractères
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleReset}
            className="btn-reset"
            disabled={isSubmitting}
          >
            Effacer
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Ajout en cours...
              </>
            ) : (
              "Ajouter le Produit"
            )}
          </button>
        </div>
      </form>

      <div className="form-info">
        <h3>Informations importantes</h3>
        <ul>
          <li>Tous les champs marqués d'un (*) sont obligatoires</li>
          <li>Votre produit sera visible par tous les visiteurs du site</li>
          <li>Assurez-vous que vos informations de contact sont correctes</li>
          <li>L'image doit être accessible via une URL publique</li>
        </ul>
      </div>

      <style jsx>{`
        .add-user-product-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .form-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 30px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .form-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .form-subtitle {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .message {
          margin-bottom: 20px;
          padding: 15px;
          border-radius: 8px;
          font-weight: 500;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .user-product-form {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .form-row {
          margin-bottom: 25px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .label-hint {
          font-weight: 400;
          font-size: 12px;
          color: #666;
          font-style: italic;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }

        .form-group input:invalid,
        .form-group select:invalid,
        .form-group textarea:invalid {
          border-color: #dc3545;
        }

        .image-preview {
          margin-top: 10px;
          max-width: 200px;
        }

        .image-preview img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
          border: 2px solid #e9ecef;
        }

        .char-counter {
          font-size: 12px;
          color: #666;
          text-align: right;
          margin-top: 5px;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .btn-reset,
        .btn-submit {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-reset {
          background: #6c757d;
          color: white;
          flex: 0 0 auto;
        }

        .btn-reset:hover:not(:disabled) {
          background: #5a6268;
        }

        .btn-submit {
          background: #007bff;
          color: white;
          flex: 1;
        }

        .btn-submit:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-submit:disabled,
        .btn-reset:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .form-info {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .form-info h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 18px;
        }

        .form-info ul {
          margin: 0;
          padding-left: 20px;
        }

        .form-info li {
          margin-bottom: 8px;
          color: #666;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .add-user-product-container {
            padding: 10px;
          }

          .form-header,
          .user-product-form,
          .form-info {
            padding: 20px;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-reset {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}