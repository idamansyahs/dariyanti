import React from 'react'
import { Link } from 'react-router-dom'

// 1. Impor gambar yang digunakan
import lavaImg from '/src/assets/img/2.jpg';

const Lava = () => {
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
                {/* 2. Tambahkan 'active' class pada item dropdown yang sesuai */}
                <div className="dropdown-menu bg-light m-0">
                  <Link to="/lava" className="dropdown-item active">About Lava.</Link>
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
            <h1 className="display-3 text-white mb-3 animated slideInDown">About Lava.</h1>
            <nav aria-label="breadcrumb">
              {/* 3. Perbaiki struktur breadcrumb */}
              <ol className="breadcrumb justify-content-center text-uppercase">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item text-white active" aria-current="page">Lava.</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {/* navbar and hero end */}

      {/* About Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 ">
            <div className=" col-md-5 wow fadeInUp" data-wow-delay="0.1s">
              {/* Gunakan gambar yang sudah diimpor */}
              <img className="img-fluid rounded" src={lavaImg} alt="Lava Coffee and Eatery interior" />
            </div>
            <div className=" col-md-7 wow fadeInUp" data-wow-delay="0.3s">
              <h1 className="text-primary mb-4">Lava. Coffee and Eatery</h1>
              <p className="mb-4">Experience an unforgettable dining affair at our exquisite rooftop restaurant,
                where we have created a truly captivating ambiance with a color palette of yellow, black,
                and gray. The combination of these hues exudes a sense of vibrancy and sophistication,
                setting the stage for a delightful culinary journey.</p>
              <p className="mb-4">With a generous capacity to accommodate up to 125 guests, our rooftop restaurant
                offers a spacious setting, ensuring ample room for you and your companions to relax and
                enjoy the experience. Whether you're planning an intimate gathering or a larger celebration,
                our restaurant provides the perfect backdrop for any occasion.</p>
              <p className="mb-4">Prepare to indulge in a gastronomic feast as our talented culinary team crafts a
                menu that is bound to tantalize your taste buds. Begin your culinary journey with a
                selection of tantalizing appetizers, carefully curated to awaken your senses and whet your
                appetite. From crispy and flavorful starters to delicate and refreshing salads, our
                appetizers are designed to excite and prepare your palate for the delights to come.</p>
              <p className="mb-4">Continuing the culinary adventure, our menu boasts an array of mouthwatering
                main courses that cater to various preferences. Whether you crave succulent meats, fresh
                seafood, or enticing vegetarian options, our chefs showcase their expertise in crafting
                dishes that harmonize flavors and textures to perfection. Each bite will transport you to a
                realm of culinary bliss, leaving you satisfied and craving for more.</p>
              <p className="mb-4">No dining experience is complete without a sweet finale, and our irresistible
                desserts are sure to leave a lasting impression. Indulge in decadent creations crafted with
                passion and precision, ranging from classic favorites to innovative confections. From
                velvety chocolate delights to fruity and refreshing treats, our dessert selection is a
                symphony of flavors that will tantalize your taste buds and provide the perfect ending to
                your meal.</p>
              <p className="mb-4">Beyond the delectable cuisine, our rooftop restaurant offers attentive and
                personalized service to ensure your dining experience is flawless. Our dedicated staff is
                committed to delivering exceptional service, catering to your every need and ensuring that
                you feel pampered and well taken care of throughout your visit.</p>
              <p className="mb-4">Whether you're seeking a casual meal with friends, a romantic dinner for two, or
                a special celebration, our rooftop restaurant promises to create lasting memories. From the
                stunning ambiance and delectable cuisine to the attentive service, every element has been
                carefully curated to provide an unforgettable dining experience. Join us and embark on a
                culinary journey that will leave you longing for more.</p>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

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

export default Lava