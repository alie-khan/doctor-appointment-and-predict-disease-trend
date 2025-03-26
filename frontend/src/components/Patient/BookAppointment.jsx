
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// const BookAppointment = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const today = new Date().toISOString().split("T")[0];

//   const [formData, setFormData] = useState({
//     patientName: "",
//     phone: "",
//     date: "",
//     timeOfDay: "morning",
//     time: "",
//     serviceType: "general",
//   });

//   const [bookedSlots, setBookedSlots] = useState([]); // Store booked slots

//   useEffect(() => {
//     if (formData.date) {
//       axios.get(`http://localhost:3000/get-booked-slots?date=${formData.date}`)
//         .then(response => setBookedSlots(response.data))
//         .catch(error => console.error(error));
//     }
//   }, [formData.date]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     axios.post(`http://localhost:3000/doctor/book-appointment/${id}`, formData)
//       .then(() => {
//         alert("Your Appointment Confirmed");
//         navigate(-1);
//       })
//       .catch((err) => {
//         alert(err.response?.data?.Message || "Error booking appointment");
//       });
//   };

//   return (
//     <div className="container d-flex align-items-center justify-content-center">
//       <div className="row w-75">
//         <div className="col-lg-10 v-50 p-4 border rounded shadow-sm bg-white">
//           <h1 className="mb-5">Book Your Appointment Now</h1>
//           <form onSubmit={handleSubmit}>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <label className="form-label fw-bold">Patient's Full Name</label>
//                 <input type="text" name="patientName" className="form-control" value={formData.patientName} onChange={handleChange} required />
//               </div>
//               <div className="col-md-6 mb-3">
//                 <label className="form-label fw-bold">Mobile Number</label>
//                 <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required pattern="\d{11}" title="Phone number must be 11 digits" />
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <label className="form-label fw-bold">Appointment Date</label>
//                 <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} min={today} required />
//               </div>
//               <div className="col-md-6 mb-3">
//                 <label className="form-label fw-bold">Preferred Time of Day</label>
//                 <select name="timeOfDay" className="form-select" value={formData.timeOfDay} onChange={handleChange}>
//                   <option value="morning">Morning (09:00 AM - 01:00 PM)</option>
//                   <option value="afternoon">Afternoon (01:01 PM - 05:00 PM)</option>
//                 </select>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <label className="form-label fw-bold">Appointment Time</label>
//                 <select name="time" className="form-select" value={formData.time} onChange={handleChange} required>
//                   {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map(slot => (
//                     <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
//                       {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-md-6 mb-3">
//                 <label className="form-label fw-bold">Service Type</label>
//                 <select name="serviceType" className="form-select" value={formData.serviceType} onChange={handleChange}>
//                   <option value="general">General Consultation</option>
//                   <option value="specialist">Specialist Consultation</option>
//                   <option value="course">Course Consultation</option>
//                 </select>
//               </div>
//             </div>
//             <div className="d-flex justify-content-between">
//               <button type="button" className="btn btn-outline-secondary" onClick={() => window.history.back()}>Go Back</button>
//               <button type="submit" className="btn btn-primary">Get Your Appointment</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointment;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    date: "",
    timeOfDay: "morning",
    time: "",
    serviceType: "general",
  });

  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    if (formData.date) {
      axios.get(`http://localhost:3000/get-booked-slots?date=${formData.date}`)
        .then(response => setBookedSlots(response.data))
        .catch(error => console.error(error));
    }
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Define available slots based on selected time of day
  const getAvailableSlots = () => {
    if (formData.timeOfDay === "morning") {
      return ["09:00", "10:00", "11:00", "12:00"];
    } else if (formData.timeOfDay === "afternoon") {
      return ["13:00", "14:00", "15:00", "16:00"];
    } else {
      return ["17:00", "18:00", "19:00", "20:00"]; // Evening slots
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`http://localhost:3000/doctor/book-appointment/${id}`, formData)
      .then(() => {
        alert("Your Appointment Confirmed");
        navigate(-1);
      })
      .catch((err) => {
        alert(err.response?.data?.Message || "Error booking appointment");
      });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center">
      <div className="row w-75">
        <div className="col-lg-10 v-50 p-4 border rounded shadow-sm bg-white">
          <h1 className="mb-5">Book Your Appointment Now</h1>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Patient's Full Name</label>
                <input type="text" name="patientName" className="form-control" value={formData.patientName} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Mobile Number</label>
                <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required pattern="\d{11}" title="Phone number must be 11 digits" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Appointment Date</label>
                <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} min={today} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Preferred Time of Day</label>
                <select name="timeOfDay" className="form-select" value={formData.timeOfDay} onChange={handleChange}>
                  <option value="morning">Morning (09:00 AM - 01:00 PM)</option>
                  <option value="afternoon">Afternoon (01:01 PM - 05:00 PM)</option>
                  <option value="evening">Evening (05:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Appointment Time</label>
                <select name="time" className="form-select" value={formData.time} onChange={handleChange} required>
                  {getAvailableSlots().map(slot => (
                    <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                      {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Service Type</label>
                <select name="serviceType" className="form-select" value={formData.serviceType} onChange={handleChange}>
                  <option value="general">General Consultation</option>
                  <option value="specialist">Specialist Consultation</option>
                  <option value="course">Course Consultation</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-outline-secondary" onClick={() => window.history.back()}>Go Back</button>
              <button type="submit" className="btn btn-primary">Get Your Appointment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
