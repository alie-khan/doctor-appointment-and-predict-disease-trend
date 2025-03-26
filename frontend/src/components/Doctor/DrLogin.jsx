import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 

const DrLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const signInSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/doctor/doctor_login", formData)
      .then((result) => {
        if (result.data.Status) {
          localStorage.setItem("token", result.data.token);
          navigate("/drdashboard");
        } else {
          setMessage(result.data.Error);
        }
      })
      .catch((error) => console.log(error));
  };

  const handlePasswordReset = () => {
    axios
      .post("http://localhost:3000/doctor/forgot_password", { email: resetEmail })
      .then((response) => {
        setMessage(response.data.Error);
      })
      .catch(() => {
        setMessage("Error sending reset email.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f2f2f2" }}>
      <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "1rem", background: "rgba(255, 255, 255, 0.2)" }}>
        {message && <h6 className="text-center text-danger">{message}</h6>}

        <h2 className="text-center mb-4" style={{ color: "#6667ab" }}>Doctor Login</h2>
        <Form onSubmit={signInSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={changeHandler} required />
          </Form.Group>

          <Form.Group className="mb-3 position-relative">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={changeHandler}
              required
              style={{ paddingRight: "40px" }}
            />
            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" style={{ background: "#6667ab", border: "none" }}>
            Sign In
          </Button>
        </Form>

        <div className="text-center mt-3">
          <a onClick={() => setShowModal(true)} style={{ color: "#667eea", textDecoration: "none", cursor: "pointer" }}>
            Forgot Password?
          </a>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Enter your email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
            </Form.Group>
          </Form>
          {message && <p className="text-success">{message}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handlePasswordReset}>Send Reset Email</Button>
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
    </div>
  );
};

export default DrLogin;
