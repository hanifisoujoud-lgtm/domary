// src/pages/Contact.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  // 1. State hooks to manage form data and submission status
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // 2. Base URL for the backend API
  const BASE_URL = 'http://localhost:5000';

  // 3. Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // 4. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${BASE_URL}/reclamations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Échec de l\'envoi de la réclamation.');
      }

      setSuccess(true);
      setFormData({
        fullname: '',
        email: '',
        message: ''
      });

    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">

      {/* Page Title */}
      <div 
        className="page-title dark-background" 
        data-aos="fade" 
        style={{ backgroundImage: 'url(assets/img/page-title-bg.webp)' }}
      >
        <div className="container position-relative">
          <h1>Contact</h1>
          <p>Home / Contact</p>
          <nav className="breadcrumbs">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li className="current">Contact</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* End Page Title */}

      {/* Contact Section */}
      <section id="contact" className="contact section">
        <div className="mb-5">
          <iframe 
            style={{ width: '100%', height: '400px' }} 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12097.433213460943!2d-74.0062269!3d40.7101282!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb89d1fe6bc499443!2sDowntown+Conference+Center!5e0!3m2!1smk!2sbg!4v1539943755621" 
            frameBorder="0" 
            allowFullScreen="" 
            title="Google Maps"
          ></iframe>
        </div>
        {/* End Google Maps */}

        <div className="container" data-aos="fade">
          <div className="row gy-5 gx-lg-5">

            <div style={{marginLeft:"auto" , marginRight:"auto"}} className="col-lg-8">
              {/* 5. Update the form tag to use the handleSubmit function */}
              <form onSubmit={handleSubmit} className="php-email-form">
                <div className="row">
                  <div className="col-md-6 form-group">
                    {/* 6. Update input fields to be controlled components */}
                    <input 
                      type="text" 
                      name="fullname" 
                      className="form-control" 
                      id="fullname" 
                      placeholder="Votre Nom Complet" 
                      required 
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 form-group mt-3 mt-md-0">
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email" 
                      id="email" 
                      placeholder="Votre Email" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group mt-3">
                  <textarea 
                    className="form-control" 
                    name="message" 
                    placeholder="Message" 
                    required 
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="my-3">
                  {/* 7. Display dynamic messages */}
                  {loading && <div className="loading">Envoi en cours...</div>}
                  {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
                  {success && <div className="sent-message" style={{ display: 'block' }}>Votre réclamation a été envoyée avec succès. Merci !</div>}
                </div>
                
                <div className="text-center">
                  <button type="submit" disabled={loading}>
                    {loading ? 'Envoi...' : 'Envoyer la Réclamation'}
                  </button>
                </div>
              </form>
            </div>
            {/* End Contact Form */}
          </div>
        </div>
      </section>
      {/* /Contact Section */}

    </main>
  );
};

export default Contact;