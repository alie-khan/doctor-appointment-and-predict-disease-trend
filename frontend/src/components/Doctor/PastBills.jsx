import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const PastBills = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 6; // UPDATED: Show 6 rows per page

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get("http://localhost:3000/doctor/bills");
      setBills(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const searchBills = async () => {
    if (!searchTerm) {
      fetchBills();
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/doctor/search?patientName=${searchTerm}`
      );
      setBills(response.data);
    } catch (error) {
      console.error("Error searching bills:", error);
    }
  };

  const viewBill = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const printBill = () => {
    window.print();
  };

  // Pagination logic
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(bills.length / billsPerPage);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Past Medical Bills</h2>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by Patient Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="mt-2" onClick={searchBills}>
          Search
        </Button>
      </Form.Group>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Total Price</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBills.length > 0 ? (
            currentBills.map((bill, index) => (
              <tr key={index}>
                <td>{bill.patient_name}</td>
                <td>Rs. {bill.total_bill}</td>
                <td>{new Date(bill.created_at).toLocaleString()}</td>
                <td>
                  <Button variant="primary" onClick={() => viewBill(bill)}>
                    View
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-danger">
                No bills found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {bills.length > billsPerPage && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {selectedBill && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Bill Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Patient: {selectedBill.patient_name}</h5>
            <p>Date: {new Date(selectedBill.created_at).toLocaleString()}</p>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(selectedBill.medicines) ? (
                  selectedBill.medicines.map((med, index) => (
                    <tr key={index}>
                      <td>{med.name}</td>
                      <td>{med.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center text-danger">
                      No medicines found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <h5>Total: Rs. {selectedBill.total_bill}</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={printBill}>
              Print Bill
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default PastBills;
