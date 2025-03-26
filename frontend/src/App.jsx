import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthComponent from "./components/Patient/AuthComponent.jsx";
import BookAppointment from "./components/Patient/BookAppointment.jsx";
import DrDash from "./components/Doctor/DrDash.jsx";
import MyProfile from "./components/Patient/MyProfile.jsx";
import PatientDash from "./components/Patient/PatientDash.jsx";
import PatientList from "./components/Doctor/PatientList.jsx";
import HomePage from "./components/Public/HomePage.jsx";
import MedicineStore from "./components/Doctor/MedicineStore.jsx";
import SettingsPage from "./components/Public/SettingsPage.jsx";
import AlarmPage from "./components/Patient/AlarmPage.jsx";
import AddPatient from "./components/Patient/AddPatient.jsx";
import DrLogin from "./components/Doctor/DrLogin.jsx";
import AppointmentStatus from "./components/Patient/AppointmentStatus.jsx";
import Appointments from "./components/Doctor/Appointments.jsx";
import PredictionPage from "./components/Doctor/PredictionsPage.jsx";
import PatientAppointment from "./components/Patient/PatientAppointment.jsx";
import PrescriptionPatient from "./components/Patient/PrescriptionPatient.jsx";
import MedicalStore from "./components/Doctor/MedicalStore.jsx";
import PastBills from "./components/Doctor/PastBills.jsx";
import DrProfile from "./components/Doctor/DrProfile.jsx";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthComponent />} />
          <Route path="/addpatient" element={<AddPatient />} />
          <Route path="/drlogin" element={<DrLogin />} />

          {/* Doctor Dashboard */}
          <Route path="/drdashboard" element={<DrDash />}>
            <Route path="appointments" element={<Appointments />} />
            <Route path="pastbills" element={<PastBills />} />
            <Route path="medicine-store" element={<MedicineStore />} />
            <Route path="medicine_store" element={<MedicalStore />} />
            <Route path="patient_list" element={<PatientList />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="predictionspage" element={<PredictionPage />} />
            <Route path="drprofile" element={<DrProfile />} />
          </Route>

          {/* Patient Dashboard */}
          <Route path="/patient-dash/:id" element={<PatientDash />}>
            <Route path="patientAppointment" element={<PatientAppointment />} />

            <Route
              path="prescriptionPatient"
              element={<PrescriptionPatient />}
            />
            <Route path="book-appointment/:id" element={<BookAppointment />} />
            <Route path="myprofile" element={<MyProfile />} />
            <Route path="appointment_status" element={<AppointmentStatus />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="alarm" element={<AlarmPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
