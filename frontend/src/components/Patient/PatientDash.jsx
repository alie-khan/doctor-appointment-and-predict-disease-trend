import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import {
  FaCalendarAlt,
  FaCog,
  FaBell,
  FaPrescriptionBottle,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/PatientDash.css";

const PatientDash = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [patient, setPatient] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/patient/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        
        );
        if (response.data.Status) {
          console.log("Patient Data:", response.data);
          setPatient(response.data.Result[0]);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <aside
          className="col-md-2 col-3 d-flex flex-column vh-100 text-white"
          style={{
            background: "#1E1E2F",
            padding: "20px",
          }}
        >
          <div className="text-center my-3">
            <img src="/images/logo.png" alt="Logo" className="img-fluid mb-2" />
            <h5 className="fw-bold">Patient Dashboard</h5>
          </div>
          <nav className="nav flex-column">
            {[
              {
                path: `/patient-dash/${id}/patientAppointment`,
                icon: <FaCalendarAlt />,
                label: "Appointments",
              },
              {
                path: `/patient-dash/${id}/prescriptionPatient`,
                icon: <FaPrescriptionBottle />,
                label: "Prescribe Medicine",
              },
              {
                path: `/patient-dash/${id}/settings`,
                icon: <FaCog />,
                label: "Settings",
              },
              {
                path: `/patient-dash/${id}/alarm`,
                icon: <FaBell />,
                label: "Alarm",
              },
            ].map((item) => (
              <Link
                key={item.path}
                className={`nav-link d-flex align-items-center mb-3 px-3 py-2 ${
                  location.pathname === item.path
                    ? "active-link text-white shadow-lg"
                    : "text-white"
                }`}
                to={item.path}
              >
                {item.icon} <span className="ms-2 fw-bold">{item.label}</span>
              </Link>
            ))}

            <button
              className="nav-link d-flex align-items-center mb-3 bg-transparent border-0"
              onClick={handleLogout}
              style={{
                color: "#E63946",
                cursor: "pointer",
                opacity: 0.9,
              }}
            >
              <FaSignOutAlt className="me-2" /> Logout
            </button>
          </nav>
        </aside>

        <main className="col-lg-10">
          <header
            className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-4"
            style={{
              background: "#25273D",
              color: "white",
            }}
          >
            <div className="d-flex align-items-center">
              <Link
                to={`/patient-dash/${id}/myprofile`}
                className="text-decoration-none"
                style={{ color: "white", fontWeight: "bold" }}
              >
                
                <img
                  src={
                    patient?.profilePic
                      ? patient.profilePic
                      : "/images/patient_image.jpg"
                  }
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  alt="Patient Profile"
                />
                Welcome, {patient ? patient.firstName : "Loading..."}!
              </Link>
            </div>

            {/* Header Buttons */}
            <div>
              <Link
                to={`/patient-dash/${id}/settings`}
                className="btn btn-outline-light me-2"
                style={{
                  background: "#1E1E2F",
                  borderColor: "#5856FF",
                  color: "#FFFFFF",
                }}
              >
                <FaCog />
              </Link>
              <Link
                to={`/patient-dash/${id}/alarm`}
                className="btn btn-outline-light me-2"
                style={{
                  background: "#1E1E2F",
                  borderColor: "#5856FF",
                  color: "#FFFFFF",
                }}
              >
                <FaBell />
              </Link>
              <Link
                className="btn"
                style={{
                  background: "#5856FF",
                  color: "white",
                  fontWeight: "bold",
                }}
                to={`/patient-dash/${id}/book-appointment/${id}`}
              >
                + New Appointment
              </Link>
            </div>
          </header>

{
  location.pathname === `/patient-dash/${id}` ? (
    <div className="text-center">
      <h2>Welcome Back, {} !</h2>
    <h6>Please click any link given in side bar</h6>
    </div>
  )
  :

  <Outlet />
}

        </main>
      </div>
    </div>
  );
};

export default PatientDash;