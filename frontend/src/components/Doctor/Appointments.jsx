import React, { useState, useEffect } from "react";
import { FaEye, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diseaseName, setDiseaseName] = useState("");
  const [medicinesList, setMedicinesList] = useState([
    { medicine: "", dose: "", frequency: "", duration: "" },
  ]);
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [delayReason, setDelayReason] = useState("");
  const [delayTime, setDelayTime] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelAppointmentId, setCancelAppointmentId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/doctor/appointments")
      .then((response) => {
        const allAppointments = response.data.Appointments;
        const activeAppointments = allAppointments.filter(
          (appointment) => appointment.status !== "Completed"
        );

        const today = new Date().toISOString().split("T")[0];
        const todayAppointments = activeAppointments.filter(
          (appointment) => appointment.appointment_date === today
        );
        const futureAppointments = activeAppointments.filter(
          (appointment) => appointment.appointment_date > today
        );
        const pastAppointments = activeAppointments.filter(
          (appointment) => appointment.appointment_date < today
        );

        setAppointments([
          ...todayAppointments,
          ...futureAppointments,
          ...pastAppointments,
        ]);
        setFilteredAppointments([
          ...todayAppointments,
          ...futureAppointments,
          ...pastAppointments,
        ]);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
      });
  }, []);

  const handleViewPatient = (appointmentId) => {
    axios
      .get(`http://localhost:3000/doctor/patient/${appointmentId}`)
      .then((response) => {
        setSelectedPatient(response.data);
        setShowPatientModal(true);
      })
      .catch((error) => {
        console.error("Error fetching patient details:", error);
      });
  };

  const handleClosePatientModal = () => {
    setShowPatientModal(false);
    setDiseaseName("");
    setMedicinesList([{ medicine: "", dose: "", frequency: "", duration: "" }]);
  };

  const handleMedicineChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMedicines = [...medicinesList];
    updatedMedicines[index][name] = value;
    setMedicinesList(updatedMedicines);
  };

  const addMedicineField = () => {
    setMedicinesList([
      ...medicinesList,
      { medicine: "", dose: "", frequency: "", duration: "" },
    ]);
  };

  const removeMedicineField = (index) => {
    const updatedMedicines = medicinesList.filter((_, i) => i !== index);
    setMedicinesList(updatedMedicines);
  };

  const handleSavePrescription = () => {
    if (!selectedPatient) return;

    const data = {
      appointmentId: selectedPatient.appointment_id,
      diseaseName,
      medicines: medicinesList,
    };

    axios
      .post("http://localhost:3000/doctor/savePrescription", data)
      .then(() => {
        alert("Prescription saved successfully");
        setShowPatientModal(false);
      })
      .catch((error) => {
        console.error("Error saving prescription:", error);
      });

    axios
      .post("http://localhost:3000/doctor/store_disease", {
        disease_name: diseaseName,
      })
      .then(() => {
        console.log("Disease Inserted!");
      })
      .catch((err) => console.log(err));
  };

  const handleCompleteAppointment = (id) => {
    axios
      .put("http://localhost:3000/doctor/update_appointment_status", {
        id,
        status: "Completed",
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error completing appointment:", error);
      });
  };

  const handleDeleteAppointment = (id) => {
    axios
      .delete(`http://localhost:3000/doctor/delete_appointment/${id}`)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting appointment:", error);
      });
  };

  const handleShowCancelModal = (id) => {
    setCancelAppointmentId(id);
    setShowCancelModal(true);
  };

  const handleCancelAppointment = () => {
    console.log(cancelAppointmentId);
    axios
      .put("http://localhost:3000/doctor/update_appointment_status", {
        id: cancelAppointmentId,
        status: "Cancelled",
      })
      .then(() => {
        alert("Appointment cancelled successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error cancelling appointment:", error);
      });
  };

  const handleDelayAppointment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/doctor/delay_appointment",
        {
          delayReason,
          delayTime,
        }
      );

      alert(response.data.message); // Shows "Delay added for X appointments!"
    } catch (error) {
      console.error("Error adding delay:", error);
      console.log(error.response);

      alert(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-info">Appointments</h1>
        <Button
          className="btn btn-warning"
          onClick={() => setShowDelayModal(true)}
        >
          Delay Appointment
        </Button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Appointment Date</th>
            <th>Service</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr
              key={appointment.appointment_id}
              style={{
                backgroundColor:
                  appointment.status === "Cancelled"
                    ? "#ffcccc"
                    : "transparent", // Light red for cancelled
                textDecoration:
                  appointment.status === "Cancelled" ? "line-through" : "none", // Strike-through text
              }}
            >
              <td>{appointment.ptnt_name}</td>
              <td>{appointment.appointment_time}</td>
              <td>{appointment.appointment_date}</td>
              <td>{appointment.appointment_service}</td>
              <td
                style={{
                  color: appointment.status === "Cancelled" ? "red" : "orange",
                }}
              >
                {appointment.status}
              </td>
              <td>
                {appointment.status !== "Cancelled" && (
                  <>
                    <FaEye
                      className="text-primary"
                      style={{ fontSize: "15px", cursor: "pointer" }}
                      onClick={() =>
                        handleViewPatient(appointment.appointment_id)
                      }
                    />
                    <FaCheck
                      style={{
                        color: "#28a745",
                        fontSize: "15px",
                        marginLeft: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleCompleteAppointment(appointment.appointment_id)
                      }
                    />

                    <FaTimes
                      style={{
                        color: "red",
                        fontSize: "15px",
                        marginLeft: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleShowCancelModal(appointment.appointment_id)
                      }
                    />
                  </>
                )}
                <FaTrash
                  style={{
                    color: "#C9061B",
                    fontSize: "15px",
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleDeleteAppointment(appointment.appointment_id)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showPatientModal} onHide={handleClosePatientModal}>
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <div>
              <h5>Patient Name: {selectedPatient.ptnt_name}</h5>
              <p>Date of Appointment: {selectedPatient.appointment_date}</p>

              <Form.Group controlId="formDiseaseName" className="mt-3">
                <Form.Label>Disease Name</Form.Label>
                <Form.Control
                  type="text"
                  value={diseaseName}
                  onChange={(e) => setDiseaseName(e.target.value)}
                  placeholder="Disease Name"
                />
              </Form.Group>

              {medicinesList.map((medicine, index) => (
                <div key={index} className="mt-3">
                  <h6>Medicine {index + 1}</h6>
                  <Form.Control
                    className="mb-1"
                    type="text"
                    name="medicine"
                    value={medicine.medicine}
                    onChange={(e) => handleMedicineChange(index, e)}
                    placeholder="Medicine Name"
                  />
                  <Form.Control
                    className="mb-1"
                    type="text"
                    name="dose"
                    value={medicine.dose}
                    onChange={(e) => handleMedicineChange(index, e)}
                    placeholder="Dose"
                  />
                  <Form.Control
                    className="mb-1"
                    type="text"
                    name="frequency"
                    value={medicine.frequency}
                    onChange={(e) => handleMedicineChange(index, e)}
                    placeholder="Frequency"
                  />
                  <Form.Control
                    type="text"
                    name="duration"
                    value={medicine.duration}
                    onChange={(e) => handleMedicineChange(index, e)}
                    placeholder="Duration"
                  />
                  <Button
                    variant="danger"
                    onClick={() => removeMedicineField(index)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                variant="secondary"
                onClick={addMedicineField}
                className="mt-3 me-3"
              >
                + Add Medicine
              </Button>

              <Button
                variant="primary"
                onClick={handleSavePrescription}
                className="mt-3"
              >
                Save Prescription
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this appointment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleCancelAppointment}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelayModal} onHide={() => setShowDelayModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delay Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for Delay</Form.Label>
            <Form.Control
              type="text"
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              placeholder="Enter reason"
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Delay Time (in minutes)</Form.Label>
            <Form.Control
              type="number"
              value={delayTime}
              onChange={(e) => setDelayTime(e.target.value)}
              placeholder="Enter time"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelayModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDelayAppointment}>
            Confirm Delay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Appointments;
