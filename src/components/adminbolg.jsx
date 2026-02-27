import React, { useState, useEffect } from "react";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    author: "",
    status: "published"
  });

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs when statusFilter changes
  useEffect(() => {
    if (statusFilter === "") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.status === statusFilter));
    }
  }, [blogs, statusFilter]);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/blogs");
      
      if (!res.ok) {
        throw new Error(`Erreur serveur: ${res.status}`);
      }
      
      const data = await res.json();
      setBlogs(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du fetch des blogs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingBlog 
        ? `http://localhost:5000/blogs/${editingBlog.id}`
        : "http://localhost:5000/blogs";
      
      const method = editingBlog ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur serveur: ${res.status}`);
      }
      
      alert(editingBlog ? "Blog mis à jour avec succès !" : "Blog créé avec succès !");
      closeModal();
      fetchBlogs();
      
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      image_url: blog.image_url || "",
      author: blog.author,
      status: blog.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce blog ?")) {
      try {
        const res = await fetch(`http://localhost:5000/blogs/${blogId}`, {
          method: "DELETE"
        });
        
        if (res.ok) {
          alert("Blog supprimé avec succès");
          fetchBlogs();
        } else {
          const errorData = await res.json().catch(() => ({}));
          alert("Erreur lors de la suppression: " + (errorData.message || "Erreur serveur"));
        }
      } catch (err) {
        alert("Erreur: " + err.message);
      }
    }
  };

  const openModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      content: "",
      image_url: "",
      author: "",
      status: "published"
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setFormData({
      title: "",
      content: "",
      image_url: "",
      author: "",
      status: "published"
    });
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Chargement des blogs...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="admin-blog-container">
      <header className="blog-header">
        <h1>Gestion des Blogs</h1>
        <div className="blog-controls">
          <button onClick={openModal} className="add-blog-btn">
            + Ajouter Blog
          </button>
          <button onClick={fetchBlogs} className="refresh-btn">
            🔄 Actualiser
          </button>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>
        </div>
      </header>

      <div className="blog-stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{blogs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Publiés</h3>
          <p>{blogs.filter(b => b.status === 'published').length}</p>
        </div>
        <div className="stat-card">
          <h3>Brouillons</h3>
          <p>{blogs.filter(b => b.status === 'draft').length}</p>
        </div>
        <div className="stat-card">
          <h3>Affichés</h3>
          <p>{filteredBlogs.length}</p>
        </div>
      </div>

      <div className="blogs-table-container">
        {filteredBlogs.length > 0 ? (
          <table className="blogs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Statut</th>
                <th>Créé le</th>
                <th>Modifié le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td>#{blog.id}</td>
                  <td>
                    {blog.image_url ? (
                      <img 
                        src={blog.image_url} 
                        alt={blog.title}
                        className="blog-thumbnail"
                        onError={(e) => { 
                          e.target.src = '/placeholder-image.jpg'; 
                        }}
                      />
                    ) : (
                      <div className="no-image">Pas d'image</div>
                    )}
                  </td>
                  <td className="blog-title">
                    <strong>{blog.title}</strong>
                    <p>{truncateContent(blog.content, 80)}</p>
                  </td>
                  <td>{blog.author}</td>
                  <td>
                    <span className={`status-badge ${blog.status}`}>
                      {blog.status === 'published' ? '🟢 Publié' : '🟡 Brouillon'}
                    </span>
                  </td>
                  <td>{formatDate(blog.created_at)}</td>
                  <td>{formatDate(blog.updated_at)}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleEdit(blog)}
                      className="edit-btn"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="delete-btn"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-blogs">
            <h3>Aucun blog trouvé</h3>
            <p>
              {statusFilter 
                ? `Aucun blog avec le statut "${statusFilter}"`
                : "Commencez par créer votre premier blog"
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingBlog ? "Modifier le Blog" : "Créer un Blog"}</h3>
              <span onClick={closeModal} className="close-btn">&times;</span>
            </div>
            
            <form onSubmit={handleSubmit} className="blog-form">
              <div className="form-group">
                <label htmlFor="title">Titre *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Titre du blog..."
                  required
                  minLength="5"
                  maxLength="255"
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">Auteur *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Nom de l'auteur..."
                  required
                  maxLength="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image_url">URL de l'image</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://exemple.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="image-preview">
                    <img 
                      src={formData.image_url} 
                      alt="Aperçu"
                      onError={(e) => { 
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="status">Statut *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="content">Contenu *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Contenu du blog..."
                  required
                  minLength="50"
                  rows="10"
                />
                <div className="char-counter">
                  {formData.content.length} caractères (min. 50)
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Annuler
                </button>
                <button type="submit" className="submit-btn">
                  {editingBlog ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-blog-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .blog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .blog-header h1 {
          margin: 0;
          color: #333;
        }

        .blog-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .add-blog-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
        }

        .refresh-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .status-filter {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .blog-stats {
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

        .stat-card p {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .blogs-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow-x: auto;
        }

        .blogs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .blogs-table th,
        .blogs-table td {
          padding: 12px 8px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .blogs-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
          font-size: 12px;
          text-transform: uppercase;
        }

        .blog-thumbnail {
          width: 60px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
        }

        .no-image {
          width: 60px;
          height: 40px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #999;
          border-radius: 4px;
        }

        .blog-title strong {
          display: block;
          margin-bottom: 5px;
          color: #333;
        }

        .blog-title p {
          margin: 0;
          color: #666;
          font-size: 12px;
          line-height: 1.4;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-badge.published {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.draft {
          background: #fff3cd;
          color: #856404;
        }

        .actions {
          display: flex;
          gap: 5px;
        }

        .edit-btn,
        .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 3px;
        }

        .edit-btn:hover {
          background: #f0f0f0;
        }

        .delete-btn:hover {
          background: #ffebee;
        }

        .no-blogs {
          padding: 60px 20px;
          text-align: center;
        }

        .no-blogs h3 {
          margin: 0 0 15px 0;
          color: #666;
        }

        .no-blogs p {
          color: #999;
          margin: 0;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .close-btn:hover {
          color: #333;
        }

        .blog-form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          box-sizing: border-box;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 200px;
        }

        .image-preview {
          margin-top: 10px;
        }

        .image-preview img {
          max-width: 200px;
          height: 120px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .char-counter {
          font-size: 12px;
          color: #666;
          text-align: right;
          margin-top: 5px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .cancel-btn,
        .submit-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          flex: 1;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }

        .submit-btn {
          background: #007bff;
          color: white;
        }

        .cancel-btn:hover {
          background: #5a6268;
        }

        .submit-btn:hover {
          background: #0056b3;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }

        .error {
          color: #dc3545;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .admin-blog-container {
            padding: 10px;
          }

          .blog-header {
            flex-direction: column;
            align-items: stretch;
          }

          .blog-controls {
            justify-content: center;
          }

          .blog-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .blogs-table th,
          .blogs-table td {
            padding: 8px 4px;
            font-size: 12px;
          }

          .modal-content {
            width: 95%;
            margin: 10px;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}