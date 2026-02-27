// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer id="footer" className="footer dark-background">
      <div className="container footer-top">
        <div className="row gy-5">
          <div className="col-lg-6">
            <a href="index.html" className="logo d-flex align-items-center">
              <h1 className="sitename">GreenAgritech</h1>
            </a>
      
            <div className="newsletter">
              <h4>Our Newsletter</h4>
              <p>Subscribe to our newsletter and receive updates about our services</p>
              <form action="forms/newsletter.php" method="post" className="php-email-form">
                <div className="input-group">
                  <input type="email" name="email" placeholder="Your email address" />
                  <button type="submit">Subscribe</button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="row">
              <div className="col-lg-6 col-6">
                <div className="footer-links">
                  <h4>Quick Links</h4>
                  <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About us</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="testimonials.html">Testimonials</a></li>
                    <li><a href="blog.html">Blog</a></li>
                    <li><a href="contact.html">Contact</a></li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-6 col-6">
                <div className="footer-links">
                  <h4>Address</h4>
                  <p>tunisia</p>
                  <p>tunisia</p>
                  <p>tunisia</p>
                  <p className="mt-3"><strong>Phone:</strong> <span>+216 5589 55488 55</span></p>
                  <p><strong>Email:</strong> <span>info@example.com</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container copyright text-center">
        <p>© <span>Copyright</span> <strong className="px-1 sitename">GreenAgritech</strong> <span>All Rights Reserved</span></p>
        <div className="credits">

          Designed by Ameni
        </div>
        <div className="social-links order-first order-lg-last mb-3 mb-lg-0">
          <a href="#"><i className="bi bi-twitter-x"></i></a>
          <a href="#"><i className="bi bi-facebook"></i></a>
          <a href="#"><i className="bi bi-instagram"></i></a>
          <a href="#"><i className="bi bi-linkedin"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;