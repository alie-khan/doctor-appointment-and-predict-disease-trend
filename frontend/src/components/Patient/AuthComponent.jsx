import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 
import "animate.css";

const AuthComponent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  axios.defaults.withCredentials = true;

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const signInSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/patient/patient_login", formData, { withCredentials: true })
      .then((result) => {
        if (result.data.Status) {
          const token = result.data.token;
          localStorage.setItem("valid", true);
          localStorage.setItem("token", token);
          localStorage.setItem("patient_id", result.data.id);
          navigate("/patient-dash/" + result.data.id);
        } else {
          setMessage(result.data.Error);
        }
      })
      .catch((error) => {
        console.log("Axios Error:", error);
      });
  };

  const submitForgotPassword = () => {
    axios
      .post("http://localhost:3000/patient/forgot-password", { email: forgotEmail })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "An error occurred");
      });
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100" style={{ background: "#f2f2f2" }}>
      <Row className="w-100 d-flex justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 shadow-lg animate__animated animate__fadeIn" style={{ borderRadius: "1rem", background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
            <h6 className="text-center text-danger">{message}</h6>
            <Card.Body>
              <h2 className="text-center mb-4" style={{ color: "#6667ab" }}>Login</h2>
              <Form onSubmit={signInSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={changeHandler} required />
                </Form.Group>

                <Form.Group className="mb-3 position-relative" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                    required
                    style={{ paddingRight: "40px" }} // Ensure space for the icon
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" style={{ background: "#6667ab", border: "none" }}>Login</Button>
              </Form>

              <div className="text-center mt-3">
                <Button variant="link" className="text-muted" onClick={() => setShowForgotPassword(true)}>
                  Forgot password?
                </Button>
              </div>

              <div className="text-center mt-3">
                <p className="text-muted">
                  Don't have an account? <Link to="/addpatient" style={{ color: "#6667ab" }}>Register here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Forgot Password Modal */}
      <Modal show={showForgotPassword} onHide={() => setShowForgotPassword(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter your email</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
          </Form.Group>
          {message && <p className="text-danger mt-2">{message}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForgotPassword(false)}>Close</Button>
          <Button variant="primary" onClick={submitForgotPassword}>Reset Password</Button>
        </Modal.Footer>
      </Modal>

      {/* CSS for Eye Icon Inside Password Input */}
      <style>
        {`
          .password-toggle-icon {
            position: absolute;
            right: 10px;
            top: 70%;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 20px;
            color: #666;
          }

          .password-toggle-icon:hover {
            color: #333;
          }
        `}
      </style>
    </Container>
  );
};

export default AuthComponent;
