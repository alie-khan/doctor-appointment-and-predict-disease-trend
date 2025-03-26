import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";  

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addPatientSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/patient/add_patient", formData)
      .then((response) => {
        if (response.data.Status) {
          navigate("/auth");
        } else {
          setMessage(response.data.Error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f2f2f2" }}
    >
      <Row className="w-100 d-flex justify-content-center">
        <Col md={6} lg={5}>
          <Card
            className="p-4 shadow-lg"
            style={{
              borderRadius: "1rem",
              background: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <h6 className="text-danger text-center">{message}</h6>

            <Card.Body>
              <h2 className="text-center mb-4" style={{ color: "#6667ab" }}>
                Add Patient
              </h2>
              <Form onSubmit={addPatientSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    required
                  />
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

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  style={{ background: "#6667ab", border: "none" }}
                >
                  Add Patient
                </Button>
              </Form>
            </Card.Body>
            <div className="text-center mt-3">
              <p className="text-muted">
                Already! have an account?{" "}
                <Link to="/auth" style={{ color: "#6667ab" }}>
                  Login here
                </Link>
              </p>
            </div>
          </Card>
        </Col>
      </Row>

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

export default AddPatient;
