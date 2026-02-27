// src/pages/About.jsx
import React from "react";

const About = () => {
  return (
    <>
      <section id="page-title" className="page-title section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2 className="title text-uppercase">About Us</h2>
            </div>
            <div className="col-md-6">
              <nav className="breadcrumb text-md-end" aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="index.html">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    About Us
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* About Section (Main) - Similar structure to the one on Home, but adapted for About page */}
      <section id="about" className="about section">
        <div className="content">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <img
                  src="assets/img/img_long_5.jpg"
                  alt="Image "
                  className="img-fluid img-overlap"
                  data-aos="zoom-out"
                />
              </div>
              <div
                className="col-lg-5 ml-auto"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h3 className="content-subtitle opacity-50">Who We Are</h3>
                <h2 className="content-title mb-4">
                  More than <strong>50 year experience</strong> in agriculture
                  industry
                </h2>
                <p className="opacity-50">
                  Reprehenderit, odio laboriosam? Blanditiis quae ullam quasi
                  illum minima nostrum perspiciatis error consequatur sit nulla.
                </p>

                <div className="row my-5">
                  <div className="col-lg-12 d-flex align-items-start mb-4">
                    <i className="bi bi-cloud-rain me-4 display-6"></i>
                    <div>
                      <h4 className="m-0 h5">Plants needs rain</h4>
                      <p className="text-white opacity-50">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-12 d-flex align-items-start mb-4">
                    <i className="bi bi-heart me-4 display-6"></i>
                    <div>
                      <h4 className="m-0 h5">Love organic foods</h4>
                      <p className="text-white opacity-50">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-12 d-flex align-items-start">
                    <i className="bi bi-shop me-4 display-6"></i>
                    <div>
                      <h4 className="m-0 h5">Sell vegies</h4>
                      <p className="text-white opacity-50">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional About sections (Team, Process, etc.) from about.html */}
      <section id="team" className="team section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Our Team</h2>
          <p>Meet our dedicated team members</p>
        </div>

        <div
          style={{ width: "80%", marginLeft: "550px" }}
          className="container  "
        >
          <div className="text-center ">
            <div
              className="col-lg-4 col-md-6 member"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="member-img">
                <img
                  src="assets/img/anonymos.jpg"
                  className="img-fluid"
                  alt=""
                />
                <div className="social">
                  <a className="mx-3 my-5 fs-3" href="#">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a className="mx-3 my-5 fs-3" href="#">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a className="mx-3 my-5 fs-3" href="#">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a className="mx-3 my-5 fs-3" href="#">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
              <div className="member-info">
                <h4>Ameni radedi</h4>
                <span>Student</span>
                <p>
                  I'm a student who is passionate about learning development. I
                  always look forward to improving my skills and exploring new
                  technologies. I enjoy coming up with creative ideas and
                  turning them into real projects.
                </p>
              </div>
            </div>
            {/* Other team members here */}
          </div>
        </div>
      </section>

      {/* Call To Action Section (reused from index.html if needed) */}
      <section id="call-to-action" className="call-to-action section">
        <div className="container">
          <div className="row">
            <div className="col-md-9 text-md-start text-center">
              <h3>We work with the best farmers</h3>
              <p>
                We work with the best farmers to ensure quality, sustainability,
                and trusted results. Their experience and dedication help us
                deliver top agricultural products and services. Together, we
                grow with passion, care, and a commitment to excellence. Join us
                and be part of a farming community that truly makes a
                difference.
              </p>
            </div>
            <div className="col-md-3 d-flex justify-content-center align-items-center">
              <a href="#" className="btn-cta">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
