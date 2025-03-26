import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

function PatientList() {

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [appointmentId, setAppointmentId] = useState(null);
  const [prescription, setPrescription] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/doctor/appointments")
      .then((response) => {
        // console.log(response.data.appointments.appointment_date)
        console.log(response.data.Appointments);
        setPatients(response.data.Appointments);
        setFilteredPatients(response.data.Appointments);
      })
      .catch((err) => console.error("Error fetching appointments:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/doctor/prescription/${appointmentId}`)
      .then((response) => {
        setPrescription(response.data.Result);
      })
      .catch((err) => console.log(err));
  }, [appointmentId]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = patients.filter(
      (patient) =>
        patient.ptnt_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.ptnt_phone.includes(searchTerm) ||
        patient.ptnt_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
    setShowSearchModal(false);
  };

  const handleDateSearch = () => {
    const filtered = patients.filter(
      (patient) => patient.appointment_date === searchDate
    );
    setFilteredPatients(filtered);
  };

  const handleViewDetails = (patient) => {
    setAppointmentId(patient.appointment_id);
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };
console.log(selectedPatient)
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="display-5">Patients and Appointments</h1>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => setShowSearchModal(true)}
          >
            Search
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            Search by Date
          </button>
        </div>
      </div>

      {showDatePicker && (
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleDateSearch}>
            Search by Date
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Appointment Date</th>
              <th>Time</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <tr key={index}>
                  <td>{patient.ptnt_name}</td>
                  <td>{patient.ptnt_phone}</td>
                  <td>{patient.appointment_date}</td>
                  <td>{patient.appointment_time}</td>
                  <td>{patient.appointment_service}</td>
                  <td>{patient.status}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewDetails(patient)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Modal show={showSearchModal} onHide={() => setShowSearchModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Patients</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="searchTerm">
              <Form.Label>Search by Name, Phone, Email, or Status</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter details"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Search
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div>
              <p>
                <strong>Name:</strong> {selectedPatient.ptnt_name}
              </p>
              <p>
                <strong>Phone:</strong> {selectedPatient.ptnt_phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedPatient.ptnt_email || "N/A"}
              </p>
              <p>
                <strong>Appointment Date:</strong>{" "}
                {selectedPatient.appointment_date}
              </p>
              <p>
                <strong>Time:</strong> {selectedPatient.appointment_time}
              </p>
              <p>
                <strong>Service:</strong> {selectedPatient.appointment_service}
              </p>
              <p>
                <strong>Status:</strong> {selectedPatient.status}
              </p>
              <h5>Prescribed Medicines:</h5>

              <ul>
                {prescription && prescription.length > 0 ? (
                  prescription.map((med, index) => (
                    <li key={index}>
                      {med.medicine_name} - {med.dose}, {med.frequency},{" "}
                      {med.duration}
                    </li>
                  ))
                ) : (
                  <p>No prescribed medicines.</p>
                )}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PatientList;