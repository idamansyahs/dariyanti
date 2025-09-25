import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import Isotope from "isotope-layout";

// 1. Impor semua gambar statis yang digunakan di galeri
import gallery0 from '/src/assets/img/gallery/0.jpg';
import gallery1 from '/src/assets/img/gallery/1.jpg';
import gallery2 from '/src/assets/img/gallery/2.jpg';
import gallery3 from '/src/assets/img/gallery/3.jpg';
import gallery4 from '/src/assets/img/gallery/4.jpg';
import gallery5 from '/src/assets/img/gallery/5.jpg';
import gallery6 from '/src/assets/img/gallery/6.jpg';
import gallery7 from '/src/assets/img/gallery/7.jpg';
import gallery8 from '/src/assets/img/gallery/8.jpg';
import api from "../../api";

const LavaGallery = () => {
  // ==================================================================
  // 1. STATE & REF MANAGEMENT (Disederhanakan)
  // ==================================================================
  const iso = useRef(null);
  const isotopeContainer = useRef(null);
  const [filterKey, setFilterKey] = useState("*");
  const [dynamicContents, setDynamicContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==================================================================
  // 2. DATA FETCHING (Disederhanakan)
  // ==================================================================
  useEffect(() => {
    api.get("http://localhost:5000/api/konten-user")
      .then((res) => {
        const allContents = res.data.map(item => ({ ...item, platform: item.platform.toLowerCase() }));
        setDynamicContents(allContents);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil data:", err);
        setIsLoading(false);
      });
  }, []);

  // ==================================================================
  // 3. ISOTOPE & EMBED LOGIC (Disederhanakan)
  // ==================================================================
  useEffect(() => {
    if (!document.getElementById("instgrm-script")) {
      const s = document.createElement("script");
      s.id = "instgrm-script"; s.src = "https://www.instagram.com/embed.js"; s.async = true;
      document.body.appendChild(s);
    }
    if (!document.getElementById("tiktok-embed-script")) {
      const s = document.createElement("script");
      s.id = "tiktok-embed-script"; s.src = "https://www.tiktok.com/embed.js"; s.async = true;
      document.body.appendChild(s);
    }

    if (!iso.current && isotopeContainer.current) {
      iso.current = new Isotope(isotopeContainer.current, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });
    }

    if (!isLoading && iso.current) {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
      iso.current.reloadItems();
      iso.current.arrange({ filter: filterKey });
    }

    return () => {
      if (iso.current) {
        iso.current.destroy();
        iso.current = null;
      }
    };
  }, [isLoading]);

  // ==================================================================
  // 4. FILTERING LOGIC
  // ==================================================================
  useEffect(() => {
    if (iso.current) {
      iso.current.arrange({ filter: filterKey });
    }
  }, [filterKey]);

  // Helper function & style
  const blockquoteStyle = {
    background: "#FFF", border: 0, borderRadius: 3,
    boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
    margin: "1px", maxWidth: "540px", minWidth: "326px", padding: 0,
    width: "calc(100% - 2px)",
  };

  const getTiktokId = (url) => {
    const match = url.match(/(\d+)(?:\/)?$/);
    return match ? match[1] : "";
  };

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

              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle active" data-bs-toggle="dropdown">Lava.</a>
                <div className="dropdown-menu bg-light m-0">
                  <Link to="/lava" className="dropdown-item">About Lava.</Link>
                  {/* 2. Atur 'active' class pada link dropdown yang benar */}
                  <Link to="/lava-gallery" className="dropdown-item active">Gallery Lava.</Link>
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
              {/* 3. Perbaiki struktur breadcrumb */}
              <ol className="breadcrumb justify-content-center text-uppercase">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/lava">Lava.</Link></li>
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
          <div className="text-center mx-auto wow fadeInUp max-w-96" data-wow-delay="0.1s" >
            <h1 className="mb-3 fw-bold text-primary">Gallery</h1>
          </div>
          <div className="row wow fadeInUp" data-wow-delay="0.3s">
            <div className="col-12 text-center bg-blue-100">
              <ul id="portfolio-flters" className="list-inline rounded mb-5">
                <li className={`mx-2 ${filterKey === "*" ? "active" : ""}`} onClick={() => setFilterKey("*")}>
                  All
                </li>
                <li className={`mx-2 ${filterKey === ".first" ? "active" : ""}`} onClick={() => setFilterKey(".first")}>
                  Facilities
                </li>
                <li className={`mx-2 ${filterKey === ".second" ? "active" : ""}`} onClick={() => setFilterKey(".second")}>
                  Rooms
                </li>
                <li className={`mx-2 ${filterKey === ".third" ? "active" : ""}`} onClick={() => setFilterKey(".third")}>
                  Contents
                </li>
              </ul>
            </div>
          </div>

          {/* Gallery start*/}
          <div ref={isotopeContainer} className="row g-4 portfolio-container">
            {/* Gunakan gambar yang diimpor */}
            <div className="col-lg-4 col-md-6 portfolio-item first wow fadeInUp" data-wow-delay="0.1s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src={gallery1} alt="Lava Coffee and Eatery" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Lava. Coffee and Eatery</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href={gallery1} data-lightbox="portfolio"><i className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.3s">
              <div className="portfolio-inner rounded">
                <img className="img-fluid" src={gallery2} alt="Room" />
                <div className="portfolio-text">
                  <h4 className="text-white mb-4">Room</h4>
                  <div className="d-flex">
                    <a className="btn btn-lg-square rounded-circle mx-2" href={gallery2} data-lightbox="portfolio"><i className="fa fa-link"></i></a>
                  </div>
                </div>
              </div>
            </div>
            {/* ... Ulangi untuk semua gambar statis lainnya ... */}
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.5s">
                <div className="portfolio-inner rounded">
                    <img className="img-fluid" src={gallery3} alt="Room"/>
                    <div className="portfolio-text">
                        <h4 className="text-white mb-4">Room</h4>
                        <div className="d-flex">
                            <a className="btn btn-lg-square rounded-circle mx-2" href={gallery3} data-lightbox="portfolio"><i className="fa fa-link"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.1s">
                <div className="portfolio-inner rounded">
                    <img className="img-fluid" src={gallery4} alt="Toilet"/>
                    <div className="portfolio-text">
                        <h4 className="text-white mb-4">Toilet</h4>
                        <div className="d-flex">
                            <a className="btn btn-lg-square rounded-circle mx-2" href={gallery4} data-lightbox="portfolio"><i className="fa fa-link"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item first wow fadeInUp" data-wow-delay="0.3s">
                <div className="portfolio-inner rounded">
                    <img className="img-fluid" src={gallery5} alt="SS. Coffee Shop"/>
                    <div className="portfolio-text">
                        <h4 className="text-white mb-4">SS. Coffee Shop</h4>
                        <div className="d-flex">
                            <a className="btn btn-lg-square rounded-circle mx-2" href={gallery5} data-lightbox="portfolio"><i className="fa fa-link"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item first wow fadeInUp" data-wow-delay="0.5s">
                <div className="portfolio-inner rounded">
                    <img className="img-fluid" src={gallery6} alt="Meeting Room"/>
                    <div className="portfolio-text">
                        <h4 className="text-white mb-4">Meeting Room</h4>
                        <div className="d-flex">
                            <a className="btn btn-lg-square rounded-circle mx-2" href={gallery6} data-lightbox="portfolio"><i className="fa fa-link"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item first wow fadeInUp" data-wow-delay="0.5s">
                <div className="portfolio-inner rounded">
                    <img className="img-fluid" src={gallery0} alt="Lobby"/>
                    <div className="portfolio-text">
                        <h4 className="text-white mb-4">Lobby</h4>
                        <div className="d-flex">
                            <a className="btn btn-lg-square rounded-circle mx-2" href={gallery0} data-lightbox="portfolio"><i className="fa fa-link"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item first wow fadeInUp" data-wow-delay="0.5s">
                <div className="portfolio-inner rounded">
                    <img className="img-fluid" src={gallery7} alt="Hallway"/>
                    <div className="portfolio-text">
                        <h4 className="text-white mb-4">Hallway</h4>
                        <div className="d-flex">
                            <a className="btn btn-lg-square rounded-circle mx-2" href={gallery7} data-lightbox="portfolio"><i className="fa fa-link"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item first wow fadeInUp" data-wow-delay="0.5s">
                <div className="portfolio-inner rounded">
                    <img className="img-fluid" src={gallery8} alt="SS. Coffee Shop"/>
                    <div className="portfolio-text">
                        <h4 className="text-white mb-4">SS. Coffee Shop</h4>
                        <div className="d-flex">
                            <a className="btn btn-lg-square rounded-circle mx-2" href={gallery8} data-lightbox="portfolio"><i className="fa fa-link"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* content start */}
            {!isLoading && dynamicContents.map((item) => {
              if (item.platform === "instagram") {
                return (
                  <div key={item.id} className="col-lg-4 col-md-6 portfolio-item third wow fadeInUp" data-wow-delay="0.1s">
                    <blockquote
                      className="instagram-media"
                      data-instgrm-permalink={item.link}
                      data-instgrm-version="14"
                      style={blockquoteStyle}
                    />
                  </div>
                );
              }
              if (item.platform === "tiktok") {
                return (
                  <div key={item.id} className="col-lg-4 col-md-6 portfolio-item third wow fadeInUp" data-wow-delay="0.1s">
                    <blockquote
                      className="tiktok-embed"
                      cite={item.link}
                      data-video-id={getTiktokId(item.link)}
                      style={{ ...blockquoteStyle, minHeight: '500px' }}
                    >
                      <section></section>
                    </blockquote>
                  </div>
                );
              }
              return null;
            })}
          </div>
          {/* content end */}
        </div>
      </div>
      {/* gallery end */}

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