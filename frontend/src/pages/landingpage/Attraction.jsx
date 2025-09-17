import React from 'react'
import { Link } from 'react-router-dom'

const Attraction = () => {
  return (
    <div className="container-xxl bg-white p-0">
      {/* spinner */}
      {/* <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary w-3 h-3" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div> */}
      {/* spinner end */}

      {/* navbar and hero  */}
      <div className="container-xxl position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
          <Link to="/" className="navbar-brand p-0">
            <h1 className="text-primary m-0"><i className="fas fa-hotel me-3"></i>Fhandika Boutique Inc.</h1>
          </Link>
          <button className="navbar-toggler  m-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0 pe-4">
              <Link to="/" className="nav-item nav-link active">Home</Link>
              <Link to="/about" className="nav-item nav-link">About</Link>

              {/* Dropdown */}
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Lava.</a>
                <div className="dropdown-menu bg-light m-0">
                  <Link to="/lava" className="dropdown-item">About Lava.</Link>
                  <Link to="/lava-gallery" className="dropdown-item">Gallery Lava.</Link>
                  <Link to="/menu" className="dropdown-item">Menu Lava.</Link>
                </div>
              </div>

              <Link to="/attraction" className="nav-item nav-link">Attraction</Link>
              <Link to="/rooms" className="nav-item nav-link">Rooms</Link>
              <Link to="/gallery" className="nav-item nav-link">Gallery</Link>
              <Link to="/contact" className="nav-item nav-link">Contact</Link>

              <Link to="/login" className="nav-item nav-link">Login</Link>
            </div>
          </div>
        </nav>

        <div className="container-xxl py-5 bg-dark hero-header mb-5">
          <div className="container text-center my-5 pt-5 pb-4">
            <h1 className="display-3 text-white mb-3 animated slideInDown">Tourist Attraction</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center text-uppercase">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item text-white active" aria-current="page">Attraction</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {/* navbar and hero end */}

      {/* Destination Start */}
      <div className="container-xxl py-5 destination">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Attraction</h5>
            <h1 className="mb-5">Tourist Attraction</h1>
          </div>
          <div className="row g-3">
            <div className="col-lg-7 col-md-6">
              <div className="row g-3">
                <div className="col-lg-12 col-md-12 wow zoomIn" data-wow-delay="0.1s">
                  <a className="position-relative d-block overflow-hidden" href="">
                    <img className="img-fluid" src="/src/assets/img/destination-1.jpg" alt="" />
                      <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Ulee Lheue Beach</div>
                  </a>
                </div>
                <div className="col-lg-6 col-md-12 wow zoomIn" data-wow-delay="0.3s">
                  <a className="position-relative d-block overflow-hidden" href="">
                    <img className="img-fluid" src="/src/assets/img/destination-2.jpg" alt="" />
                      <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Mesjid Raya Baiturrahman</div>
                  </a>
                </div>
                <div className="col-lg-6 col-md-12 wow zoomIn" data-wow-delay="0.5s">
                  <a className="position-relative d-block overflow-hidden" href="">
                    <img className="img-fluid" src="/src/assets/img/destination-3.jpeg" alt="" />
                      <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Museum Aceh</div>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-6 wow zoomIn min-h-96" data-wow-delay="0.7s" >
              <a className="position-relative d-block h-100 overflow-hidden" href="">
                <img className="img-fluid position-absolute w-100 h-100" src="/src/assets/img/destination-4.jpg" alt="" />
                  <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Museum Tsunami</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Destination end */}

       {/* footer start */}

            <div id="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="social">
                                <a
                                    href="https://www.instagram.com/fhandikaboutique/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-brands fa-square-instagram"></i>
                                </a>
                                <a href="mailto:hotel@fhandikaboutiqueinc.com">
                                    <i className="fa-solid fa-envelope"></i>
                                </a>
                                <a
                                    href="https://wa.me/+628116810037"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-brands fa-square-whatsapp"></i>
                                </a>
                                <a
                                    href="https://goo.gl/maps/QAJEEN5mgbUgurvj9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-solid fa-map-location-dot"></i>
                                </a>
                            </div>
                        </div>
                        <div className="col-12">
                            <p>
                                Copyright &#169; 2023{" "}
                                <a
                                    href="https://fhandikaboutiqueinc.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Fhandika Boutique Inc.
                                </a>{" "}
                                All Rights Reserved.
                            </p>

                            <p>
                                Designed By{" "}
                                <a
                                    href="https://htmlcodex.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    HTML Codex
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* footer end */}
    </div>
  )
}

export default Attraction   