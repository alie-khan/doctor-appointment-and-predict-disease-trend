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

📂 MySQL Database for Doctor Appointment & Disease Prediction
This folder contains the MySQL database schema and sample data for the Doctor Appointment and Disease Prediction System.

📌 Database Overview
Database Name: dr_app

Tables Included:

appointments – Stores patient appointments.

patients – Contains patient details and medical history.

doctors – Holds doctor information and specializations.

prescriptions – Stores medicines prescribed to patients.

disease_trends – Contains historical disease data for predictions.

medicine_stock – Tracks medicine inventory and alerts.

🛠️ How to Import the Database
Option 1: Using Command Line (Recommended)
1️⃣ Open Command Prompt (Windows) / Terminal (Mac/Linux).
2️⃣ Navigate to the folder where database_backup.sql is saved:

sh
Copy
Edit
cd path/to/database/folder
3️⃣ Run the following command to import the database:

sh
Copy
Edit
mysql -u root -p dr_app < database_backup.sql
(Replace root with your MySQL username.)

Option 2: Using MySQL Workbench
1️⃣ Open MySQL Workbench.
2️⃣ Go to Server → Data Import.
3️⃣ Select Import from Self-Contained File and choose database_backup.sql.
4️⃣ Choose dr_app as the target database (or create a new one).
5️⃣ Click Start Import.
