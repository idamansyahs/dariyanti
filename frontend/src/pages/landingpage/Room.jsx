import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

// Impor semua gambar yang dibutuhkan di bagian atas file
import kamarImg1 from '/src/assets/img/kamar.jpg';
import kamarImg2 from '/src/assets/img/kamar2.jpeg';
import kamarImg3 from '/src/assets/img/kamar1.jpeg';
import slider1 from '/src/assets/img/room-slider/1.jpg';
import slider2 from '/src/assets/img/room-slider/2.jpg';
import slider3 from '/src/assets/img/room-slider/3.jpg';
import slider4 from '/src/assets/img/room-slider/4.jpg';
import slider5 from '/src/assets/img/room-slider/5.jpg';
import slider6 from '/src/assets/img/room-slider/6.jpg';
import slider7 from '/src/assets/img/room-slider/7.jpg';
import slider8 from '/src/assets/img/room-slider/8.jpg';


// Komponen Slider dipindah ke luar agar tidak di-render ulang
const ImageSlider = ({ room, currentSlideIndex, changeSlide }) => {
  const currentIndex = currentSlideIndex[room.id] || 0;

  return (
    <div className="port-slider-container">
      <div className="port-slider mb-3">
        <img
          src={room.sliderImages[currentIndex]}
          alt={`${room.name} - Image ${currentIndex + 1}`}
          className="img-fluid rounded"
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
      </div>
      <div className="port-slider-nav">
        <div className="d-flex gap-2 flex-wrap">
          {room.sliderImages.map((image, index) => (
            <div key={index} className="thumbnail-container">
              <img
                src={image}
                alt={`${room.name} - Thumbnail ${index + 1}`}
                className={`img-thumbnail cursor-pointer ${currentIndex === index ? 'active-thumb' : ''}`}
                style={{
                  width: '80px',
                  height: '60px',
                  objectFit: 'cover',
                  opacity: currentIndex === index ? '1' : '0.6'
                }}
                onClick={() => changeSlide(room.id, index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const Room = () => {
  // Data kamar sekarang didefinisikan langsung di dalam komponen
  const rooms = [
    {
      id: 1,
      name: "Fhandika Boutique",
      image: kamarImg1,
      description: "Luxury, industrial chic, spacious, sleek, indulgence, ultimate.",
      showmore: "Experience the pinnacle of luxury in our Fhandika Boutique, an embodiment of industrial chic style. This spacious and luxurious suite features high ceilings and large windows that offer spectacular views of the cityscape. Immerse yourself in the sleek and modern design, with carefully selected industrial-inspired furnishings and artistic accents. Relax in the separate seating area, indulge in the luxurious bathroom, and experience the comfort of a king-sized bed. Fhandika Boutique is the ultimate choice for guests seeking a highend industrial experience. Enjoy complimentary breakfast and dinner for 2 people, as well as free laundry service for up to 5 pieces of clothing during your stay.",
      size: "21 sqm",
      beds: "King-size bed",
      price: 1377000,
      priceDisplay: "IDR 1377K",
      sliderImages: [slider1, slider2, slider3, slider7, slider5, slider6]
    },
    {
      id: 2,
      name: "Fhandika SS",
      image: kamarImg2,
      description: "Contemporary, rugged charm, harmonious, modern amenities, unique decor, style and comfort.",
      showmore: "Step into the Industrial Fhandika SS and be greeted by a blend of contemporary comfort and rugged charm. This room showcases harmoniously integrated industrial elements with modern amenities. Relax on the comfortable king-size bed and appreciate the unique industrial-themed decor. The room offers a perfect balance between style and comfort for guests who wish to experience the industrial aesthetics. Enjoy complimentary breakfast for 2 people.",
      size: "18 sqm",
      beds: "King-size and Twin bed",
      price: 1077000,
      priceDisplay: "IDR 1077K",
      sliderImages: [slider1, slider2, slider3, slider4, slider5, slider8]
    },
    {
      id: 3,
      name: "Fhandika DXQ",
      image: kamarImg3,
      description: "Cozy, inviting, industrial flair, well-appointed, contemporary furnishings, urban energy.",
      showmore: "Our Fhandika DXQ Room provides a cozy and inviting retreat with a touch of industrial flair. This well-appointed room features subtle industrial accents in the design, complemented by contemporary furnishings. Enjoy a good night's sleep in the comfortable single bed, make use of the modern amenities, and feel the urban energy that surrounds you. The Urban Standart Room is ideal for travelers seeking a comfortable stay with a hint of industrial inspiration.Enjoy complimentary breakfast for 2 people.",
      size: "15 sqm",
      beds: "Single bed",
      price: 877000,
      priceDisplay: "IDR 877K",
      sliderImages: [slider1, slider2, slider3, slider4, slider5, slider8]
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState({});
  const navigate = useNavigate();

  const changeSlide = (roomId, imageIndex) => {
    setCurrentSlideIndex(prev => ({ ...prev, [roomId]: imageIndex }));
  };
  
  const handleBookNow = (room) => {
    navigate("/rooms/booking", { state: { roomToBook: room } });
  };


  return (
    <div className="container-xxl bg-white p-0">
      {/* Navbar and Hero */}
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
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Lava.</a>
                <div className="dropdown-menu bg-light m-0">
                  <Link to="/lava" className="dropdown-item">About Lava.</Link>
                  <Link to="/lava-gallery" className="dropdown-item">Gallery Lava.</Link>
                  <Link to="/menu" className="dropdown-item">Menu Lava.</Link>
                </div>
              </div>
              <Link to="/attraction" className="nav-item nav-link">Attraction</Link>
              <Link to="/rooms" className="nav-item nav-link active">Rooms</Link>
              <Link to="/gallery" className="nav-item nav-link">Gallery</Link>
              <Link to="/contact" className="nav-item nav-link">Contact</Link>
              <Link to="/login" className="nav-item nav-link">Login</Link>
            </div>
          </div>
        </nav>
        <div className="container-xxl py-5 bg-dark hero-header mb-5">
          <div className="container text-center my-5 pt-5 pb-4">
            <h1 className="display-3 text-white mb-3 animated slideInDown">Our Rooms</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center text-uppercase">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item text-white active" aria-current="page">Rooms</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {/* End Navbar and Hero */}

      {/* Room Section Start */}
      <div id="rooms" className="container py-5">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Our Rooms</h5>
            <h1 className="mb-5">Explore Our Rooms</h1>
        </div>

        {/* Room Cards */}
        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 * room.id}s`}>
              <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                <div className="position-relative">
                  <img src={room.image} className="card-img-top" alt={room.name} style={{ height: '250px', objectFit: 'cover' }} />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold mb-2">{room.name}</h5>
                  <p className="card-text text-muted small mb-3">{room.description}</p>
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-1"><i className="fa fa-expand text-muted me-2"></i><small>Size: {room.size}</small></div>
                    <div className="d-flex align-items-center"><i className="fa fa-bed text-muted me-2"></i><small>Beds: {room.beds}</small></div>
                  </div>
                  <div className="text-end mt-auto">
                    <small className="text-muted">FROM</small>
                    <h5 className="fw-bold mb-0">{room.priceDisplay}</h5>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-outline-primary btn-sm w-100" data-bs-toggle="modal" data-bs-target={`#modal-${room.id}`}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Room Section End */}

      {/* Modals for Room Details */}
      {rooms.map((room) => (
        <div key={`modal-${room.id}`} className="modal fade" id={`modal-${room.id}`} tabIndex="-1" aria-labelledby={`modalLabel-${room.id}`} aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`modalLabel-${room.id}`}>{room.name}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-lg-7">
                    <ImageSlider room={room} currentSlideIndex={currentSlideIndex} changeSlide={changeSlide} />
                  </div>
                  <div className="col-lg-5">
                    <h4>Room Details</h4>
                    <p className="small">{room.showmore}</p>
                    <ul className="list-unstyled">
                      <li><i className="fa fa-expand fa-fw me-2"></i>Size: {room.size}</li>
                      <li><i className="fa fa-bed fa-fw me-2"></i>Beds: {room.beds}</li>
                      <li><i className="fa fa-tag fa-fw me-2"></i>Price: {room.priceDisplay}/night</li>
                    </ul>
                    <h6>Amenities:</h6>
                    <div className="d-flex flex-wrap small">
                        <span className="me-3 mb-2"><i className="fa fa-wifi fa-fw me-1"></i>WiFi</span>
                        <span className="me-3 mb-2"><i className="fa fa-tv fa-fw me-1"></i>TV</span>
                        <span className="me-3 mb-2"><i className="fa fa-snowflake fa-fw me-1"></i>AC</span>
                        <span className="me-3 mb-2"><i className="fa fa-bath fa-fw me-1"></i>Bathroom</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleBookNow(room)}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
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

      {/* CSS is now back inside the component */}
      <style jsx>{`
        .hover-opacity-100:hover {
          opacity: 1 !important;
        }
        .transition-opacity {
          transition: opacity 0.3s ease-in-out;
        }
        .card:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .active-thumb {
          border: 2px solid #007bff !important;
          opacity: 1 !important;
        }
        .thumbnail-container img {
          transition: opacity 0.3s ease, border 0.3s ease;
        }
        .thumbnail-container img:hover {
          opacity: 1 !important;
        }
        .port-slider-container {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}

export default Room;