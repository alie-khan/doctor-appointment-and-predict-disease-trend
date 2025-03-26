// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const PatientAppointment = () => {
//   const { id } = useParams();
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     if (!id) return;

//     axios
//       .get(`http://localhost:3000/doctor/appointments/${id}`)
//       .then((response) => {
//         setAppointments(response.data), console.log(response.data);
//       })
//       .catch((error) => console.error("Error fetching appointments:", error));
//   }, [id]);

//   return (
//     <div>
//       {/* Appointments Table */}
//       <section className="mb-5">
//         <h3>Appointments</h3>
//         <div className="table-responsive">
//           <table className="table table-striped table-hover">
//             <thead className="" style={{ background: "#c1c1c1" }}>
//               <tr>
//                 <th scope="col">#</th>
//                 <th scope="col">Date</th>
//                 <th scope="col">Time</th>
//                 <th scope="col">Contact Number</th>
//                 <th scope="col">Service</th>
//                 <th scope="col">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {appointments.length > 0 ? (
//                 appointments.map((appointment) => (
//                   <tr key={appointment.id}>
//                     <th scope="row">{appointment.appointment_id}</th>
//                     <td>{appointment.appointment_date}</td>
//                     <td>{appointment.appointment_time}</td>
//                     <td>{appointment.ptnt_phone}</td>
//                     <td>{appointment.appointment_service}</td>
//                     <td>
//                       <span
//                         className={`badge ${
//                           appointment.status === "Completed"
//                             ? "bg-primary"
//                             : appointment.status === "Cancelled"
//                             ? "bg-danger"
//                             : "bg-warning"
//                         }`}
//                       >
//                         {appointment.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="text-center">
//                     No appointments found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default PatientAppointment;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PatientAppointment = () => {
  const { id } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [delays, setDelays] = useState([]);
  const [ongoingAppointmentId, setOngoingAppointmentId] = useState(null);
  
useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:3000/doctor/appointments/${id}`)
      .then((response) => {
        setAppointments(response.data);

        const ongoing = response.data.find((appt) => appt.status === "Ongoing");
        if (ongoing) {
          setOngoingAppointmentId(ongoing.appointment_id);
        }
      })

      .catch((error) => console.error("Error fetching appointments:", error));
   
  }, [id]);
console.log(ongoingAppointmentId);
useEffect(()=>{
  axios
  .get(`http://localhost:3000/doctor/delays/${ongoingAppointmentId}`)
  .then((response) => {
    setDelays(response.data);
    console.log(delays)
  })
  .catch((error) => console.error("Error fetching delays:", error));
},[ongoingAppointmentId])


  const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  return (
    <div>
      {/* Show Delay Message for today's ongoing appointments */}
      {delays.length > 0 &&
        delays.map((delay, index) => (
          <div
            key={index}
            className="alert alert-warning"
            style={{ color: "#856404", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}
          >
            <strong>Delay Reason:</strong> {delay.delayReason} | <strong>Expected Delay:</strong> {delay.delayTime} minutes
          </div>
        ))}

      {/* Appointments Table */}
      <section className="mb-5">
        <h3>Appointments</h3>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead style={{ background: "#c1c1c1" }}>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Time</th>
                <th>Contact Number</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <th scope="row">{appointment.appointment_id}</th>
                    <td>{appointment.appointment_date}</td>
                    <td>{appointment.appointment_time}</td>
                    <td>{appointment.ptnt_phone}</td>
                    <td>{appointment.appointment_service}</td>
                    <td>
                      <span
                        className={`badge ${
                          appointment.status === "Completed"
                            ? "bg-primary"
                            : appointment.status === "Cancelled"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PatientAppointment;
