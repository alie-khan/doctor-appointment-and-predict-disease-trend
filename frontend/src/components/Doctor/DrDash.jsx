import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaStore,
  FaCog,
  FaMicroscope,
  FaClipboardList,
  FaSignOutAlt,
  FaPills,
  FaUserMd,
  FaUserInjured,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import "../styles/DrDash.css";

const DrDash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drData, setDrData] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/doctor/doctor_data",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setDrData(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="container-fluid m-0 vh-100 p-0 d-flex">
      {/* Sidebar */}
      <aside className="col-md-2 col-1 bg-primary text-white d-flex flex-column">
        <div className="text-center">
          <img
            style={{ width: 150 }}
            src="/images/logo.png"
            alt="Logo"
            className="img-fluid mb-2 pt-5"
          />
          <hr />
        </div>
        <nav className="nav flex-column">
          {[
            {
              path: "/drdashboard/appointments",
              icon: <FaClipboardList />,
              label: "Appointments",
            },
            {
              path: "/drdashboard/patient_list",
              icon: <FaUserInjured />,
              label: "Patients",
            },
            {
              path: "/drdashboard/medicine-store",
              icon: <FaPills />,
              label: "Medicine",
            },
            {
              path: "/drdashboard/medicine_store",
              icon: <FaStore />,
              label: "Medical Store",
            },
            {
              path: "/drdashboard/pastbills",
              icon: <FaFileInvoiceDollar />,
              label: "Past Bills",
            },

            {
              path: "/drdashboard/drprofile",
              icon: <FaUserMd />,
              label: "Profile",
            },

            {
              path: "/drdashboard/settings",
              icon: <FaCog />,
              label: "Settings",
            },
            {
              path: "/drdashboard/predictionspage",
              icon: <FaMicroscope />,
              label: "Disease Predict",
            },
          ].map((item) => (
            <Link
              key={item.path}
              className={`nav-link d-flex align-items-center px-3 py-2 ${
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
            className="nav-link d-flex align-items-center px-3 py-2 bg-transparent border-0"
            style={{
              color: "#E63946",
              cursor: "pointer",
              opacity: 0.9,
            }}
            onClick={logout}
          >
            <FaSignOutAlt /> <span className="ms-2 fw-bold">LogOut</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="col-md-9 col-lg-10 p-4">
        {location.pathname === "/drdashboard" ? (
          <div className="text-center">
            <h2 className="text-primary">Welcome, {drData.name}!</h2>
            <p className="text-muted">
              Please select an option from the sidebar.
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default DrDash;
