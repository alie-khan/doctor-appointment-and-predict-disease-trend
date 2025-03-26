import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

const DrProfile = () => {
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3000/doctor/drprofile", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        const { name, profilePic, email } = res.data;
        setName(name);
        setEmail(email);
        if (profilePic) setProfilePic(profilePic);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleProfileUpdate = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .put(
        "http://localhost:3000/doctor/drprofile",
        { name, profilePic },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setMessage("Profile updated successfully!");
        setTimeout(() => navigate(-1), 1500); // Wait 1.5 sec before navigation
      })
      .catch((err) => setError("Error updating profile. Try again later."));
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    axios
      .put(
        "http://localhost:3000/doctor/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setMessage(res.data.message);
        setTimeout(() => navigate(-1), 1500); // Redirect after showing message
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to update password")
      );
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");

    axios
      .put("http://localhost:3000/doctor/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfilePic(res.data.imageUrl);
        setMessage("Profile picture updated successfully!");
      })
      .catch((err) => setError("Error uploading image. Try again."));
  };

  return (
    <div className="container my-5 w-75">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow-lg p-4">
        <h1 className="text-center">My Profile</h1>

        {/* Profile Update Form */}
        <form onSubmit={handleProfileUpdate} className="row">
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
              onChange={handleProfilePicChange}
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
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
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
          <div className="d-flex w-100 mt-3">
            <button type="submit" className="btn btn-primary form-control">
              Save
            </button>
          </div>
        </form>

        {/* Change Password Form */}
        <h2 className="mt-4 text-center">Change Password</h2>
        <form onSubmit={handleChangePassword} className="row">
          <div className="col-md-6">
            <label className="form-label">Current Password</label>
            <input
               type={showCurrentPassword ? "text" : "password"}
              className="form-control"
              value={currentPassword}
              required
              style={{ paddingRight: "40px" }}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
                <span
              className="password-toggle-icon"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <div className="col-md-6">
            <label className="form-label">New Password</label>
            <input
               type={showPassword ? "text" : "password"}
              className="form-control"
              value={newPassword}
              required
              style={{ paddingRight: "40px" }}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <div className="d-flex w-100 mt-3">
            <button type="submit" className="btn btn-danger form-control">
              Update Password
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          .password-toggle-icon {
            position: absolute;
            right: 10px;
            top: 60%;
            padding-right:10px;
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

export default DrProfile;
