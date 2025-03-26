Doctor Appointment and Predict Disease Trend
📌 Overview
This project is a Doctor Dashboard that helps manage patient appointments, view patient data, edit prescriptions, suggest medicines, and set medication reminders. It also includes disease prediction and medicine stock management using machine learning.

✨ Features
📅 Appointment Management – Doctors can view and manage appointments by date.

🏥 Patient Records – View patient details, medical history, and prescriptions.

💊 Prescription & Medication Reminders – Doctors can add/edit prescriptions and set alerts for patients.

📊 Disease Trend Analysis – Visual representation of the monthly frequency of diseases.

🤖 Machine Learning Integration – Predicts upcoming disease trends and manages medicine stock accordingly.

🛠️ Technologies Used
Frontend: React (Vite)

Backend: Node.js, Express

Database: MySQL

Machine Learning: Prophet Algorithm

🚀 Setup & Installation
1️⃣ Clone the Repository

sh
Copy
Edit
git clone https://github.com/alie-khan/doctor-appointment-and-predict-disease-trend.git
cd doctor-appointment-and-predict-disease-trend
2️⃣ Install Dependencies
For frontend:

sh
Copy
Edit
cd client  
npm install  
npm run dev  
For backend:

sh
Copy
Edit
cd server  
npm install  
npm start 
3️⃣ Run the Machine Learning Model

sh
Copy
Edit
python train_model.py  

3️⃣ Run Flask Backend To Attraction frontend to train_model

python flask_backend_disease_api.py
