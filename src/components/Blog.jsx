import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration de l'URL de base du backend
  const BASE_URL = 'http://localhost:5000';

  // Fonction pour fetcher les blogs publiés
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/blogs/status/published`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      setBlogs(Array.isArray(result.data) ? result.data : []);
      
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les blogs au montage du composant
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[date.getMonth()];
    return { day, month };
  };

  // Fonction pour tronquer le contenu
  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Fonction pour obtenir une catégorie par défaut
  const getDefaultCategory = (content, index) => {
    const categories = ['Politics', 'Economics', 'Sports', 'Technology', 'General'];
    return categories[index % categories.length];
  };

  // Composant de chargement
  if (loading) {
    return (
      <main className="main">
        <div className="page-title dark-background" 
             data-aos="fade" 
             style={{ backgroundImage: 'url(assets/img/page-title-bg.webp)' }}>
          <div className="container position-relative">
            <h1>Blog</h1>
            <p>Home / Blog</p>
            <nav className="breadcrumbs">
              <ol>
                <li><Link to="/">Home</Link></li>
                <li className="current">Blog</li>
              </ol>
            </nav>
          </div>
        </div>
        
        <section id="blog-posts-2" className="blog-posts-2 section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement des articles...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Composant d'erreur
  if (error) {
    return (
      <main className="main">
        <div className="page-title dark-background" 
             data-aos="fade" 
             style={{ backgroundImage: 'url(assets/img/page-title-bg.webp)' }}>
          <div className="container position-relative">
            <h1>Blog</h1>
            <p>Home / Blog</p>
            <nav className="breadcrumbs">
              <ol>
                <li><Link to="/">Home</Link></li>
                <li className="current">Blog</li>
              </ol>
            </nav>
          </div>
        </div>
        
        <section id="blog-posts-2" className="blog-posts-2 section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="alert alert-danger text-center">
                  <i className="bi bi-exclamation-triangle-fill fs-1 text-danger mb-3"></i>
                  <h5>Erreur de chargement</h5>
                  <p className="mb-3">{error}</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={fetchBlogs}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <main className="main">
        {/* Page Title */}
        <div 
          className="page-title dark-background" 
          data-aos="fade" 
          style={{ backgroundImage: 'url(assets/img/page-title-bg.webp)' }}
        >
          <div className="container position-relative">
            <h1>Blog</h1>
            <p>Home / Blog</p>
            <nav className="breadcrumbs">
              <ol>
                <li><Link to="/">Home</Link></li>
                <li className="current">Blog</li>
              </ol>
            </nav>
          </div>
        </div>
        {/* End Page Title */}

        {/* Blog Posts 2 Section */}
        <section id="blog-posts-2" className="blog-posts-2 section">
          <div className="container">
            {blogs.length === 0 ? (
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <i className="bi bi-journal-x fs-1 text-muted mb-3"></i>
                  <h3>Aucun article trouvé</h3>
                  <p className="text-muted">Il n'y a actuellement aucun article publié.</p>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={fetchBlogs}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Actualiser
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="row mb-5 text-center">
                  <div className="col-12">
                    <h2 className="section-title">Nos derniers articles</h2>
                    <p className="section-subtitle text-muted">Découvrez {blogs.length} article{blogs.length > 1 ? 's' : ''} publié{blogs.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="row gy-5">
                  {blogs.map((blog, index) => {
                    const { day, month } = formatDate(blog.created_at);
                    
                    return (
                      <div key={blog.id} className="col-lg-4 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay={(index + 1) * 100}>
                        <article className="blog-card position-relative h-100 rounded shadow-sm overflow-hidden d-flex flex-column">
                          <div className="post-img position-relative overflow-hidden" style={{ height: '250px' }}>
                            <img 
                              src={blog.image_url || 'assets/img/blog/blog-1.jpg'} 
                              className="img-fluid w-100 h-100 object-fit-cover transition-transform" 
                              alt={blog.title}
                              onError={(e) => {
                                e.target.src = 'assets/img/blog/blog-1.jpg';
                              }}
                            />
                          </div>

                          <div className="card-body p-4 d-flex flex-column">
                            <div className="meta d-flex align-items-center mb-3">
                              <div className="d-flex align-items-center me-3 text-muted small">
                                <i className="bi bi-person me-1"></i> 
                                <span>{blog.author}</span>
                              </div>
                              <div className="d-flex align-items-center text-muted small">
                                <i className="bi bi-folder2 me-1"></i> 
                                <span>{getDefaultCategory(blog.content, index)}</span>
                              </div>
                            </div>
                            
                            <h3 className="card-title post-title">
                              <Link to={`/blog-details/${blog.id}`} className="text-decoration-none text-dark stretched-link">
                                {blog.title}
                              </Link>
                            </h3>
                            
                            <p className="card-text post-excerpt text-muted mb-4 flex-grow-1">
                              {truncateContent(blog.content, 120)}
                            </p>
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <Link 
                                to={`/blog-details/${blog.id}`} 
                                className="readmore-btn btn btn-outline-primary btn-sm"
                              >
                                Lire la suite <i className="bi bi-arrow-right ms-2"></i>
                              </Link>
                              <span className="post-date text-muted small">
                                <i className="bi bi-calendar me-1"></i> {day} {month}
                              </span>
                            </div>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
                
                {/* Bouton pour rafraîchir */}
                <div className="row mt-5">
                  <div className="col-12 text-center">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={fetchBlogs}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      {loading ? 'Actualisation...' : 'Actualiser les articles'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        {/* /Blog Posts 2 Section */}
      </main>
    </>
  );
};

export default Blog;