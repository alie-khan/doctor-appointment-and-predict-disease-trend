import React, { useState, useEffect } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import axios from "axios";
import "../styles/AlarmPage.css";
import alarmSound from "../../assets/take_your_medicine.mp3";
import { useParams } from "react-router-dom";

function AlarmPage() {
  const [showModal, setShowModal] = useState(false);
  const [alarmTime, setAlarmTime] = useState("");
  const [alarms, setAlarms] = useState([]);
  const [alertAlarm, setAlertAlarm] = useState(null);
  const [medicine, setMedicine] = useState("");

  const { id } = useParams();
  let audio = new Audio(alarmSound);

  useEffect(() => {
    fetchAlarms();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAlarms();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [alarms]);

  const fetchAlarms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/patient/alarms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlarms(res.data);
    } catch (error) {
      console.error("Error fetching alarms:", error);
    }
  };

  const handleSetAlarm = async (e) => {
    e.preventDefault();
    const formattedTime = `${alarmTime}:00`;
    const newAlarm = { id, time: formattedTime, medicine:medicine};
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/patient/alarms", newAlarm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAlarms();
      setShowModal(false);
    } catch (error) {
      console.error("Error setting alarm:", error);
    }
  };

  const handleDeleteAlarm = async (alarmId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/patient/alarms/${alarmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAlarms();
    } catch (error) {
      console.error("Error deleting alarm:", error);
    }
  };

  const checkAlarms = () => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    alarms.forEach((alarm) => {
      const [alarmHours, alarmMinutes] = alarm.time.split(":").map(Number);
      if (currentHours === alarmHours && currentMinutes === alarmMinutes) {
        setAlertAlarm(alarm); // Show modal with alarm details
        audio.play();
      }
    });
  };

  const handleCloseAlarm = () => {
    setAlertAlarm(null);
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1>Medicine Reminder</h1>
        <p className="lead">Set alarms to remind yourself of medications.</p>
      </div>

      <h3>Your Alarms</h3>
      <ListGroup>
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <ListGroup.Item
              key={alarm.id}
              className="d-flex justify-content-between align-items-center"
            >
              <span>{alarm.time}</span>
              <h6>{alarm.medicine_name}</h6>
              <Button variant="danger" onClick={() => handleDeleteAlarm(alarm.id)}>
                Delete
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No alarms set yet.</ListGroup.Item>
        )}
      </ListGroup>
      {/* Modal to Set Alarm */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Alarm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSetAlarm}>
            <Form.Group controlId="formAlarmTime">
              <Form.Label>Alarm Time</Form.Label>
              <Form.Control
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                required
              />
              <Form.Label>Medicine Name</Form.Label>
              <Form.Control
              type="medicine"
              onChange={(e)=> setMedicine(e.target.value)}
              />

            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Set Alarm
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Alarm Notification Modal */}
      {alertAlarm && (
        <Modal show={true} onHide={handleCloseAlarm}>
          <Modal.Header closeButton>
            <Modal.Title>Time to Take Medicine!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Medicine: {alertAlarm.medicine_name}</h4>
            <p>Time: {alertAlarm.time}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseAlarm}>
              Dismiss
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <button className="btn btn-info mt-3" onClick={() => setShowModal(true)}>
        Set New Alarm
      </button>
    </div>
  );
}

export default AlarmPage;