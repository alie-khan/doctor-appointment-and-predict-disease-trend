import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyProfile = () => {
  const [profilePic, setProfilePic] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3000/patient/profile", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        const { firstName, lastName, email, contactNumber, profilePic } =
          res.data;
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email);
        setContactNumber(contactNumber);
        if (profilePic) setProfilePic(profilePic);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const previewProfilePic = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");

    axios
      .put("http://localhost:3000/patient/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProfilePic(res.data.imageUrl))
      .catch((err) => console.error("Error uploading image:", err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    axios
      .put(
        "http://localhost:3000/patient/profile",
        { firstName, lastName, contactNumber, profilePic },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => setMessage("Profile updated successfully!"), navigate(-1))
      .catch((err) => console.error("Error updating profile:", err));
  };

  return (
    <div className="container my-5 w-75">
      {message && <div className="alert alert-success">{message}</div>}
      <div className="card shadow-lg p-4">
        <h1 className="text-center">My Profile</h1>
        <form onSubmit={handleSubmit} className="row">
          <div className="text-center mb-3">
            <label htmlFor="profilePic" className="d-block mb-2">
              <img
                src={profilePic || "/images/patient_image.jpg"}
                alt="Profile"
                className="rounded-circle"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              className="form-control d-none"
              onChange={previewProfilePic}
            />
            <button
              type="button"
              className="btn btn-outline-secondary w-25"
              onClick={() => document.getElementById("profilePic").click()}
            >
              Change Picture
            </button>
          </div>
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Contact Number</label>
            <input
              type="tel"
              className="form-control"
              pattern="[0-9]{11}"
              required
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
          <div className="d-flex w-100 mt-2">
            <button type="submit" className="btn btn-primary form-control">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;