import React from 'react';
import { Link } from 'react-router-dom';

// 1. Impor semua gambar yang dibutuhkan untuk halaman ini
import aboutImg1 from '/src/assets/img/1.jpg';
import aboutImg2 from '/src/assets/img/2.jpg';
import aboutImg3 from '/src/assets/img/3.jpg';
import aboutImg4 from '/src/assets/img/4.jpg';
import roomImg1 from '/src/assets/img/kamar.jpg';
import roomImg2 from '/src/assets/img/kamar2.jpeg';
import roomImg3 from '/src/assets/img/kamar1.jpeg';
import destination1 from '/src/assets/img/destination-1.jpg';
import destination2 from '/src/assets/img/destination-2.jpg';
import destination3 from '/src/assets/img/destination-3.jpeg';
import destination4 from '/src/assets/img/destination-4.jpg';


const Index = () => {
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
              <Link to="/" className="nav-item nav-link active">Home</Link>
              <Link to="/about" className="nav-item nav-link">About</Link>

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
          <div className="container my-5 py-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 text-center text-lg-start">
                <h1 className="display-3 text-white animated slideInLeft">Shot Thru<br />The Heart</h1>
                <p className="text-white animated slideInLeft mb-4 pb-2">
                  Hotel room is one of those best places to find serenity, where the harmonious blend of comfort, elegance, and serenity creates a haven for relaxation and rejuvenation. Our meticulously designed rooms offer a sanctuary of
                  tranquility, adorned with soothing colors, plush furnishings, and panoramic views that transport you to a world of calmness. Immerse yourself in the luxurious amenities and personalized service, allowing your mind to
                  unwind and your spirit to soar. Whether you seek solitude or wish to reconnect with loved ones, our hotel rooms provide the perfect retreat, ensuring an unforgettable experience of peace and tranquility.
                </p>
              </div>
              <div className="col-lg-6 text-center text-lg-end overflow-hidden">
                {/* 2. Menambahkan hero image */}
                {/* <img className="img-fluid" src={roomImg1} alt="Hero room" /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* navbar and hero end */}

      {/* service start  */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-bed text-primary mb-4"></i>
                  <h5>Confortable Room</h5>
                  <p>Experience a seamless blend of modern amenities and timeless charm, providing you with a truly unforgettable stay.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-utensils text-primary mb-4"></i>
                  <h5>Rooftop Cafe</h5>
                  <p>Indulge in a breathtaking experience at our rooftop cafe, where stunning views meet delectable flavors.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-mug-saucer text-primary mb-4"></i>
                  <h5>Coffee Shop</h5>
                  <p>Step into our charming coffee shop and immerse yourself in a cozy atmosphere while savoring the perfect cup of coffee.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-solid fa-building-user text-primary mb-4"></i>
                  <h5>Meeting Room</h5>
                  <p>Elevate your meetings to new heights in our state-of-the-art meeting rooms, designed to inspire productivity and collaboration.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* service end */}

      {/* about start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6 text-start">
                  <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.1s" src={aboutImg2} alt="About 2" />
                </div>
                <div className="col-6 text-start">
                  <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.3s" src={aboutImg3} style={{ marginTop: '25%' }} alt="About 3" />
                </div>
                <div className="col-6 text-end">
                  <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.5s" src={aboutImg1} alt="About 1" />
                </div>
                <div className="col-6 text-end">
                  <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.7s" src={aboutImg4} alt="About 4" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h5 className="section-title ff-secondary text-start text-primary fw-normal">About Us</h5>
              <h1 className="mb-4">Welc<i className="fa fa-solid fa-magnifying-glass text-primary me-2"></i>me to FBI</h1>
              <p className="mb-4">
                Fhandika Boutique Inc. is a hotel that offers a unique experience with an industrial concept. With a design adorned in the colors of yellow, gray, and black, and murals gracing every corner, you will be immersed in a vibrant
                and energetic ambiance from the moment you step foot into the hotel.
              </p>
              <p className="mb-4">
                Fhandika Boutique Inc. draws inspiration from modern and trendy industrial design. You will be greeted with a primary color palette consisting of yellow, gray, and black, creating an atmosphere that is both elegant and
                contemporary. This combination of colors brings forth a bold and characterful impression.
              </p>
              <div className="row g-4 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                    <h1 className="flex-shrink-0 display-5 text-primary mb-0" data-toggle="counter-up">3</h1>
                    <div className="ps-4">
                      <p className="mb-0">Different</p>
                      <h6 className="text-uppercase mb-0">Room Types</h6>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                    <h1 className="flex-shrink-0 display-5 text-primary mb-0" data-toggle="counter-up">24</h1>
                    <div className="ps-4">
                      <p className="mb-0">Room</p>
                      <h6 className="text-uppercase mb-0">Units</h6>
                    </div>
                  </div>
                </div>
              </div>
              <Link to="/about" className="btn btn-primary py-3 px-5 mt-2">Read More</Link>
            </div>
          </div>
        </div>
      </div>
      {/* about end */}

      {/* room start */}
      <div className="container-xxl pt-5 pb-3">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Rooms</h5>
            <h1 className="mb-5">Our Rooms</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item text-center rounded overflow-hidden">
                <div className="rounded-circle overflow-hidden m-4">
                  <img className="img-fluid" src={roomImg1} alt="Fhandika Boutique Room" />
                </div>
                <h3 className="mb-0">Fhandika Boutique</h3>
                <p>King-size and Twin bed</p>
                <div className="d-flex justify-content-center mt-3">
                  <Link to="/rooms" className="btn btn-primary mx1">Read More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="team-item text-center rounded overflow-hidden">
                <div className="rounded-circle overflow-hidden m-4">
                  <img className="img-fluid" src={roomImg2} alt="Fhandika SS Room" />
                </div>
                <h3 className="mb-0">Fhandika SS </h3>
                <p>King-size and Twin bed</p>
                <div className="d-flex justify-content-center mt-3">
                  <Link to="/rooms" className="btn btn-primary mx1">Read More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="team-item text-center rounded overflow-hidden">
                <div className="rounded-circle overflow-hidden m-4">
                  <img className="img-fluid" src={roomImg3} alt="Fhandika DXQ Room" />
                </div>
                <h3 className="mb-0">Fhandika DXQ</h3>
                <p>Single bed</p>
                <div className="d-flex justify-content-center mt-3">
                  <Link to="/rooms" className="btn btn-primary mx1">Read More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* room end */}

      {/* destination start */}
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
                  <Link to="/attractions/ulee-lheue-beach" className="position-relative d-block overflow-hidden">
                    <img className="img-fluid" src={destination1} alt="Ulee Lheue Beach" />
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Ulee Lheue Beach</div>
                  </Link>
                </div>
                <div className="col-lg-6 col-md-12 wow zoomIn" data-wow-delay="0.3s">
                  <Link to="/attractions/masjid-raya-baiturrahman" className="position-relative d-block overflow-hidden">
                    <img className="img-fluid" src={destination2} alt="Masjid Raya Baiturrahman" />
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Masjid Raya Baiturrahman</div>
                  </Link>
                </div>
                <div className="col-lg-6 col-md-12 wow zoomIn" data-wow-delay="0.5s">
                  <Link to="/attractions/museum-aceh" className="position-relative d-block overflow-hidden">
                    <img className="img-fluid" src={destination3} alt="Museum Aceh" />
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Museum Aceh</div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-6 wow zoomIn" data-wow-delay="0.7s" style={{ minHeight: '350px' }}>
              <Link to="/attractions/museum-tsunami" className="position-relative d-block h-100 overflow-hidden">
                <img className="img-fluid position-absolute w-100 h-100" src={destination4} alt="Museum Tsunami" style={{ objectFit: 'cover' }} />
                <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">Museum Tsunami</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* destination end */}

      {/* contact start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Contact Us</h5>
            <h1 className="mb-5">Contact For Any Query</h1>
          </div>
          <div className="row g-4">
            <div className="col-12">
              <div className="row gy-4">
                <div className="col-md-4">
                  <h5 className="section-title ff-secondary fw-normal text-start text-primary">Whatsapp</h5>
                  <p><a href="https://wa.me/+628116810037" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-square-whatsapp text-primary me-2"></i>+62 811-6810-037</a></p>
                </div>
                <div className="col-md-4">
                  <h5 className="section-title ff-secondary fw-normal text-start text-primary">Instagram</h5>
                  <p><a href="https://www.instagram.com/fhandikaboutique/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-square-instagram text-primary me-2"></i>@fhandikaboutique</a></p>
                </div>
                <div className="col-md-4">
                  <h5 className="section-title ff-secondary fw-normal text-start text-primary">Email</h5>
                  <p><a href="mailto:hotel@fhandikaboutiqueinc.com"><i className="fa-solid fa-envelope text-primary me-2"></i>hotel@fhandikaboutiqueinc.com</a></p>
                </div>
              </div>
            </div>
            <div className="col-md-12 wow fadeIn" data-wow-delay="0.1s">
              <iframe
                className="position-relative rounded w-100 h-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3837.448106153578!2d95.31587521481011!3d5.550515795015737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304031799de6bfb7%3A0x440a936467fcf9f1!2sJl.%20Sultan%20Iskandar%20Muda%20No.6%2C%20Lambung%2C%20Kec.%20Meuraxa%2C%20Kota%20Banda%20Aceh%2C%20Aceh!5e0!3m2!1sen!2sid!4v1603794290143!5m2!1sen!2sid"
                style={{ minHeight: '350px', border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Location Map"
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      {/* contact end */}

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
                Copyright © 2023{" "}
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

export default Index