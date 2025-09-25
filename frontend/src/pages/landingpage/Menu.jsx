import React from 'react';
import { Link } from 'react-router-dom';

// 1. Impor gambar-gambar menu
import menu1 from '/src/assets/img/menu/menu1.jpg';
import menu2 from '/src/assets/img/menu/menu2.jpg';
import menu3 from '/src/assets/img/menu/menu3.jpg';

const Menu = () => {
  return (
    <div className="container-xxl bg-white p-0">
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
              <Link to="/" className="nav-item nav-link">Home</Link>
              <Link to="/about" className="nav-item nav-link">About</Link>

              {/* Dropdown */}
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle active" data-bs-toggle="dropdown">Lava.</a>
                <div className="dropdown-menu bg-light m-0">
                  <Link to="/lava" className="dropdown-item">About Lava.</Link>
                  <Link to="/lava-gallery" className="dropdown-item">Gallery Lava.</Link>
                  {/* 2. Atur 'active' class pada item yang benar */}
                  <Link to="/menu" className="dropdown-item active">Menu Lava.</Link>
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
            {/* 3. Ubah judul hero */}
            <h1 className="display-3 text-white mb-3 animated slideInDown">Our Menu</h1>
            <nav aria-label="breadcrumb">
              {/* 4. Perbaiki breadcrumb */}
              <ol className="breadcrumb justify-content-center text-uppercase">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/lava">Lava.</Link></li>
                <li className="breadcrumb-item text-white active" aria-current="page">Menu</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {/* navbar and hero end */}

      {/* Menu Section Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
            <h1 className="mb-5">Lava. Menu</h1>
          </div>
          {/* 5. Implementasi layout tab */}
          <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.1s">
            <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
              <li className="nav-item">
                <a className="d-flex align-items-center text-start mx-3 ms-0 pb-3 active" data-bs-toggle="pill" href="#tab-1">
                  <i className="fa fa-utensils fa-2x text-primary"></i>
                  <div className="ps-3">
                    <small className="text-body">Main</small>
                    <h6 className="mt-n1 mb-0">Food</h6>
                  </div>
                </a>
              </li>
              <li className="nav-item">
                <a className="d-flex align-items-center text-start mx-3 pb-3" data-bs-toggle="pill" href="#tab-2">
                  <i className="fa fa-mug-saucer fa-2x text-primary"></i>
                  <div className="ps-3">
                    <small className="text-body">Special</small>
                    <h6 className="mt-n1 mb-0">Beverages</h6>
                  </div>
                </a>
              </li>
              <li className="nav-item">
                <a className="d-flex align-items-center text-start mx-3 me-0 pb-3" data-bs-toggle="pill" href="#tab-3">
                  <i className="fa fa-ice-cream fa-2x text-primary"></i>
                  <div className="ps-3">
                    <small className="text-body">Lovely</small>
                    <h6 className="mt-n1 mb-0">Desserts</h6>
                  </div>
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div id="tab-1" className="tab-pane fade show p-0 active">
                <div className="image-container">
                  <img src={menu1} className="img-fluid" alt="Food Menu" />
                </div>
              </div>
              <div id="tab-2" className="tab-pane fade show p-0">
                <div className="image-container">
                  <img src={menu2} className="img-fluid" alt="Beverages Menu" />
                </div>
              </div>
              <div id="tab-3" className="tab-pane fade show p-0">
                <div className="image-container">
                  <img src={menu3} className="img-fluid" alt="Desserts Menu" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Menu Section End */}


      {/* footer start */}
      <div id="footer">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="social">
                <a href="https://www.instagram.com/fhandikaboutique/" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-square-instagram"></i>
                </a>
                <a href="mailto:hotel@fhandikaboutiqueinc.com">
                  <i className="fa-solid fa-envelope"></i>
                </a>
                <a href="https://wa.me/+628116810037" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-square-whatsapp"></i>
                </a>
                <a href="https://goo.gl/maps/QAJEEN5mgbUgurvj9" target="_blank" rel="noopener noreferrer">
                  <i className="fa-solid fa-map-location-dot"></i>
                </a>
              </div>
            </div>
            <div className="col-12">
              <p>
                Copyright &#169; 2023{" "}
                <a href="https://fhandikaboutiqueinc.com" target="_blank" rel="noopener noreferrer">
                  Fhandika Boutique Inc.
                </a>{" "}
                All Rights Reserved.
              </p>
              <p>
                Designed By{" "}
                <a href="https://htmlcodex.com" target="_blank" rel="noopener noreferrer">
                  HTML Codex
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* footer end */}
    </div>
  );
}

export default Menu;