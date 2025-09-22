import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import BookingForm from "./BookingForm";

const Room = () => {
  // State untuk menyimpan data keranjang
  const [cart, setCart] = useState({});
  const [totalRooms, setTotalRooms] = useState(0);
  const navigate = useNavigate();

  

  // Data kamar
  const rooms = [
    {
      id: 1,
      name: "Fhandika Boutique",
      image: "/src/assets/img/kamar.jpg",
      description: "Luxury, industrial chic, spacious, sleek, indulgence, ultimate.",
      showmore: "Experience the pinnacle of luxury in our Fhandika Boutique, an embodiment of industrial chic style. This spacious and luxurious suite features high ceilings and large windows that offer spectacular views of the cityscape. Immerse yourself in the sleek and modern design, with carefully selected industrial-inspired furnishings and artistic accents. Relax in the separate seating area, indulge in the luxurious bathroom, and experience the comfort of a king-sized bed. Fhandika Boutique is the ultimate choice for guests seeking a highend industrial experience. Enjoy complimentary breakfast and dinner for 2 people, as well as free laundry service for up to 5 pieces of clothing during your stay.",
      size: "21 sqm",
      beds: "King-size bed",
      price: 1377000,
      priceDisplay: "IDR 1377K",
      sliderImages: [
        "/src/assets/img/room-slider/1.jpg",
        "/src/assets/img/room-slider/2.jpg",
        "/src/assets/img/room-slider/3.jpg",
        "/src/assets/img/room-slider/7.jpg",
        "/src/assets/img/room-slider/5.jpg",
        "/src/assets/img/room-slider/6.jpg"
      ]
    },
    {
      id: 2,
      name: "Fhandika SS",
      image: "/src/assets/img/kamar2.jpeg",
      description: "Contemporary, rugged charm, harmonious, modern amenities, unique decor, style and comfort.",
      showmore: "Step into the Industrial Fhandika SS and be greeted by a blend of contemporary comfort and rugged charm. This room showcases harmoniously integrated industrial elements with modern amenities. Relax on the comfortable king-size bed and appreciate the unique industrial-themed decor. The room offers a perfect balance between style and comfort for guests who wish to experience the industrial aesthetics. Enjoy complimentary breakfast for 2 people.",
      size: "18 sqm",
      beds: "King-size and Twin bed",
      price: 1077000,
      priceDisplay: "IDR 1077K",
      sliderImages: [
        "/src/assets/img/room-slider/1.jpg",
        "/src/assets/img/room-slider/2.jpg",
        "/src/assets/img/room-slider/3.jpg",
        "/src/assets/img/room-slider/4.jpg",
        "/src/assets/img/room-slider/5.jpg",
        "/src/assets/img/room-slider/8.jpg"
      ]
    },
    {
      id: 3,
      name: "Fhandika DXQ",
      image: "/src/assets/img/kamar1.jpeg",
      description: "Cozy, inviting, industrial flair, well-appointed, contemporary furnishings, urban energy.",
      showmore: "Our Fhandika DXQ Room provides a cozy and inviting retreat with a touch of industrial flair. This well-appointed room features subtle industrial accents in the design, complemented by contemporary furnishings. Enjoy a good night's sleep in the comfortable single bed, make use of the modern amenities, and feel the urban energy that surrounds you. The Urban Standart Room is ideal for travelers seeking a comfortable stay with a hint of industrial inspiration.Enjoy complimentary breakfast for 2 people.",
      size: "15 sqm",
      beds: "Single bed",
      price: 877000,
      priceDisplay: "IDR 877K",
      sliderImages: [
        "/src/assets/img/room-slider/1.jpg",
        "/src/assets/img/room-slider/2.jpg",
        "/src/assets/img/room-slider/3.jpg",
        "/src/assets/img/room-slider/4.jpg",
        "/src/assets/img/room-slider/5.jpg",
        "/src/assets/img/room-slider/8.jpg"
      ]
    }
  ];

  // State untuk slider
  const [currentSlideIndex, setCurrentSlideIndex] = useState({});

  // Fungsi untuk mengubah slide
  const changeSlide = (roomId, imageIndex) => {
    setCurrentSlideIndex(prev => ({
      ...prev,
      [roomId]: imageIndex
    }));
  };

  // Fungsi untuk menambah kamar ke keranjang
  const addToCart = (roomId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      newCart[roomId] = (newCart[roomId] || 0) + 1;
      return newCart;
    });
  };

  // Fungsi untuk mengurangi kamar dari keranjang
  const removeFromCart = (roomId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[roomId] > 0) {
        newCart[roomId] -= 1;
        if (newCart[roomId] === 0) {
          delete newCart[roomId];
        }
      }
      return newCart;
    });
  };

  // Update total kamar saat cart berubah
  useEffect(() => {
    const total = Object.values(cart).reduce((sum, count) => sum + count, 0);
    setTotalRooms(total);
  }, [cart]);

  // Komponen untuk counter kamar
  const RoomCounter = ({ roomId, count = 0 }) => (
    <div className="d-flex align-items-center justify-content-between mt-3">
      <div className="d-flex align-items-center">
        <button
          className="btn btn-outline-dark btn-sm me-2"
          onClick={() => removeFromCart(roomId)}
          disabled={count === 0}
          style={{ width: '30px', height: '30px', padding: '0' }}
        >
          -
        </button>
        <span className="mx-2 fw-bold">{count}</span>
        <button
          className="btn btn-outline-dark btn-sm ms-2"
          onClick={() => addToCart(roomId)}
          style={{ width: '30px', height: '30px', padding: '0' }}
        >
          +
        </button>
      </div>
      <div className="text-end">
        <small className="text-muted">FROM</small>
        <div className="fw-bold">{rooms.find(r => r.id === roomId)?.priceDisplay}</div>
      </div>
    </div>
  );

  // Komponen Slider untuk Modal
  const ImageSlider = ({ room }) => {
    const currentIndex = currentSlideIndex[room.id] || 0;

    return (
      <div className="port-slider-container">
        {/* Main slider */}
        <div className="port-slider mb-3">
          <img
            src={room.sliderImages[currentIndex]}
            alt={`${room.name} - Image ${currentIndex + 1}`}
            className="img-fluid rounded"
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
        </div>

        {/* Navigation thumbnails */}
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

  // Fungsi untuk handle select (checkout)
  // const handleSelect = () => {
  //   if (totalRooms === 0) {
  //     alert('Please select at least one room');
  //     return;
  //   }

  //   const cartItems = Object.entries(cart).map(([roomId, count]) => {
  //     const room = rooms.find(r => r.id === parseInt(roomId));
  //     return {
  //       room: room.name,
  //       count: count,
  //       price: room.price,
  //       total: room.price * count
  //     };
  //   });

  //   console.log('Cart Items:', cartItems);
  //   console.log('Total Rooms:', totalRooms);

  //   // Di sini Anda bisa redirect ke halaman checkout atau booking
  //   // navigate('/checkout', { state: { cartItems, totalRooms } });
  //   alert(`Selected ${totalRooms} room(s). Check console for details.`);
  // };


  const handleSelect = () => {
    if (totalRooms === 0) {
      alert("Please select at least one room");
      return;
    }
  
    const cartItems = Object.entries(cart).map(([roomId, count]) => {
      const room = rooms.find((r) => r.id === parseInt(roomId));
      return {
        id: room.id,
        name: room.name,
        count,
        price: room.price,
        total: room.price * count,
      };
    });
  
    navigate("/rooms/book", { state: { cartItems, totalRooms } });
  };


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
              <Link to="/" className="nav-item nav-link">Home</Link>
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
      {/* navbar and hero end */}

      {/* Room Section Start */}
      <div id="rooms">
        <div className="container">
          <div className="section-header">
            <h2>Our Rooms</h2>
            <p>
              Fhandika Hotel offers four elegant industrial-style room types, each providing a comfortable sleeping experience. The Fhandika Boutique embodies luxury and spaciousness, with sleek design elements. The Industrial Fhandika
              SS blends contemporary comfort with rugged charm, showcasing harmonious industrial elements. The Fhandika DXQ Room offers a cozy and inviting retreat with subtle industrial accents.
            </p>
          </div>

          {/* Room Cards */}
          <div className="row">
            {rooms.map((room) => (
              <div key={room.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                  {/* Room Image */}
                  <div className="position-relative">
                    <img
                      src={room.image}
                      className="card-img-top"
                      alt={room.name}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 opacity-0 hover-opacity-100 transition-opacity">
                      <h5 className="text-white text-center">{room.name}</h5>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold mb-2">{room.name}</h5>
                    <p className="card-text text-muted small mb-3">{room.description}</p>

                    {/* Room Details */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <i className="fa fa-expand text-muted me-2"></i>
                        <small>Size: {room.size}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="fa fa-bed text-muted me-2"></i>
                        <small>Beds: {room.beds}</small>
                      </div>
                    </div>

                    {/* Room Icons */}
                    <div className="mb-3">
                      <div className="d-flex gap-2">
                        <i className="fa fa-wifi text-muted" title="WiFi"></i>
                        <i className="fa fa-tv text-muted" title="TV"></i>
                        <i className="fa fa-snowflake text-muted" title="AC"></i>
                        <i className="fa fa-bath text-muted" title="Bathroom"></i>
                        <i className="fa fa-car text-muted" title="Parking"></i>
                        <i className="fa fa-utensils text-muted" title="Restaurant"></i>
                        <i className="fa fa-concierge-bell text-muted" title="Room Service"></i>
                      </div>
                    </div>

                    {/* Counter and Price */}
                    <div className="mt-auto">
                      <RoomCounter roomId={room.id} count={cart[room.id] || 0} />
                    </div>

                    {/* Read More Button */}
                    <div className="mt-3">
                      <button
                        className="btn btn-outline-primary btn-sm w-100"
                        data-bs-toggle="modal"
                        data-bs-target={`#modal-${room.id}`}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Select Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-warning btn-lg px-5 py-3 fw-bold"
              onClick={handleSelect}
              disabled={totalRooms === 0}
              style={{
                backgroundColor: '#f0ad4e',
                borderColor: '#f0ad4e',
                borderRadius: '25px',
                fontSize: '18px'
              }}
            >
              Select → {totalRooms > 0 && <span className="badge bg-dark ms-2">{totalRooms}</span>}
            </button>
          </div>
        </div>
      </div>
      {/* Room Section End */}

      {/* Modals for Room Details dengan Slider */}
      {rooms.map((room) => (
        <div key={`modal-${room.id}`} className="modal fade" id={`modal-${room.id}`} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{room.name}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">&times;</button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    {/* Image Slider */}
                    <ImageSlider room={room} />
                  </div>
                  <div className="col-12">
                    <h2>{room.name}</h2>
                    <p>{room.showmore}</p>

                    <div className="row">
                      <div className="col-md-6">
                        <h6>Room Details:</h6>
                        <ul className="list-unstyled">
                          <li><i className="fa fa-expand me-2"></i>Size: {room.size}</li>
                          <li><i className="fa fa-bed me-2"></i>Beds: {room.beds}</li>
                          <li><i className="fa fa-tag me-2"></i>Price: {room.priceDisplay}</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6>Amenities:</h6>
                        <ul className="list-unstyled">
                          <li><i className="fa fa-wifi me-2"></i>Free WiFi</li>
                          <li><i className="fa fa-tv me-2"></i>LED TV</li>
                          <li><i className="fa fa-snowflake me-2"></i>Air Conditioning</li>
                          <li><i className="fa fa-bath me-2"></i>Private Bathroom</li>
                          <li><i className="fa fa-car me-2"></i>Free Parking</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addToCart(room.id)}
                  data-bs-dismiss="modal"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

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

      <style jsx>{`
        .hover-opacity-100:hover {
          opacity: 1 !important;
        }
        .transition-opacity {
          transition: opacity 0.3s ease-in-out;
        }
        .card:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease-in-out;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

      <BookingForm />
    </div>
  )
}

export default Room