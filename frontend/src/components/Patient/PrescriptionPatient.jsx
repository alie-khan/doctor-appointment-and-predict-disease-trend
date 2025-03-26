import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PrescriptionPatient = () => {
  const [medicines, setMedicines] = useState([]);
  const { id } = useParams(); // Using patientId from URL params
console.log(id)
  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:3000/patient/prescription/${id}`)
      .then((response) => {
        if (response.data.Status) {
          setMedicines(response.data.Data);
        } else {
          setMedicines([]); // No prescription found, clear medicines
        }
      })
      .catch((error) => console.error("Error fetching prescriptions:", error));
  }, [id]);

  return (
    <div className="container mt-4">
      <h3>Prescribed Medicines</h3>
      {medicines.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-secondary">
              <tr>
                <th>Disease Name</th>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine, index) => (
                <tr key={index}>
                  <td>{medicine.disease_name}</td>
                  <td>{medicine.medicine_name}</td>
                  <td>{medicine.dose}</td>
                  <td>{medicine.frequency}</td>
                  <td>{medicine.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No prescriptions found for this patient.</p>
      )}
    </div>
  );
};

export default PrescriptionPatient;
