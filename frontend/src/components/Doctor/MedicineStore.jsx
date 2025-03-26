import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const MedicineStore = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentMedicine, setCurrentMedicine] = useState({});
  const [formData, setFormData] = useState({ name: "", quantity: 0, price: 0 });

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

  const handleShowModal = (type, medicine = {}) => {
    setModalType(type);
    setCurrentMedicine(medicine);
    setFormData(medicine);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: "", quantity: 0, price: 0 });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (formData.name === "" || formData.quantity === 0 || formData.price) {
      return;
    }
    try {
      if (modalType === "Add") {
        const response = await axios.post(
          "http://localhost:3000/doctor/medicines",
          formData
        );
        setMedicines([...medicines, { ...formData, id: response.data.id }]);
      } else if (modalType === "Edit") {
        if (!currentMedicine.medicine_id) {
          console.error("Medicine ID is undefined!");
          return;
        }
        await axios.put(
          `http://localhost:3000/doctor/edit_medicines/${currentMedicine.medicine_id}`,
          formData
        );
        setMedicines(
          medicines.map((medicine) =>
            medicine.id === currentMedicine.medicine_id
              ? { ...currentMedicine, ...formData }
              : medicine
          )
        );
        fetchMedicines();
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  const handleDelete = async (medicine_id) => {
    try {
      await axios.delete(
        `http://localhost:3000/doctor/delete_medicines/${medicine_id}`
      );
      fetchMedicines();
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Medicine Store</h2>
        <Button variant="success" onClick={() => handleShowModal("Add")}>
          <FaPlus /> Add Medicine
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Search Medicines..."
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="row">
        {filteredMedicines.map((medicine) => (
          <div className="col-md-4 mb-4" key={medicine.id}>
            <div className="card shadow-sm p-3 bg-light border-primary rounded">
              <div className="card-body">
                <h5 className="card-title text-primary">{medicine.name}</h5>
                <p className="card-text">
                  Quantity: {medicine.quantity} <br />
                  Price: Rs. {medicine.price}
                </p>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="info"
                    onClick={() => handleShowModal("Edit", medicine)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(medicine.medicine_id)}
                  >
                    <FaTrashAlt /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType} Medicine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Medicine Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter medicine name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                placeholder="Enter quantity"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                placeholder="Enter price"
              required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MedicineStore;
