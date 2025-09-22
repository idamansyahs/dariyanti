import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
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
                            <Link to="/about" className="nav-item nav-link active">About</Link>

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
                        <h1 className="display-3 text-white mb-3 animated slideInDown">About Us</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb justify-content-center text-uppercase">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item text-white active" aria-current="page">About</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            {/* navbar and hero end */}

            {/* about start */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6">
                            <div className="row g-3">
                                <div className="col-6 text-start">
                                    <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.1s" src="/src/assets/img/2.jpg" />
                                </div>
                                <div className="col-6 text-start">
                                    <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.3s" src="/src/assets/img/3.jpg" style={{ marginTop: '25%' }} />
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid rounded w-75 wow zoomIn" data-wow-delay="0.5s" src="/src/assets/img/1.jpg" />
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.7s" src="/src/assets/img/4.jpg" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <h5 className="section-title ff-secondary text-start text-primary fw-normal">About Us</h5>
                            <h1 className="mb-4">Welc<i className="fa fa-solid fa-magnifying-glass text-primary me-2"></i>me to FBI</h1>
                            <p className="mb-4">
                                Fhandika Boutique Inc. is a hotel that offers a unique experience with an industrial concept. With a
                                design adorned in the colors of yellow, gray, and black, and murals gracing every corner, you will be
                                immersed in a vibrant
                                and energetic ambiance from the moment you step foot into the hotel.
                            </p>
                            <p className="mb-4">
                                Fhandika Boutique Inc. draws inspiration from modern and trendy industrial design. You will be greeted
                                with a primary color palette consisting of yellow, gray, and black, creating an atmosphere that is both
                                elegant and
                                contemporary. This combination of colors brings forth a bold and characterful impression.
                            </p>
                            <p className="mb-4">
                                Inside each room, you will discover captivating details. Carefully selected, luxurious furniture with
                                industrial-inspired metal accents provides comfort while exuding sophistication. The hotel walls are
                                adorned with murals
                                depicting the beauty and uniqueness of different corners of the world. Every corner of the room is
                                designed to create comfort and tranquility, while the stunning panoramic views from the windows will
                                transport you to a world
                                of serenity.                          </p>
                            <p className="mb-4">
                                In addition, the hotel features a coffee shop located in the lobby, serving as the perfect place to relax
                                while enjoying a delightful cup of coffee. With a cozy atmosphere and intriguing decor, you can savor a
                                variety of
                                high-quality coffees while appreciating the carefully crafted interior.
                            </p>
                            <p className="mb-4">
                                Don't forget to visit the rooftop restaurant, offering spectacular views and a romantic ambiance. The
                                restaurant is an ideal spot to celebrate special moments or simply indulge in delicious cuisine
                                accompanied by a
                                refreshing atmosphere. Guests can relish delectable dishes served with expertise while enjoying
                                breathtaking city views from above.
                            </p>
                            <p className="mb-4">
                                Fhandika Boutique Inc. is dedicated to providing an unforgettable stay experience, where you can immerse
                                yourself in the modern industrial design concept, surrounded by inspiring murals, and indulge in comfort
                                and
                                personalized service. Enjoy a tranquil and peaceful atmosphere at this hotel, ensuring that your
                                experience here will be a cherished and unforgettable memory.
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
                        </div>
                    </div>
                </div>
            </div>
            {/* about end */}

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

export default About