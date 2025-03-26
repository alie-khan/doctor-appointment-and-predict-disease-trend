import React, { useState, useEffect } from "react";
import { Table, Button, Card, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";

const MedicalStore = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/doctor/medicines"
      );
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const addMedicine = async (medicine) => {
    if (medicine.quantity > 0) {
      try {
        const updatedQuantity = medicine.quantity - 1;
        await axios.put(
          `http://localhost:3000/doctor/sell_medicines/${medicine.medicine_id}`,
          {
            quantity: updatedQuantity,
          }
        );

        setMedicines((prevMeds) =>
          prevMeds.map((med) =>
            med.medicine_id === medicine.medicine_id
              ? { ...med, quantity: updatedQuantity }
              : med
          )
        );

        const existingMed = selectedMeds.find(
          (med) => med.medicine_id === medicine.medicine_id
        );
        if (existingMed) {
          setSelectedMeds((prev) =>
            prev.map((med) =>
              med.medicine_id === medicine.medicine_id
                ? { ...med, quantity: med.quantity + 1 }
                : med
            )
          );
        } else {
          setSelectedMeds([...selectedMeds, { ...medicine, quantity: 1 }]);
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const changeQuantity = async (medicine_id, amount) => {
    const medicine = medicines.find((med) => med.medicine_id === medicine_id);
    if (!medicine || (amount > 0 && medicine.quantity <= 0)) return; // Prevent increasing beyond stock

    try {
      const updatedStock = medicine.quantity - amount;

      if (updatedStock < 0) return;

      // Update the stock in the database
      await axios.put(
        `http://localhost:3000/doctor/sell_medicines/${medicine_id}`,
        {
          quantity: updatedStock,
        }
      );

      // Update selected medicines
      setSelectedMeds((prev) =>
        prev
          .map((med) =>
            med.medicine_id === medicine_id
              ? { ...med, quantity: med.quantity + amount }
              : med
          )
          .filter((med) => med.quantity > 0)
      );

      // Update stock in state
      setMedicines((prevMeds) =>
        prevMeds.map((med) =>
          med.medicine_id === medicine_id
            ? { ...med, quantity: updatedStock }
            : med
        )
      );
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };
  const totalBill = selectedMeds.reduce(
    (total, med) => total + med.price * med.quantity,
    0
  );

  const saveBillToDatabase = async () => {
    if (!patientName || selectedMeds.length === 0) {
      alert(
        "Please enter patient name and select medicines before saving the bill."
      );
      return;
    }

    try {
      await axios.post("http://localhost:3000/doctor/save_bill", {
        patientName,
        medicines: selectedMeds,
        totalBill,
      });

      alert("Bill saved successfully!");
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  const printBill = () => {
    saveBillToDatabase();
    const printContents = document.getElementById("bill").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Medical Store</h2>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </Form.Group>

      <div className="d-flex flex-wrap gap-3">
        {medicines.map((med) => (
          <motion.div key={med.medicine_id} whileHover={{ scale: 1.05 }}>
            <Card style={{ width: "200px" }} className="p-2 shadow-sm">
              <Card.Body>
                <Card.Title>{med.name}</Card.Title>
                <Card.Text>Price: Rs. {med.price}</Card.Text>
                <Card.Text>Stock: {med.quantity}</Card.Text>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addMedicine(med)}
                  disabled={med.quantity <= 0}
                >
                  Add
                </Button>
              </Card.Body>
            </Card>
          </motion.div>
        ))}
      </div>

      <h3 className="mt-4">Selected Medicines</h3>
      {selectedMeds.length > 0 ? (
        <div id="bill" className="p-3 border rounded shadow-sm bg-white">
          <h4>Patient: {patientName || "N/A"}</h4>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedMeds.map((med) => (
                <tr key={med.medicine_id}>
                  <td>{med.name}</td>
                  <td>{med.quantity}</td>
                  <td>Rs. {med.price}</td>
                  <td>Rs. {med.price * med.quantity}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => changeQuantity(med.medicine_id, -1)}
                    >
                      -
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="ms-2"
                      onClick={() => changeQuantity(med.medicine_id, 1)}
                    >
                      +
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h5>Total Bill: Rs. {totalBill}</h5>
          <Button variant="warning" onClick={printBill}>
            Print Bill
          </Button>
        </div>
      ) : (
        <p>No medicines selected</p>
      )}
    </div>
  );
};

export default MedicalStore;