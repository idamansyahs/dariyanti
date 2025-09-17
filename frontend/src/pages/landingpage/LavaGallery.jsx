import React from 'react'
import { Link } from 'react-router-dom'

const LavaGallery = () => {
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
            <h1 className="display-3 text-white mb-3 animated slideInDown">Gallery Lava.</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center text-uppercase">
                <li className="breadcrumb-item"><Link to="/" className="nav-item nav-link active">Home</Link></li>
                <li className="breadcrumb-item text-white active" aria-current="page">Lava.</li>
                <li className="breadcrumb-item text-white active" aria-current="page">Gallery</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {/* navbar and hero end */}

      {/* Projects Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto wow fadeInUp max-w-2xl" data-wow-delay="0.1s">
            <h1 className="mb-3 fw-bold text-primary">Gallery Lava.</h1>
          </div>
          <div className="row wow fadeInUp" data-wow-delay="0.3s">
            <div className="col-12 text-center">
              <ul className="list-inline rounded mb-5" id="portfolio-flters">
                <li className="mx-2 active" data-filter="*">All</li>
                <li className="mx-2" data-filter=".first">Lava.</li>
                <li className="mx-2" data-filter=".second">Menu</li>
              </ul>
            </div>
          </div>
          <div className="row g-4 portfolio-container">
            <div className="col-lg-4 col-md-6 portfolio-item first wow fadeInUp" data-wow-delay="0.1s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/12.jpg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Lava. Coffee and Eatery</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/12.jpg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item first wow fadeInUp" data-wow-delay="0.1s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/1.jpg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Lava. Coffee and Eatery</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/1.jpg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item first wow fadeInUp" data-wow-delay="0.3s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/2.jpg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Lava. Coffee and Eatery</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/2.jpg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.5s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/3.jpeg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Menu</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/3.jpeg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.1s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/4.jpeg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Menu</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/4.jpeg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.3s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/5.jpeg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Menu</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/5.jpeg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.5s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/6.jpeg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Menu</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/6.jpeg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.1s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/7.jpeg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Menu</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/7.jpeg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.3s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/8.jpeg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Menu</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/8.jpeg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.5s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/9.jpeg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Menu</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/9.jpeg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.1s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/10.jpeg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Menu</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/10.jpeg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.3s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src="/src/assets/img/lava/11.jpeg" alt="" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Menu</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href="/src/assets/img/lava/11.jpeg" data-lightbox="portfolio"><i
                      className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Projects End */}

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

export default LavaGallery