// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header id="header" className="header d-flex align-items-center sticky-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
        <Link to="/" className="logo d-flex align-items-center">
          {/* Uncomment if you have a logo image */}
          {/* <img src="assets/img/logo.png" alt="" /> */}
          <h1 className="sitename">GreenAgritech</h1>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link to="/home" className="active">Home</Link></li>
            <li><Link to="/about">About</Link></li>
         
        
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
             <li><Link to="/addproduct">Ajouter votre produit</Link></li>

          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>

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

      </div>
    </header>
  );
};

export default Header;