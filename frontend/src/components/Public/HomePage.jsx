import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  NavDropdown,
  Container,
  Row,
  Col,
  Card,
  Carousel,
  Button,
  Form,
} from "react-bootstrap";
import {
  FaStethoscope,
  FaAmbulance,
  FaUserMd,
  FaHeartbeat,
  FaClinicMedical,
  FaSyringe,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { Link as ScrollLink, Element } from "react-scroll";
import slide1 from "/images/doctor-image1.jpg";
import slide2 from "/images/doctor-image2.jpg";
import slide3 from "/images/doctor-image3.jpg";
import "../styles/HomePage.css";

const HomePage = () => {
  const [expanded, setExpanded] = useState(false);
  const services = [
    {
      icon: <FaStethoscope />,
      title: "General Checkup",
      description:
        "Comprehensive health checkups for all age groups with expert medical advice.",
    },
    {
      icon: <FaAmbulance />,
      title: "Emergency Care",
      description:
        "24/7 emergency services with advanced medical support and rapid response.",
    },
    {
      icon: <FaUserMd />,
      title: "Specialist Consultation",
      description:
        "Consultations with experienced specialists across various medical fields.",
    },
    {
      icon: <FaHeartbeat />,
      title: "Cardiology",
      description:
        "Advanced cardiology services including heart screening, monitoring, and treatment.",
    },
    {
      icon: <FaClinicMedical />,
      title: "Outpatient Services",
      description:
        "High-quality outpatient services for diagnosis, treatment, and follow-ups.",
    },
    {
      icon: <FaSyringe />,
      title: "Vaccination",
      description:
        "Wide range of vaccinations for adults and children in a safe environment.",
    },
  ];

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark compact-navbar fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src="/images/logo.png" style={{ width: 60 }} alt="Logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="text-white justify-content-center d-flex">
            <div className="pe-3 text_hover">
              <ScrollLink
                to="home"
                smooth={true}
                duration={100}
                className="nav-link"
              >
                Home
              </ScrollLink>
            </div>

            <div className="pe-3 text_hover">
              <ScrollLink
                to="about"
                smooth={true}
                duration={100}
                className="nav-link"
              >
                About
              </ScrollLink>
            </div>

            <div className="pe-3 text_hover">
              <ScrollLink
                to="services"
                smooth={true}
                duration={100}
                className="nav-link"
              >
                Services
              </ScrollLink>
            </div>

            <div className="pe-3 text_hover">
              <ScrollLink
                to="contact"
                smooth={true}
                duration={100}
                className="nav-link"
                onClick={() => setExpanded(false)}
              >
                Contact
              </ScrollLink>
            </div>

            <div className="pe-5 text_hover">
              <NavDropdown title="Action" id="basic-nav-dropdown">
                <NavDropdown.Item href="/auth">Patient</NavDropdown.Item>
                <NavDropdown.Item href="/drlogin">Doctor</NavDropdown.Item>
              </NavDropdown>
            </div>
          </div>
        </div>
      </nav>

      <Element name="home" className="hero-section">
        <div className="p-4">
          <div
            className="w-100"
            style={{ height: "100px", background: (12, 55, 55, 0.5) }}
          ></div>
        </div>
      </Element>
      <Element name="services" className="service-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Our Medical Services</h2>
            <p className="section-subtitle">
              We provide a wide range of medical services to meet your
              healthcare needs.
            </p>
          </div>
          <Row>
            {services.map((service, index) => (
              <Col key={index} md={6} lg={4} className="mb-4">
                <Card className="service-card h-100 text-center">
                  <Card.Body>
                    <div className="service-icon">{service.icon}</div>
                    <Card.Title className="service-title mt-3">
                      {service.title}
                    </Card.Title>
                    <Card.Text className="service-description">
                      {service.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </Element>

      {/* Similar Element Wrapping for About and Contact Sections */}
      <Element name="about" className="about-section py-5">
        <section className="about-section py-5">
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-title">About Our Medical Facility</h2>
              <p className="section-subtitle">
                Delivering quality healthcare services with professionalism and
                compassion.
              </p>
            </div>
            <Carousel className="about-carousel">
              {/* Slide 1 */}
              <Carousel.Item>
                <div className="carousel-content">
                  <img
                    className="d-block w-100 about-image"
                    src={slide1}
                    alt="Slide 1"
                  />
                  <Carousel.Caption>
                    <h3 className="carousel-title">
                      State-of-the-Art Facility
                    </h3>
                    <p className="carousel-description">
                      We utilize the latest technology to provide the best
                      possible care for our patients.
                    </p>
                  </Carousel.Caption>
                </div>
              </Carousel.Item>

              {/* Slide 2 */}
              <Carousel.Item>
                <div className="carousel-content">
                  <img
                    className="d-block w-100 about-image"
                    src={slide2}
                    alt="Slide 2"
                  />
                  <Carousel.Caption>
                    <h3 className="carousel-title">Experienced Specialists</h3>
                    <p className="carousel-description">
                      Our team of highly qualified doctors and medical staff are
                      dedicated to your well-being.
                    </p>
                  </Carousel.Caption>
                </div>
              </Carousel.Item>

              {/* Slide 3 */}
              <Carousel.Item>
                <div className="carousel-content">
                  <img
                    className="d-block w-100 about-image"
                    src={slide3}
                    alt="Slide 3"
                  />
                  <Carousel.Caption>
                    <h3 className="carousel-title">Compassionate Care</h3>
                    <p className="carousel-description">
                      We believe in personalized treatment with a focus on
                      comfort and care.
                    </p>
                    <Button variant="primary" className="learn-more-btn">
                      Learn More
                    </Button>
                  </Carousel.Caption>
                </div>
              </Carousel.Item>

              <Carousel.Item>
                <div className="carousel-content">
                  <img
                    className="d-block w-100 about-image"
                    src={slide3}
                    alt="Slide 4"
                  />
                  <Carousel.Caption>
                    <h3 className="carousel-title">Compassionate Care</h3>
                    <p className="carousel-description">
                      We believe in personalized treatment with a focus on
                      comfort and care.
                    </p>
                    <Button variant="primary" className="learn-more-btn">
                      Learn More
                    </Button>
                  </Carousel.Caption>
                </div>
              </Carousel.Item>
            </Carousel>
          </Container>
        </section>
      </Element>

      <Element name="contact" className="contact-section py-5">
        <section className="contact-section py-5">
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-title">Get in Touch</h2>
              <p className="section-subtitle">
                We'd love to hear from you! Contact us with any questions or
                concerns.
              </p>
            </div>
            <Row>
              {/* Contact Form */}
              <Col md={7} className="mb-4">
                <div className="contact-form-wrapper">
                  <Form>
                    <Form.Group controlId="formName" className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formEmail" className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formMessage" className="mb-3">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Type your message here..."
                        required
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      className="contact-submit-btn"
                    >
                      Send Message
                    </Button>
                  </Form>
                </div>
              </Col>
              {/* Contact Details */}
              <Col md={5}>
                <div className="contact-info mt-2">
                  <h3 className="contact-info-title">Contact Information</h3>
                  <p className="contact-info-description">
                    You can reach us through the following contact details or
                    fill out the form to send us a message directly.
                  </p>
                  <ul className="contact-details">
                    <li>
                      <FaPhoneAlt className="contact-icon" /> Phone: +1 (234)
                      567-8900
                    </li>
                    <li>
                      <FaEnvelope className="contact-icon" /> Email:
                      info@medicalwebsite.com
                    </li>
                    <li>
                      <FaMapMarkerAlt className="contact-icon" /> Address: 123
                      Health St, Medical City, Country
                    </li>
                  </ul>

                  <div className="social-links">
                    <Link
                      className="me-4 ms-3"
                      to="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook className="social-icon" />
                    </Link>
                    <Link
                      className="me-4"
                      to="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter className="social-icon" />
                    </Link>
                    <Link
                      to="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram className="social-icon" />
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Element>

      <footer className="footer-section py-5">
        <Container>
          <Row>
            {/* About Section */}
            <Col md={4} className="mb-4">
              <h5 className="footer-title">About Us</h5>
              <p className="footer-description">
                We are dedicated to providing quality healthcare services with a
                compassionate and professional approach. Our state-of-the-art
                facility and experienced team ensure the best care for all our
                patients.
              </p>
            </Col>
            {/* Quick Links */}
            <Col md={2} className="mb-4 ">
              <h5 className="text-start">Quick Links</h5>
              <ol className="text-start">
                <div className="text_hover">
                  <ScrollLink
                    to="home"
                    smooth={true}
                    duration={100}
                    className="nav-link"
                  >
                    Home
                  </ScrollLink>
                </div>

                <div className="text_hover">
                  <ScrollLink
                    to="about"
                    smooth={true}
                    duration={100}
                    className="nav-link"
                  >
                    About
                  </ScrollLink>
                </div>

                <div className="text_hover">
                  <ScrollLink
                    to="services"
                    smooth={true}
                    duration={100}
                    className="nav-link"
                  >
                    Services
                  </ScrollLink>
                </div>

                <div className="text_hover">
                  <ScrollLink
                    to="contact"
                    smooth={true}
                    duration={100}
                    className="nav-link"
                    onClick={() => setExpanded(false)}
                  >
                    Contact
                  </ScrollLink>
                </div>
              </ol>
            </Col>
            {/* Contact Information */}
            <Col md={3} className="mb-4">
              <h5 className="text-start">Contact Us</h5>
              <ul className="text-start">
                <li>
                  <FaPhoneAlt className="contact-icon" /> +1 (234) 567-8900
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />{" "}
                  info@medicalwebsite.com
                </li>
                <li>
                  <FaMapMarkerAlt className="contact-icon" /> 123 Health St,
                  Medical City, Country
                </li>
              </ul>
            </Col>
            {/* Newsletter Subscription */}
            <Col md={3} className="mb-4">
              <h5 className="text-start">Newsletter</h5>
              <p className="text-start">
                Subscribe to our newsletter to get the latest updates and news.
              </p>
              <Form className="newsletter-form">
                <Form.Group controlId="formNewsletterEmail" className="mb-3">
                  <Form.Control type="email" placeholder="Enter your email" />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="subscribe-btn"
                >
                  Subscribe
                </Button>
              </Form>
            </Col>
          </Row>
          <div className="footer-bottom mt-4">
            <Row className="align-items-center">
              {/* Social Media Links */}
              <Col md={6} className="text-center text-md-left mb-3 mb-md-0">
                <div className="social-links">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook className="social-icon" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter className="social-icon" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="social-icon" />
                  </a>
                </div>
              </Col>
              {/* Copyright Information */}
              <Col md={6} className="text-center text-md-right">
                <p className="footer-copyright">
                  &copy; 2024 Medical Website. All rights reserved.
                </p>
              </Col>
            </Row>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
