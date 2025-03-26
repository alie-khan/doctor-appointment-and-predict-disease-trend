import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function SettingsPage() {
  const [showModal, setShowModal] = useState(false);
  const [settingsData, setSettingsData] = useState({
    name: "Dr. John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    notifications: true,
  });

  const [updatedData, setUpdatedData] = useState(settingsData);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setSettingsData(updatedData);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdatedData({
      ...updatedData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mt-3 mb-4">
        <h1>Account Settings</h1>
        <p className="lead">
          Update your personal information and preferences.
        </p>
      </div>

      {/* Settings Table */}
      <div className="settings-table mb-5">
        <h3>Current Settings</h3>
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Setting</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{settingsData.name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{settingsData.email}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{settingsData.phone}</td>
            </tr>
            <tr>
              <td>Notifications</td>
              <td>{settingsData.notifications ? "Enabled" : "Disabled"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal to Edit Settings */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveChanges}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={updatedData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={updatedData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                name="phone"
                value={updatedData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formNotifications">
              <Form.Check
                type="checkbox"
                label="Enable Notifications"
                name="notifications"
                checked={updatedData.notifications}
                onChange={handleChange}
              />
            </Form.Group>
            <Button className="mt-4" variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <button className="btn btn-info" onClick={() => setShowModal(true)}>
        Edit Settings
      </button>
    </div>
  );
}

export default SettingsPage;
