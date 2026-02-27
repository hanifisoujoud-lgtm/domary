import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nom: "",
    photo: "",
    description: "",
    category: "",
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/products");
      
      if (!res.ok) {
        throw new Error(`Erreur serveur: ${res.status}`);
      }
      
      const data = await res.json();
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du fetch des produits:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const responseText = await res.text();
      
      if (!res.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || "Erreur serveur";
        } catch {
          errorMessage = responseText || "Erreur serveur";
        }
        throw new Error(`${res.status}: ${errorMessage}`);
      }
      
      alert("Produit ajouté avec succès !");
      setIsOpen(false);
      setFormData({
        nom: "",
        photo: "",
        description: "",
        category: "",
      });
      
      // Refresh products list after adding
      fetchProducts();
      
    } catch (err) {
      console.error("Erreur complète:", err);
      alert("Échec : " + err.message);
    }
  };

  // Function to get display name for categories
  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      heavy_equipment: "Heavy Equipment",
      sell_rent_farmland: "Sell & Rent Farmland", 
      fertilizers_manure: "Fertilizers & Manure",
      agri_accessories: "Agricultural Accessories",
      purely_homemade: "Purely Homemade"
    };
    return categoryNames[category] || category;
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  // Delete product function (optional)
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const res = await fetch(`http://localhost:5000/products/${productId}`, {
          method: "DELETE"
        });
        
        if (res.ok) {
          alert("Produit supprimé avec succès");
          fetchProducts(); // Refresh the list
        } else {
          alert("Erreur lors de la suppression");
        }
      } catch (err) {
        alert("Erreur: " + err.message);
      }
    }
  };

  return (
    <div className="admin-page">
      <header className="navbar">
        <div className="logo">AgriAdmin</div>
        <nav>
          <a href="">Home</a>
          <button className="add-btn" onClick={() => setIsOpen(true)}>Add Product</button>
          <Link to="/adminblogs">Blogs</Link>
        
          <Link to="/reservation">
           Reservations
          </Link>

           <Link to="/reclamation">
           Reclamations
          </Link>
       <a
  href="/"
  style={{
    backgroundColor: "red",
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-block"
  }}
>
  Logout
</a>

         
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- All Categories --</option>
            <option value="heavy_equipment">Heavy Equipment</option>
            <option value="sell_rent_farmland">Sell & Rent Farmland</option>
            <option value="fertilizers_manure">Fertilizers & Manure</option>
            <option value="agri_accessories">Agricultural Accessories</option>
            <option value="purely_homemade">Purely Homemade</option>
          </select>
        </nav>
      </header>

      <main className="content">
        <aside className="sidebar">
          <h3>Filters & Actions</h3>
          <p>Category: {selectedCategory || "All"}</p>
          <p>Total products: {filteredProducts.length}</p>
          <button onClick={fetchProducts} className="refresh-btn">
            Refresh Products
          </button>
        </aside>

        <section className="main-section">
          <h2>Products Management</h2>
          
          {loading && <p>Chargement des produits...</p>}
          {error && <div className="error">Erreur: {error}</div>}
          
          {!loading && !error && (
            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Photo</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <img 
                            src={product.photo} 
                            alt={product.nom}
                            className="product-thumb"
                            onError={(e) => { 
                              e.target.src = '/placeholder-image.jpg'; 
                            }}
                          />
                        </td>
                        <td>{product.nom}</td>
                        <td>
                          <span className="category-badge">
                            {getCategoryDisplayName(product.category)}
                          </span>
                        </td>
                        <td className="description-cell">
                          {product.description.length > 100 
                            ? product.description.substring(0, 100) + "..."
                            : product.description
                          }
                        </td>
                        <td>
                          {product.created_at 
                            ? new Date(product.created_at).toLocaleDateString('fr-FR')
                            : 'N/A'
                          }
                        </td>
                        <td>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-products">
                        {selectedCategory 
                          ? `Aucun produit trouvé dans la catégorie "${getCategoryDisplayName(selectedCategory)}"`
                          : "Aucun produit trouvé"
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} AgriAdmin — Dashboard
      </footer>

      {/* ---------- CUSTOM MODAL ---------- */}
      {/* {isOpen && (
        <div className="modal-container">
          <span onClick={() => setIsOpen(false)} className="btn-colse">❌</span>
          <form onSubmit={handleSubmit} className="product-form">
            <input
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Product name..."
              required
            />
            <input
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="Product image link..."
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description..."
              rows={5}
              required
            />
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
            >
              <option value="">-- Select Category --</option>
              <option value="heavy_equipment">Heavy Equipment</option>
              <option value="sell_rent_farmland">Sell & Rent Farmland</option>
              <option value="fertilizers_manure">Fertilizers & Manure</option>
              <option value="agri_accessories">Agricultural Accessories</option>
              <option value="purely_homemade">Purely Homemade</option>
            </select>

            <button type="submit">Add Product</button>
          </form>
        </div>
      )} */}


      {/* ---------- CUSTOM MODAL ---------- */}
{isOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button onClick={() => setIsOpen(false)} className="btn-close-modal">
        <i className="bi bi-x-lg"></i>
      </button>
      <div className="modal-header">
        <h2 className="modal-title">Ajouter un nouveau produit</h2>
      </div>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="nom">Nom du produit</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom du produit..."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Lien de l'image</label>
          <input
            type="text"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            placeholder="Lien de l'image du produit..."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description du produit..."
            rows={5}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required
          >
            <option value="">-- Sélectionnez une catégorie --</option>
            <option value="heavy_equipment">Équipement lourd</option>
            <option value="sell_rent_farmland">Vente & Location de terres agricoles</option>
            <option value="fertilizers_manure">Fertilisants & Fumier</option>
            <option value="agri_accessories">Accessoires agricoles</option>
            <option value="purely_homemade">Produits artisanaux</option>
          </select>
        </div>
        <button type="submit" className="btn-submit">Ajouter le produit</button>
      </form>
    </div>
  </div>
)}

      <style jsx>{`
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        .products-table th,
        .products-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        
        .products-table th {
          background-color: #f4f4f4;
          font-weight: bold;
        }
        
        .product-thumb {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .category-badge {
          background: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .description-cell {
          max-width: 200px;
        }
        
        .delete-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .delete-btn:hover {
          background: #c82333;
        }
        
        .refresh-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .no-products {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        
        .error {
          color: red;
          background: #ffe6e6;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
        }
        
        .table-container {
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}